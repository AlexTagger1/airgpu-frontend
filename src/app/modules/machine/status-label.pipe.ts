import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {

  private labels = {
    'off': 'Off',
    'starting': 'Starting...',
    'initializing': 'Initializing...',
    'running': 'Running',
    'stopping': 'Stopping...',
    'backing_up': 'Backing up...'
  }

  transform(value: string): string {
    return this.labels[value] || value
  }

}
