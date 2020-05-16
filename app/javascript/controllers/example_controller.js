import { Controller } from 'stimulus';
import { Subject } from 'rxjs';
import { tap, delay, filter, debounceTime } from 'rxjs/operators';

export default class extends Controller {
  static targets = ['loading', 'delay'];

  newClick = new Subject();
  isLoading = new Subject();

  loadingDelay = 350;

  connect() {
    this.setupClickEvent();
    this.setupLoadingState();
  }

  myClick(event) {
    this.newClick.next();
  }

  setupClickEvent() {

    this.newClick
      .pipe(
        tap(() => {
          this.delayTarget.innerText = '';
          this.isLoading.next(true);
        }),
        delay(150)
      )
      .subscribe(() => {
        this.isLoading.next(false);
        this.delayTarget.innerText = `Data available`;
        // Display content
      });
  }

  setupLoadingState() {
    this.isLoading
      .pipe(
        debounceTime(this.loadingDelay),
        filter(value => value === true)
      )
      .subscribe(() => {
        this.loadingTarget.classList.remove('hidden');
      });

    this.isLoading
      .pipe(
        filter(value => !value)
      )
      .subscribe(() => {
        this.loadingTarget.classList.add('hidden');
      });
  }
  
}