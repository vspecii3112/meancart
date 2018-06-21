import { currency } from '../objects/currency.class';

export interface Action {
    type: string;
    payload?: any;
}

export interface CurrencyAction {
    type: currency;
    payload?: any;
}

export interface IAppState {
    isLoggedIn?: boolean;
    currency?: currency;
}

export const CURRENCY_INITIAL_STATE: currency = {
    currency: "USD",
    forex: "USD/USD",
    rate: 1
}