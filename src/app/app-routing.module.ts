import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './core/auth/admin.guard';
import { AuthGuard } from './core/auth/auth.guard';
import { SignupComponent } from './core/auth/signup/signup/signup.component';

const routes: Routes = [
  {
    path: 'subscriptions',
    loadChildren: () => import('./modules/subscription/subscription.module').then(m => m.SubscriptionModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'machines',
    loadChildren: () => import('./modules/machine/machine.module').then(m => m.MachineModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivateChild: [AdminGuard]
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '**',
    redirectTo: "machines"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
