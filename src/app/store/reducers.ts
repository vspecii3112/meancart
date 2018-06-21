import { Action, CurrencyAction, CURRENCY_INITIAL_STATE } from '../store/model';

export const loginReducer = (lastState = {}, action: Action) => {
    switch(action.type) {
        case "LOGIN":
            return {
                isLoggedIn: true
            };
        case "LOGOUT":
            return {
                isLoggedIn: false
            };
        default:
            return lastState;
    }
}

export const switchCurrencyReducer = (lastState = CURRENCY_INITIAL_STATE, action: CurrencyAction) => {
    switch(action.type.currency) {
        case "USD":
            return {
                currency: action.type
            };
        case "CAD":
            return {
                currency: action.type
            };
        default:
            return {
                currency: lastState
            };
    }
}