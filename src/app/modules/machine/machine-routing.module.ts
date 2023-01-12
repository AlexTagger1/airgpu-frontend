import { Routes } from '@angular/router';
import { CreateMachineComponent } from './create-machine/create-machine.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'create', component: CreateMachineComponent },
  { path: '**', component: DashboardComponent},
];
