import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DOMAIN } from '../objects/domain';
import { currency } from '../objects/currency.class';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ShoppingCartService {

    constructor(private _http: HttpClient) {}

    getCartItems() {
        return this._http.get(DOMAIN.url + '/shopping_cart', {withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    getTotalQuantity() {
        return this._http.get(DOMAIN.url + '/get_total_quantity', {withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    addItem(coinID: string, itemQty: number) {
        //let myParams = new URLSearchParams();
        //myParams.set('id', coinID);
        let headers = new HttpHeaders({'Content-Type':'application/X-www-form-urlencoded'});
        let bodyString = 'itemQty=' + itemQty;
        return this._http.post(DOMAIN.url + '/add_to_cart/' + coinID, bodyString, {headers: headers, withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    reduceOneQuantity(coinID: string) {
        return this._http.get(DOMAIN.url + '/reduce_one/' + coinID, {withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    removeItem(coinID: string) {
        return this._http.get(DOMAIN.url + '/remove_all/' + coinID, {withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    cartCheckout() {
        return this._http.get(DOMAIN.url + '/checkout', {withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    makeCharge(cardToken: string, currency: currency) {
        let headers = new HttpHeaders({'Content-Type':'application/X-www-form-urlencoded'});
        let bodyString = 'stripeToken=' + cardToken + '&currencySymbol=' + currency.currency + '&currencyForex=' + currency.forex + '&currencyRate=' + currency.rate;
        return this._http.post(DOMAIN.url + '/make_charge', bodyString, {headers: headers, withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    updateCart(updateCart: any) {
        let bodyString = JSON.stringify(updateCart);
        //console.log(bodyString);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.post(DOMAIN.url + '/cart_update', bodyString, {headers: headers, withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    changeCurrency(currency: string) {
        return this._http.get(DOMAIN.url + '/change_currency/' + currency, {withCredentials: true})
            .catch(error => Observable.throw(error));
    }

    checkCurrency() {
        return this._http.get(DOMAIN.url + '/check_currency/', {withCredentials: true})
            .catch(error => Observable.throw(error));
    }
}
