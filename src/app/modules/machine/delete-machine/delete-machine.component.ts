import { Component, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
  selector: 'app-delete-machine',
  templateUrl: './delete-machine.component.html',
  styleUrls: ['./delete-machine.component.scss']
})
export class DeleteMachineComponent implements IModalDialog {

  machineId: string

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.machineId = options.data.machineId
  }

  constructor() {}

}
