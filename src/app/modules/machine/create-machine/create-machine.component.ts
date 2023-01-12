import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCenter, DataCenterService, MachineService } from 'gen/typescript-angular-client';
import { mergeMap } from 'rxjs/operators';
import { AirgpuApiService, CreateMachineParams, MachinePrice } from 'src/app/core/http/airgpu-api.service';
import { environment } from 'src/environments/environment';
import { AuthService } from "../../../core/auth/auth.service";

const Paddle = window["Paddle"];

interface GpuOption {
  label: string
  instanceFamily: string
  comparableGpu: string
  startingPrice?: number
  cpu: string
}

interface CpuOption {
  label: string
  instanceSize?: string,
  vcpus: number,
  ram: number
}

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.scss']
})
export class CreateMachineComponent implements OnInit {
  public dataCenterOptions = [];
  public dataCenter?: DataCenter = null
  public dataCenterDropwdownCollapsed = true
  public hasMachines = false

  public gpuOptions: {[key: string]: GpuOption[]} = {
    'aws': [
      {
        label: 'Nvidia Tesla T4',
        instanceFamily: 'g4dn',
        comparableGpu: 'Nvidia GeForce GTX 1080',
        startingPrice: null,
        cpu: 'Intel Xeon Platinum 2.5 Ghz',
      },
      {
        label: 'AMD Radeon Pro V520',
        instanceFamily: 'g4ad',
        comparableGpu: 'AMD Radeon RX 5700 XT',
        startingPrice: null,
        cpu: 'AMD EPYC 3.3 Ghz',
      },
      {
        label: 'Nvidia A10G',
        instanceFamily: 'g5',
        comparableGpu: 'Nvidia GeForce RTX 3080',
        startingPrice: null,
        cpu: 'AMD EPYC 3.3 Ghz',
      }
    ],
    'td': [
      {
        label: 'Nvidia Quadro RTX 4000',
        instanceFamily: 'QUADRO_4000',
        comparableGpu: 'Nvidia GeForce RTX 2070',
        startingPrice: null,
        cpu: '',
      },
      {
        label: 'Nvidia RTX A4000',
        instanceFamily: 'A4000',
        comparableGpu: 'Nvidia GeForce RTX 3070',
        startingPrice: null,
        cpu: '',
      },
      {
        label: 'Nvidia RTX A5000',
        instanceFamily: 'A5000',
        comparableGpu: 'Nvidia GeForce RTX 3080',
        startingPrice: null,
        cpu: '',
      }
    ]
  }
  public gpu: GpuOption = this.gpuOptions['aws'][0]

  public cpuOptions : { [dataCenter: string]: {[instanceFamily: string]: CpuOption[]}} = {
    'aws': {
      'g4dn': [{
        label: '4 vCPUs, 16GB RAM',
        instanceSize: 'xlarge',
        vcpus: 4,
        ram: 16
      },
      {
        label: '8 vCPUs, 32GB RAM',
        instanceSize: '2xlarge',
        vcpus: 8,
        ram: 32
      }],
      'g4ad': [
        {
          label: '4 vCPUs, 16GB RAM',
          instanceSize: 'xlarge',
          vcpus: 4,
          ram: 16
        },
        {
          label: '8 vCPUs, 32GB RAM',
          instanceSize: '2xlarge',
          vcpus: 8,
          ram: 32
        }],
      'g5': [
        {
          label: '8 vCPUs, 32GB RAM',
          instanceSize: '2xlarge',
          vcpus: 8,
          ram: 32
        },
        {
          label: '16 vCPUs, 64GB RAM',
          instanceSize: '4xlarge',
          vcpus: 16,
          ram: 64
        }
      ]
    },
    'td': {
      'QUADRO_4000': [
        {
          label: '8 vCPUs, 16GB RAM',
          vcpus: 8,
          ram: 16,
        },
      ],
      'A4000': [
        {
          label: '8 vCPUs, 16GB RAM',
          vcpus: 8,
          ram: 16,
        },
      ],
      'A5000': [
        {
          label: '12 vCPUs, 24GB RAM',
          vcpus: 12,
          ram: 24,
        },
      ]
    }
  }
  public cpu = this.cpuOptions['aws'][this.gpu.instanceFamily][0]


  public networkingOptions = {
    'aws': {
      "g4dn": [
        {
          value: 5,
          label: '720p 60 FPS, 5 Mbit/s',
          diff: null
        },
        {
          value: 10,
          label: '1080p 60 FPS, 10 Mbit/s',
          diff: null
        },
        {
          value: 20,
          label: '1440p 60 FPS, 20 Mbit/s',
          diff: null
        },
        {
          value: 40,
          label: '4K 60 FPS, 40 Mbit/s',
          diff: null
        }
      ],
      "g5": [
        {
          value: 5,
          label: '720p 60 FPS, 5 Mbit/s',
          diff: null
        },
        {
          value: 10,
          label: '1080p 60 FPS, 10 Mbit/s',
          diff: null
        },
        {
          value: 20,
          label: '1440p 60 FPS, 20 Mbit/s',
          diff: null
        },
        {
          value: 40,
          label: '4K 60 FPS, 40 Mbit/s',
          diff: null
        }
      ],
      "g4ad": [
        {
          value: 10,
          label: '720p 60 FPS, 10 Mbit/s',
          diff: null
        },
        {
          value: 20,
          label: '1080p 60 FPS, 20 Mbit/s',
          diff: null
        },
      ]
    },
    'td': {
      'QUADRO_4000': [
        {
          value: 50,
          label: 'Up to 4K 60 FPS, 50 Mbit/s',
          diff: null
        }
      ],
      'A4000': [
        {
          value: 50,
          label: 'Up to 4K 60 FPS, 50 Mbit/s',
          diff: null
        }
      ],
      'A5000': [
        {
          value: 50,
          label: 'Up to 4K 60 FPS, 50 Mbit/s',
          diff: null
        }
      ]
    }
    
  }

  public networking = this.networkingOptions['aws'][this.gpu.instanceFamily][1]

  public storageOptions = [
    {
      value: 100,
      label: '100 GB ($7.00 / mo)'
    },
    {
      value: 150,
      label: '150 GB ($10.50 / mo)'
    },
    {
      value: 200,
      label: '200 GB ($14.00 / mo)'
    },
    {
      value: 250,
      label: '250 GB ($17.50 / mo)'
    },
    {
      value: 300,
      label: '300 GB ($21.00 / mo)'
    },
    {
      value: 400,
      label: '400 GB ($28.00 / mo)'
    },
    {
      value: 500,
      label: '500 GB ($35.00 / mo)'
    },
  ]
  public storage = this.storageOptions[0]

  public osOptions = {
    'aws': {
      "g4dn": [
        {
          value: 'windows-server-2022',
          label: 'Windows Server 2022',
          diff: null
        },
        {
          value: 'windows-10-byol',
          label: 'Windows 10 (Bring your own license)',
          diff: null
        }
      ],
      "g4ad": [
        {
          value: 'windows-server-2019',
          label: 'Windows Server 2019',
          diff: null
        },
      ],
      "g5": [
        {
          value: 'windows-server-2022',
          label: 'Windows Server 2022',
          diff: null
        },
        {
          value: 'windows-10-byol',
          label: 'Windows 10 (Bring your own license)',
          diff: null
        }
      ],
    },
    'td': {
      'QUADRO_4000': [
        {
          value: 'Windows 10',
          label: 'Windows 10 (Bring your own license)',
          diff: null
        }
      ],
      'A4000': [
        {
          value: 'Windows 10',
          label: 'Windows 10 (Bring your own license)',
          diff: null
        }
      ],
      'A5000': [
        {
          value: 'Windows 10',
          label: 'Windows 10 (Bring your own license)',
          diff: null
        }
      ]
    }
  }
  public os = this.osOptions['aws']["g4dn"][0]
  public byolAgreement = false

  public machinePrices?: MachinePrice[]

  public onDemandPrice: number
  public spareCapacityPrice: number

  public busy = false
  public error = null;

  constructor(
    private dataCenterService: DataCenterService,
    private airgpuApi: AirgpuApiService,
    private auth: AuthService,
    private machineService: MachineService,
    private router: Router) {
    this.storage = this.storageOptions[0]
    this.dataCenterService.listDataCenters({}).pipe(
      mergeMap((dataCenters: Array<DataCenter>) => {
        this.dataCenterOptions = dataCenters.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        this.dataCenter = this.dataCenterOptions[0]
        return this.airgpuApi.getMachinePrices()
      })
    ).subscribe(mp => {
      this.machinePrices = mp
      if (this.dataCenter) {
        this.onDatacenterUpdate()
      }
    })

    this.auth.getUser$().pipe(
      mergeMap(profile => {
        const account = profile['https://api.airgpu.com/account']
        return this.machineService.listMachines({account})
      }))
      .subscribe(machines => this.hasMachines = machines.length > 0)
    
  }

  ngOnInit(): void {
    if (environment.paddle.sandboxMode) {
      Paddle.Environment.set('sandbox');
    }

    Paddle.Setup({
      vendor: environment.paddle.vendorId
    });
  }

  public onDatacenterUpdate() {
    
    this.gpuOptions[this.dataCenter.provider] = this.gpuOptions[this.dataCenter.provider].map(g => ({
      ...g,
      startingPrice: this.getMinMachinePrice(this.dataCenter.provider, this.dataCenter.provider === 'td'? g.instanceFamily : g.instanceFamily + '.' + (g.instanceFamily != 'g5' ? 'xlarge' : '2xlarge'))
    }))
    const gpu = this.gpuOptions[this.dataCenter.provider][0]
    this.selectGpu(gpu)
    this.onChange()
  }

  public getMinMachinePrice(provider: string, instanceType: string): number {
    if (!this.machinePrices || !this.dataCenter) {
      return 0
    }

    if (provider === 'aws') {
      const lowestUpload = instanceType.startsWith("g4ad") ? 10 : 5
      return this.machinePrices.find(m => m.instance_type === instanceType
        && m.provider === provider
        && m.region === this.dataCenter.region
        && m.max_upload === lowestUpload
        && m.provisioning_type === 'spot'
        && m.os.startsWith('windows-server'))?.price
    }
    if (provider === 'td') {
      return this.machinePrices.find(m => m.provider === provider 
        && m.region === this.dataCenter.region
        && m.gpu_model === instanceType)?.price
    }
  }

  public createMachine() {
    if ((this.os.value === 'windows-10-byol' || this.os.value === 'Windows 10') && !this.byolAgreement) {
      this.error = "Please agree to the Windows 10 licensing terms"
      return
    }

    this.error = null
    this.busy = true;
    const params: CreateMachineParams = {
      provider: this.dataCenter.provider,
      region: this.dataCenter.region,
      instance_type: this.dataCenter.provider === 'aws' ? this.gpu.instanceFamily + '.' + this.cpu.instanceSize : 'gpu',
      root_volume_size: this.storage.value,
      max_upload: this.networking.value,
      os: this.os.value,
      gpu_model: this.dataCenter.provider === 'td' ? this.gpu.instanceFamily : undefined,
      vcpus: this.cpu.vcpus,
      ram: this.cpu.ram
    }
    this.airgpuApi.createMachine(params).subscribe(() => {
      this.router.navigate(['/machines'])
    }, err => {
      this.busy = false
      this.error = "Failed to create machine, please contact support if the issue persists"
    })
  }

  public selectGpu(g: GpuOption) {
    if (!g.startingPrice) {
      return
    }

    this.gpu = g
    this.networking = this.networkingOptions[this.dataCenter.provider][this.gpu.instanceFamily][0]
    this.cpu = this.cpuOptions[this.dataCenter.provider][this.gpu.instanceFamily][0]
    this.os = this.osOptions[this.dataCenter.provider][this.gpu.instanceFamily][0]
    this.onChange()
  }

  public onChange() {
    this.updatePrice()
  }

  public updatePrice() {
    const instanceType =  (this.dataCenter.provider === 'td' ? 'gpu' : this.gpu.instanceFamily + '.' + this.cpu.instanceSize)
    const gpuModel = (this.dataCenter.provider === 'td' ? this.gpu.instanceFamily : undefined)

    this.onDemandPrice = this.machinePrices.find(machinePrice =>
      machinePrice.instance_type === instanceType
      && machinePrice.region === this.dataCenter.region
      && machinePrice.provider === this.dataCenter.provider
      && machinePrice.max_upload === this.networking.value
      && machinePrice.provisioning_type === 'on-demand'
      && this.os.value.startsWith(machinePrice.os)
      && machinePrice.gpu_model === gpuModel
    )?.price
    this.spareCapacityPrice = this.machinePrices.find(machinePrice =>
      machinePrice.instance_type === this.gpu.instanceFamily + '.' + this.cpu.instanceSize
      && machinePrice.region === this.dataCenter.region
      && machinePrice.provider === 'aws'
      && machinePrice.max_upload === this.networking.value
      && machinePrice.provisioning_type === 'spot'
      && this.os.value.startsWith(machinePrice.os)
    )?.price
  }
}
