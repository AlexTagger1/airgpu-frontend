import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Machine,
  MachineParams,
  MachineService,
} from "gen/typescript-angular-client";
import { Observable, of, throwError } from "rxjs";
import { delay, map, retryWhen, timeout } from "rxjs/operators";
import { environment } from "src/environments/environment";

interface StartMachineParams {
  client_ip?: string;
  provisioning_type?: "spot" | "on-demand";
}

export interface Subscription {
  id: string;
  update_url: string;
  cancel_url: string;
  state: string;
  ended: boolean;
  ends_at?: number;
  renews_at?: number;
}

export interface Price {
  gross: number;
  net: number;
  tax: number;
}

export interface Pricing {
  customer_country: string;
  products: [
    {
      currency: string;
      list_price: Price;
      price: Price;
      product_id: number;
      product_title: string;
      subscription: {
        frequency: number;
        interval: string;
        list_price: Price;
        price: Price;
        trial_days: 0;
      };
      vendor_set_prices_included_tax: true;
    }
  ];
}

export interface MachinePrice {
  instance_type: string;
  provisioning_type: string;
  provider: string;
  region: string;
  price: number;
  max_upload: number;
  os: string;
  gpu_model?: string;
}

export interface CreateMachineParams extends Partial<MachineParams> {}

export interface ConfigureMachineParams {
  instance_type: string;
  max_upload: number;
  root_volume_size: number;
}

export interface Goals {
  signed_up: number;
  created_machine: number;
  initial_credit_purchase: number;
  following_credit_purchase: number;
}

export interface Statistics {
  playtime: number;
  credit_purchases: number;
  rating: number;
  goals: Goals;
}

export interface PaymentCheckParams {
  account: string
  amount: number
}

export enum PaymentCheckResult {
  Accepted = 'accepted',
  Rejected = 'rejected'
}

export enum PaymentCheckReason {
  RecentPayment = 'recent_payment',
  AccountLimitReached = 'account_limit_reached',
  ForbiddenAmount = 'forbidden_amount',
  EmailNotVerified = 'email_not_verified',
  BlacklistedEmailProvider = 'blacklisted_email_provider'
}

export interface PaymentCheckResponse {
  result: PaymentCheckResult
  reason?: PaymentCheckReason
}

export interface CreateAccountParams {
  email: string,
  password: string,
  terms: boolean,
  marketing_consent: boolean,
  captcha: string
  referral_code?: string
}

@Injectable({
  providedIn: "root",
})
export class AirgpuApiService {
  constructor(
    private http: HttpClient,
    private machineService: MachineService
  ) {}

  startMachine(id: string, params: StartMachineParams): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/machines/${id}/start`;
    return this.http.post(url, params).pipe(map(() => null));
  }

  pollUntilMachineInitializing(
    id: string,
    maxRetries: number = 18
  ): Observable<Machine> {
    var retries = 0;
    return this.machineService.getMachine({ id }).pipe(
      map((m) => {
        if (m.status === "initializing" || m.status === "off") {
          return m;
        }
        throw m;
      }),
      retryWhen((err) => {
        if (retries++ < maxRetries) {
          return err.pipe(
            // retry in 10 seconds
            delay(10000)
          );
        }
        return throwError("max retries reached");
      })
    );
  }

  pollUntilMachineStarted(
    id: string,
    maxRetries: number = 18
  ): Observable<Machine> {
    var retries = 0;
    return this.machineService.getMachine({ id }).pipe(
      map((m) => {
        if (m.status === "running" || m.status === "off") {
          return m;
        }
        throw m;
      }),
      retryWhen((err) => {
        if (retries++ < maxRetries) {
          return err.pipe(
            // retry in 10 seconds
            delay(10000)
          );
        }
        return throwError("max retries reached");
      })
    );
  }

  stopMachine(id: string): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/machines/${id}/stop`;
    return this.http.post(url, {}).pipe(map(() => null));
  }

  pollUntilMachineBackedUp(
    id: string,
    maxRetries: number = 45
  ): Observable<Machine> {
    var retries = 0;
    return this.machineService.getMachine({ id }).pipe(
      map((m) => {
        if (m.status === "off") {
          return m;
        }
        throw m;
      }),
      retryWhen((err) => {
        if (retries++ < maxRetries) {
          return err.pipe(
            // retry in 1 minute
            delay(60000)
          );
        }
        return throwError("max retries reached");
      })
    );
  }

  pollUntilMachineStopped(
    id: string,
    maxRetries: number = 18
  ): Observable<Machine> {
    var retries = 0;
    return this.machineService.getMachine({ id }).pipe(
      map((m) => {
        if (m.status === "backing_up") {
          return m;
        }
        throw m;
      }),
      retryWhen((err) => {
        if (retries++ < maxRetries) {
          return err.pipe(
            // retry in 10 seconds
            delay(10000)
          );
        }
        return throwError("max retries reached");
      })
    );
  }

  // get the subscription with the given id
  getSubscription(id: string) {
    const url = `${environment.backend.apiBaseUrl}/subscriptions/${id}`;
    return this.http.get<Subscription>(url);
  }

  // get pricing information
  getPricing(): Observable<Pricing> {
    const url = `${environment.backend.apiBaseUrl}/pricing`;
    return this.http.get<Pricing>(url).pipe(timeout(10000));
  }

  // get machine prices
  getMachinePrices(): Observable<MachinePrice[]> {
    const url = `${environment.backend.apiBaseUrl}/machine-prices`;
    return this.http.get<MachinePrice[]>(url).pipe(timeout(10000));
  }

  // create a new machine
  createMachine(params: CreateMachineParams): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/machines`;
    return this.http.post(url, params).pipe(map(() => null));
  }

  // delete a machine
  deleteMachine(id: string): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/machines/${id}`;
    return this.http.delete<void>(url);
  }

  // (re)configure a machine
  configureMachine(
    id: string,
    params: ConfigureMachineParams
  ): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/machines/${id}/configure`;
    return this.http.post(url, params).pipe(map(() => null));
  }

  // statistics
  getStatistics(from: Date, until: Date): Observable<Statistics> {
    const url = `${environment.backend.apiBaseUrl}/statistics`;
    const params = new HttpParams()
      .append("from", "" + from.getTime())
      .append("until", "" + until.getTime());
    return this.http.get<Statistics>(url, { params });
  }

  runPaymentCheck(params: PaymentCheckParams): Observable<PaymentCheckResponse> {
    const url = `${environment.backend.apiBaseUrl}/payment-checks`
    return this.http.post<PaymentCheckResponse>(url, params)
  }

  createAccount(params: CreateAccountParams): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/accounts`
    return this.http.post<void>(url, params)
  }

  resendActivationEmail(accountId: string): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/accounts/${accountId}/activation-emails`;
    return this.http.post<void>(url, {});
  }

  deleteAccount(accountId: string): Observable<void> {
    const url = `${environment.backend.apiBaseUrl}/accounts/${accountId}`
    return this.http.delete<void>(url)
  }
}
