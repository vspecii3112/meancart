import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DOMAIN } from '../objects/domain';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoadCoinInfoService {

    constructor(private _http: HttpClient) {}

    getCoins() {
        return this._http.get(DOMAIN.url + '/get_coin_info')
            .catch(error => Observable.throw(error.json()));
    }
}
