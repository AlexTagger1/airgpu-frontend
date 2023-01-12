import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AccountService } from './api/account.service';
import { ChargeService } from './api/charge.service';
import { CreditWarningService } from './api/creditWarning.service';
import { DataCenterService } from './api/dataCenter.service';
import { EventService } from './api/event.service';
import { FeedbackService } from './api/feedback.service';
import { MachineService } from './api/machine.service';
import { PlanService } from './api/plan.service';
import { SessionService } from './api/session.service';
import { TaskService } from './api/task.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
