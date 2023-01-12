import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon/icon.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { AlertComponent } from './alert/alert.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';



@NgModule({
  declarations: [SpinnerComponent, AlertComponent, InfoDialogComponent],
  imports: [
    CommonModule,
    IconModule,
    ClipboardModule,
    ModalDialogModule,
    FormsModule,
    ClickOutsideModule
  ],
  exports: [
    IconModule,
    SpinnerComponent,
    ClipboardModule,
    ModalDialogModule,
    AlertComponent,
    FormsModule,
    ClickOutsideModule,
    InfoDialogComponent
  ]
})
export class SharedModule { }
