import { Directive } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appSofkaSubs]',
  standalone: true
})
export class SofkaSubsDirective {
  protected subs = new Subscription();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
