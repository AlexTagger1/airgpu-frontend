import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorService } from './auth/interceptor.service';
import { FooterComponent } from './footer/footer.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { SignupComponent } from './auth/signup/signup/signup.component';
import { IconModule } from '../modules/icon/icon.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../modules/shared/shared.module';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClickOutsideModule,
    HttpClientModule,
    IconModule,
    ReactiveFormsModule,
    SharedModule,
    NgHcaptchaModule.forRoot({
      siteKey: environment.hcaptcha.siteKey
    }),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class CoreModule {

  constructor() {}

}
