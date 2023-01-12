import { Component, ComponentRef, OnInit } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-connection-info',
  templateUrl: './connection-info.component.html',
  styleUrls: ['./connection-info.component.scss']
})
export class ConnectionInfoComponent implements IModalDialog {
  notifyCloseSubject: Subject<void>;
  closeDialogSubject: Subject<void>;

  dialogInit(
    _: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.notifyCloseSubject = options.data.notifyCloseSubject;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  public close() {
    this.notifyCloseSubject.next();
    this.closeDialogSubject.next();
  }

}
