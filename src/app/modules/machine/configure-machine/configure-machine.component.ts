import { Component, ComponentRef } from "@angular/core";
import { Machine } from "gen/typescript-angular-client";
import {
  IModalDialog,
  IModalDialogButton,
  IModalDialogOptions,
} from "ngx-modal-dialog";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
import {
  AirgpuApiService,
  ConfigureMachineParams,
} from "src/app/core/http/airgpu-api.service";

interface NetworkingOption {
  value: number;
  label: string;
}

@Component({
  selector: "app-configure-machine",
  templateUrl: "./configure-machine.component.html",
  styleUrls: ["./configure-machine.component.scss"],
})
export class ConfigureMachineComponent implements IModalDialog {
  actionButtons: IModalDialogButton[];

  machine?: Machine;
  machineFamily?: string;
  machineSize?: string;
  busy = false;
  error?: string = null;
  closeDialogSubject: Subject<void>;
  notifyCloseSubject: Subject<void>;

  public cpuOptions: {
    [instanceFamily: string]: {
      label: string;
      instanceSize: string;
    }[];
  } = {
    g4dn: [
      {
        label: "4 vCPUs, 16GB RAM",
        instanceSize: "xlarge",
      },
      {
        label: "8 vCPUs, 32GB RAM",
        instanceSize: "2xlarge",
      },
    ],
    g4ad: [
      {
        label: "4 vCPUs, 16GB RAM",
        instanceSize: "xlarge",
      },
      {
        label: "8 vCPUs, 32GB RAM",
        instanceSize: "2xlarge",
      },
    ],
    g5: [
      {
        label: "8 vCPUs, 32GB RAM",
        instanceSize: "2xlarge",
      },
      {
        label: "16 vCPUs, 64GB RAM",
        instanceSize: "4xlarge",
      },
    ],
  };
  public cpu = this.cpuOptions["g4dn"][0];

  public networkingOptions: {
    [instanceFamily: string]: {
      value: number;
      label: string;
    }[];
  } = {
    g4dn: [
      {
        value: 5,
        label: "720p 60 FPS, 5 Mbit/s",
      },
      {
        value: 10,
        label: "1080p 60 FPS, 10 Mbit/s",
      },
      {
        value: 20,
        label: "1440p 60 FPS, 20 Mbit/s",
      },
      {
        value: 40,
        label: "4K 60 FPS, 40 Mbit/s",
      },
    ],
    g5: [
      {
        value: 5,
        label: "720p 60 FPS, 5 Mbit/s",
      },
      {
        value: 10,
        label: "1080p 60 FPS, 10 Mbit/s",
      },
      {
        value: 20,
        label: "1440p 60 FPS, 20 Mbit/s",
      },
      {
        value: 40,
        label: "4K 60 FPS, 40 Mbit/s",
      },
    ],
    g4ad: [
      {
        value: 10,
        label: "720p 60 FPS, 10 Mbit/s",
      },
      {
        value: 20,
        label: "1080p 60 FPS, 20 Mbit/s",
      },
    ],
  };

  public networking: NetworkingOption = this.networkingOptions["g4dn"][1];

  public storageOptions: {
    value: number;
    label: string;
  }[] = [
    {
      value: 100,
      label: "100 GB ($7.00 / mo)",
    },
    {
      value: 150,
      label: "150 GB ($10.50 / mo)",
    },
    {
      value: 200,
      label: "200 GB ($14.00 / mo)",
    },
    {
      value: 250,
      label: "250 GB ($17.50 / mo)",
    },
    {
      value: 300,
      label: "300 GB ($21.00 / mo)",
    },
    {
      value: 400,
      label: "400 GB ($28.00 / mo)",
    },
    {
      value: 500,
      label: "500 GB ($35.00 / mo)",
    },
  ];
  public storage = this.storageOptions[0];

  constructor(private apiService: AirgpuApiService) {}

  dialogInit(
    _: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.closeDialogSubject = options.closeDialogSubject;
    this.notifyCloseSubject = options.data.notifyCloseSubject;

    this.machine = options.data.machine;
    this.storageOptions = this.storageOptions.filter(
      (s) => s.value >= this.machine.root_volume_size
    );
    this.storage = this.storageOptions[0];
    this.machineFamily = this.machine.instance_type.split(".")[0];
    this.machineSize = this.machine.instance_type.split(".")[1];
    this.networking = this.networkingOptions[this.machineFamily].find(
      (n) => n.value === this.machine.max_upload
    );
    this.cpu = this.cpuOptions[this.machineFamily].find(
      (c) => c.instanceSize === this.machineSize
    );
  }

  public configureMachine() {
    this.busy = true;
    const params: ConfigureMachineParams = {
      instance_type: this.machineFamily + "." + this.cpu.instanceSize,
      max_upload: this.networking.value,
      root_volume_size: this.storage.value,
    };
    this.apiService
      .configureMachine(this.machine.id, params)
      .pipe(
        finalize(() => {
          this.busy = false;
          this.close();
        })
      )
      .subscribe();
  }

  public close() {
    this.closeDialogSubject.next();
    this.notifyCloseSubject.next();
  }
}
