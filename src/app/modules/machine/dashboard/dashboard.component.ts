import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import {
  AccountService,
  Machine,
  MachineService,
} from "gen/typescript-angular-client";
import { IModalDialogSettings, ModalDialogService } from "ngx-modal-dialog";
import { Observable, throwError } from "rxjs";
import { catchError, mergeMap, tap } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/auth.service";
import { AirgpuApiService, MachinePrice } from "src/app/core/http/airgpu-api.service";
import { environment } from "src/environments/environment";
import { MachineUpdate } from "../machine-info/machine-info.component";
import { SessionFeedbackComponent } from "../session-feedback/session-feedback/session-feedback.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  machines$: Observable<Machine[]>;
  machines?: Machine[]

  credit?: number = null;

  error?: string = null;

  machinePrices?: MachinePrice[] = null

  allowMultipleMachines = environment.features.multipleMachines
  maxMachines = 1

  private modalSettings: Partial<IModalDialogSettings> = {
    overlayClass: "w-full h-screen fixed inset-0 bg-gray-800 opacity-80",
    modalClass:
      "overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex",
    modalDialogClass: "bg-gray-900 rounded",
    buttonClass:
      "bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded mr-2",
    contentClass: "m-5",
    headerClass: "text-2xl text-white mb-10 title-font",
    footerClass: "mt-10",
  };

  constructor(
    private machineService: MachineService,
    private airgpuApi: AirgpuApiService,
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private modalService: ModalDialogService,
    private viewRef: ViewContainerRef,
  ) {
    this.loadMachines();
    this.updateCredit();
    this.loadMachinePrice();
  }

  private updateCredit() {
    // load subscription
    this.authService.getUser$().pipe(
      mergeMap(profile => {
        const accountId = profile['https://api.airgpu.com/account']
        return this.accountService.getAccount({ id: accountId })
      }))
      .subscribe(account => {
        this.credit = account.credit
        this.maxMachines = account.max_machines ?? 1
      })
  }

  private loadMachines() {
    this.machines$ = this.machineService.listMachines({}).pipe(
      tap((machines) => {
        this.machines = machines
        if (machines.length === 0) {
          setTimeout(() => {
            this.router.navigate(['/machines/create'])
          }, 0)
        }
      }),
      catchError((err) => {
        this.error = "Oh no! Failed to load your machines";
        return throwError(err);
      })
    )
  }

  private loadMachinePrice() {
    this.airgpuApi.getMachinePrices().subscribe(machinePrices => {
      this.machinePrices = machinePrices
    })
  }

  ngOnInit(): void { }

  public updateMachines(update: MachineUpdate) {
    if (update && update.error) {
      this.error = update.error
    }
    this.loadMachines()
    this.updateCredit()

    if (update && update.status === 'stopping') {
      this.openSessionFeedbackModal()
    }
  }

  // let user rate session while machine is stopping
  public openSessionFeedbackModal() {
    this.modalService.openDialog(this.viewRef, {
      title: "Beta Feedback",
      childComponent: SessionFeedbackComponent,
      settings: this.modalSettings,
      data: {},
    });
  }
}
