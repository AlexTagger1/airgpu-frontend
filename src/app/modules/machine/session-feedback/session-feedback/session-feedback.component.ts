import { Component, ComponentRef } from '@angular/core';
import { FeedbackService } from 'gen/typescript-angular-client';
import { IModalDialog, IModalDialogButton, IModalDialogOptions } from 'ngx-modal-dialog';
import { of } from 'rxjs';
import { catchError, delay, finalize, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-session-feedback',
  templateUrl: './session-feedback.component.html',
  styleUrls: ['./session-feedback.component.scss']
})
export class SessionFeedbackComponent implements IModalDialog {
  actionButtons: IModalDialogButton[];

  public ratings = new Array(5).fill(0).map((_, i) => i+1)
  public highlight: number = 0

  public submitted = false

  public rating?: number = null

  public comment? = undefined

  constructor(
    private feedbackService: FeedbackService
  ) {
    this.actionButtons = [
      { text: 'Submit', onAction: () => this.submit() }
    ]
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {}

  ngOnInit(): void {
  }

  submit() {
    if (this.rating === null) {
      return false
    }

    // submit data
    // TODO: move out of view component
    return this.feedbackService.createFeedback({
      feedbackParams: {
        context: 'finished_session',
        created_at: new Date().getTime(),
        fields: {
          rating: this.rating,
          comment: this.comment
        }
      }
    }).pipe(
      finalize(() => {
        this.submitted = true
      }),
      catchError(() => null),
      mergeMap(() => of(true).pipe(delay(1500)))
    )
  }

}
