import { Action } from '../store/model';


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