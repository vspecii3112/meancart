import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { createLogger } from 'redux-logger';
import { combineReducers, createStore, Store, applyMiddleware } from 'redux';

import { IAppState } from './model';
import { loginReducer } from '../store/reducers';
//import { LoginActions } from '../login/login.actions';
//import { logoutReducer } from '../header/header.reducers';
//import { LogoutActions } from '../header/header.actions';

const store: Store<IAppState> = createStore(
    combineReducers({loginReducer}),
    applyMiddleware(createLogger())
  ) as Store<IAppState>;
  
@NgModule({
    imports: [NgReduxModule],
    providers: [
    ]
})

export class StoreModule {
    constructor(public ngRedux: NgRedux<IAppState>) {
      // Tell Redux about our reducers and epics. If the Redux DevTools
      // chrome extension is available in the browser, tell Redux about
      // it too.
      ngRedux.provideStore(store);
    }
}