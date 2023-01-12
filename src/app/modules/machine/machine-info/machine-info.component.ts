import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef, ViewRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Machine, SessionService } from 'gen/typescript-angular-client';
import { IModalDialogSettings, ModalDialogService } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AirgpuApiService, MachinePrice } from 'src/app/core/http/airgpu-api.service';
import { ConfigureMachineComponent } from '../configure-machine/configure-machine.component';
import { ConnectionInfoComponent } from '../connection-info/connection-info.component';
import { DeleteMachineComponent } from '../delete-machine/delete-machine.component';

export interface MachineUpdate {
  error?: string
  status?: string
}

@Component({
  selector: 'app-machine-info',
  templateUrl: './machine-info.component.html',
  styleUrls: ['./machine-info.component.scss']
})
export class MachineInfoComponent implements OnChanges {
  @Input() machine: Machine
  @Input() credit: number
  @Input() machinePrices: MachinePrice[]
  @Output() update = new EventEmitter<MachineUpdate | undefined>()


  private modalSettings: Partial<IModalDialogSettings> = {
    overlayClass: "w-full h-screen fixed inset-0 bg-gray-800 opacity-80",
    modalClass:
      "overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex",
    modalDialogClass: "bg-gray-900 rounded -mt-20",
    buttonClass:
      "bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded mr-2",
    contentClass: "m-5",
    headerClass: "text-2xl text-white mb-10 title-font text-center",
    footerClass: "mt-10",
  };

  starting = false;
  stopping = false;
  useSpareServers = false

  currentMachinePrice?: number
  spareCapacitySavings?: number

  dataCenterLocations = {
    "ap-south-1": "Asia Pacific (Mumbai)",
    "ap-northeast-2": "Asia Pacific (Seoul)",
    "ap-southeast-1": "Asia Pacific (Singapore)",
    "ap-southeast-2": "Asia Pacific (Sydney)",
    "ap-northeast-1": "Asia Pacific (Tokyo)",
    "ca-central-1": "Canada (Central)",
    "eu-west-1": "Europe (Dublin)",
    "eu-central-1": "Europe (Frankfurt)",
    "eu-west-2": "Europe (London)",
    "eu-west-3": "Europe (Paris)",
    "eu-north-1": "Europe (Stockholm)",
    "me-south-1": "Middle East (Bahrain)",
    "us-east-1": "US East (N. Virginia)",
    "us-east-2": "US East (Ohio)",
    "us-west-1": "US West (N. California)",
    "us-west-2": "US West (Oregon)",
    
    "na-us-nyc-1": "US East (New York)",
    "na-us-chi-1": "US East (Chicago)",
    "na-us-las-1": "US West (Las Vegas)"
  };

  gpuModelNames = {
    'QUADRO_4000': 'Nvidia Quadro RTX 4000',
    'A4000': 'Nvidia RTX A4000',
    'A5000': 'Nvidia RTX A5000'
  }

  passwordCopyLabel = "Copy";
  passwordShowLabel = "Show";
  passwordShown = false;

  contextMenuCollapsed = true;

  constructor(
    private airgpuApi: AirgpuApiService,
    private modalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private sessionService: SessionService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.machine?.currentValue && !this.machine) {
      return
    }

    // update machine price
    this.updateCurrentMachinePrice()

    // if machine is in transition state, poll until status changes
    switch (this.machine.status) {
      case "starting": {
        this.starting = true
        this.airgpuApi.pollUntilMachineInitializing(this.machine.id).subscribe(m => {
          if (m.status === 'off') {
            this.update.emit({
              error: 'Failed to start airgpu, no capacity available'
            })
          } else {
            this.update.emit()
          }
        })
        break
      }
      case "initializing": {
        this.starting = true
        this.airgpuApi.pollUntilMachineStarted(this.machine.id).subscribe(m => {
          if (m.status === 'off') {
            this.update.emit({
              error: 'Failed to start airgpu, no capacity available'
            })
          } else {
            this.update.emit()
          }
        })
        break
      }
      case "stopping": {
        this.stopping = true
        this.airgpuApi.pollUntilMachineStopped(this.machine.id).subscribe(() => this.update.emit())
        break
      }
      case "backing_up": {
        this.stopping = false
        this.airgpuApi.pollUntilMachineBackedUp(this.machine.id).subscribe(() => this.update.emit())
        break
      }
      case "running": {
        this.starting = false
        break
      }
    }

    // get current session
    this.sessionService.listSessions({
      account: this.machine.account,
      machine: this.machine.id,
      isFinished: false
    }).subscribe(sessions => {
      if (sessions.length > 0) {
        this.useSpareServers = sessions[0].provisioning_type === 'spot'
        this.updateCurrentMachinePrice()
      }
    })
  }

  public startMachine(machine: Machine) {
    if (machine.status === 'backing_up') {
      this.update.emit({
        error: 'Your airgpu is being backed up, please try again once the backup has completed'
      })
      return
    }

    if (this.credit < 0.25 * this.currentMachinePrice) {
      this.update.emit({
        error: `You don't have enough credit to start your airgpu`
      })
      return
    }

    this.starting = true;

    this.airgpuApi
      .startMachine(machine.id, {
        provisioning_type: this.useSpareServers ? 'spot' : 'on-demand'
      })
      .subscribe(
        () => {
          this.update.emit()
        },
        (err) => {
          this.starting = false;
          this.update.emit({
            error: 'Failed to start your airgpu, please make sure you have sufficient credit and contact us if the issue persists'
          })
          throw err
        }
      );
  }

  public stopMachine(machine: Machine) {
    this.stopping = true;
    this.airgpuApi
      .stopMachine(machine.id)
      .subscribe(
        () => {
          this.update.emit({
            status: 'stopping'
          })
        },
        err => {
          this.stopping = false;
          this.update.emit({
            error: 'Failed to stop your airgpu, please try again in a moment'
          })
          throw err
        }
      );
  }

  public passwordCopied(event: any) {
    this.passwordCopyLabel = "Copied!";
    setTimeout(() => {
      this.passwordCopyLabel = "Copy";
    }, 2000);
  }

  public toggleShowPassword() {
    this.passwordShown = !this.passwordShown;
    this.passwordShowLabel = this.passwordShown ? 'Hide' : 'Show';
  }

  public openConfirmDeletionDialog(machineId: string) {
    this.modalService.openDialog(this.viewRef, {
      title: "Confirm Deletion",
      childComponent: DeleteMachineComponent,
      settings: this.modalSettings,
      data: {
        machineId
      },
      actionButtons: [
        { text: 'Cancel', buttonClass: 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2', onAction: () => true },
        {
          text: 'Delete machine', buttonClass: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2', onAction: () => {
            return this.airgpuApi.deleteMachine(this.machine.id).pipe(tap(() => this.update.emit()))
          }
        }
      ]
    });
  }

  public openConfigureMachineDialog(machine: Machine) {
    const notifyCloseSubject = new Subject<void>()
    this.modalService.openDialog(this.viewRef, {
      title: "Configure machine",
      childComponent: ConfigureMachineComponent,
      settings: this.modalSettings,
      data: {
        machine,
        notifyCloseSubject
      }
    });
    notifyCloseSubject.subscribe(() => {
      this.refresh()
    })
  }

  public updateCurrentMachinePrice() {
    if (!this.machine || !this.machinePrices) {
      return
    }
    const onDemandPrice = this.machinePrices.find(machinePrice =>
      machinePrice.instance_type === this.machine.instance_type
      && machinePrice.region === this.machine.region
      && machinePrice.provider === this.machine.provider
      && machinePrice.max_upload === this.machine.max_upload
      && machinePrice.provisioning_type === 'on-demand'
      && (!machinePrice.gpu_model || machinePrice.gpu_model === this.machine.gpu_model)
      && (!this.machine.os && machinePrice.os.startsWith('windows-server') || this.machine.os.startsWith(machinePrice.os))
    )?.price
    const spareCapacityPrice = this.machinePrices.find(machinePrice =>
      machinePrice.instance_type === this.machine.instance_type
      && machinePrice.region === this.machine.region
      && machinePrice.provider === this.machine.provider
      && machinePrice.max_upload === this.machine.max_upload
      && machinePrice.provisioning_type === 'spot'
      && (!this.machine.os && machinePrice.os.startsWith('windows-server') || this.machine.os.startsWith(machinePrice.os))
    )?.price
    this.currentMachinePrice = this.useSpareServers ? spareCapacityPrice : onDemandPrice
    this.spareCapacitySavings = ((onDemandPrice - spareCapacityPrice) / onDemandPrice) * 100
  }

  public refresh() {
    return this.update.emit({})
  }

  public downloadRdpFile() {
    const notifyCloseSubject = new Subject<void>()
    this.modalService.openDialog(this.viewRef, {
      title: "Connecting to your airgpu",
      childComponent: ConnectionInfoComponent,
      settings: this.modalSettings,
      data: {
        notifyCloseSubject
      }
    })

    notifyCloseSubject.subscribe(() => {
      const rdpContent = `full address:s:${this.machine.public_ip}\nusername:s:${this.machine.provider === 'aws' ? 'Administrator' : 'user'}`
      var file = new File([rdpContent], "airgpu.rdp", {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(file);
    })
  }

}
