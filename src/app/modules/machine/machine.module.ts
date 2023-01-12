import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routes } from './machine-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StatusLabelPipe } from './status-label.pipe';
import { SessionFeedbackComponent } from './session-feedback/session-feedback/session-feedback.component';
import { CreateMachineComponent } from './create-machine/create-machine.component';
import { PingComponent } from './ping/ping/ping.component';
import { DeleteMachineComponent } from './delete-machine/delete-machine.component';
import { MachineInfoComponent } from './machine-info/machine-info.component';
import { ConfigureMachineComponent } from './configure-machine/configure-machine.component';
import { ConnectionInfoComponent } from './connection-info/connection-info.component';


@NgModule({
  declarations: [DashboardComponent, StatusLabelPipe, SessionFeedbackComponent, CreateMachineComponent, PingComponent, DeleteMachineComponent, MachineInfoComponent, ConfigureMachineComponent, ConnectionInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [PingComponent]
})
export class MachineModule { }
