export interface Action {
    type: string;
    payload?: any;
}

export interface IAppState {
    isLoggedIn: boolean;
}