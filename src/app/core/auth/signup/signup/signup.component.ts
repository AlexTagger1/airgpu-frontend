import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, filter, finalize, mergeMap } from 'rxjs/operators';
import { AirgpuApiService, CreateAccountParams } from 'src/app/core/http/airgpu-api.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public authCheck$: Observable<boolean>
  public signupForm: FormGroup
  public success = false
  public error = false
  public busy = false

  constructor(
    private fb: FormBuilder,
    private apiService: AirgpuApiService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    this.signupForm = this.fb.group({
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, [Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]],
      terms: [false, [Validators.requiredTrue]],
      marketing_consent: [false],
      captcha: [undefined, Validators.required],
      referral_code: [undefined]
    }, { updateOn: 'blur' })

    this.route.queryParams.pipe(
      filter(p => p.r)
    ).subscribe(p => this.signupForm.patchValue({
      referral_code: p.r
    }))
  }

  ngOnInit(): void {
    this.authCheck$ = this.authService.isAuthenticated$
    this.authCheck$.subscribe((authenticated) => {
      if (authenticated) {
        this.router.navigate(['/machines'])
      }
    })
  }

  // workaround for safari not setting checkbox value automatically
  public toggleTerms(event: any) {
    this.signupForm.patchValue({
      terms: event.target.checked
    })
  }

  // workaround for safari not setting checkbox value automatically
  public toggleMarketingConsent(event: any) {
    this.signupForm.patchValue({
      marketing_consent: event.target.checked
    })
  }

  public signup() {
    this.error = false

    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched()
      console.log(this.signupForm) // XXX
      return
    }

    // create account
    this.busy = true
    this.apiService.createAccount(this.signupForm.value as CreateAccountParams)
      .pipe(
        mergeMap(() => {
          this.success = true
          return of().pipe(delay(5000))
        }),
        finalize(() => this.busy = false))
      .subscribe({
        complete: () => {
          this.router.navigate(['/machines'])
        },
        error: () => {
          this.error = true
        }
      })
  }

  public get email() {
    return this.signupForm.get('email') as FormControl
  }

  public get password() {
    return this.signupForm.get('password') as FormControl
  }

  public get terms() {
    return this.signupForm.get('terms') as FormControl
  }

  public get captcha() {
    return this.signupForm.get('captcha') as FormControl
  }

}
