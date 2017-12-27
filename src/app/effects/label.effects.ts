import { Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as LabelActions from './../actions/label.actions';
import { Observable } from 'rxjs';
import { LabelService } from './../services/label.service';
import { AppState } from './../states/app.state';

export type Action = LabelActions.All;

@Injectable()
export class LabelEffects {
  constructor(
    private actions$: Actions,
    private labelService: LabelService,
    private store: Store<AppState>
  ){}

  @Effect() getLabels$: Observable<Action> = this.actions$
    .ofType(LabelActions.GET)
    .switchMap(action => {
      return this.labelService.getLabels()
        .map(labels => (new LabelActions.GetSuccess(labels)))
        .catch(() => Observable.of(new LabelActions.GetError()))
    })

  @Effect() createLabel$ = this.actions$
    .ofType<LabelActions.Add>(LabelActions.ADD)
    .map(action => action.payload)
    .do(payload => {
      this.labelService.createLabel(payload)
        .subscribe(label => {
          this.store.dispatch(new LabelActions.AddSuccess(label));
        })
    })
}
