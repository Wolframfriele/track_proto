import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, concatMap, EMPTY, map, Subject } from 'rxjs';
import { UrlDatetimePipe } from '../../pipes/url-datetime.pipe';

interface DateRangeState {
  start: Date;
  end: Date;
  error: String | null,
}

interface NextDataJson {
  entry_timestamp: string,
}

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  http = inject(HttpClient);

  toUrlDateTime = new UrlDatetimePipe();

  // state
  private state = signal<DateRangeState>({
    start: this.getTodayStart(),
    end: this.getTodayEnd(),
    error: null,
  });

  // selectors
  start = computed(() => this.state().start);
  end = computed(() => this.state().end);

  // sources
  expand$ = new Subject<undefined>();

  // outputs
  dateRangeExpanded$ = toObservable(this.state);

  constructor() {
    this.expand$
      .pipe(
        concatMap(() => {
          return this.http
            .get<NextDataJson>(`/api/earlier_entry/${this.toUrlDateTime.transform(this.state().start)}`)
            .pipe(catchError((err) => this.handleError(err)))
        }),
        map(response => this.mapToNextDate(response)),
        takeUntilDestroyed(),
      )
      .subscribe((response) =>
        this.state.set({
          start: response,
          end: this.getTodayEnd(),
          error: null,
        })
      );
  }

  private getTodayStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }

  private getTodayEnd(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }

  private mapToNextDate(response: NextDataJson): Date {
    let nextEntryDate = new Date(response.entry_timestamp);
    nextEntryDate.setUTCHours(0, 0, 0, 0);
    return nextEntryDate;
  }

  private handleError(err: any) {
    this.state.update((state) => ({ ...state, error: err }));
    return EMPTY;
  }
}
