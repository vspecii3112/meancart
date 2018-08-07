import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Domain } from '../objects/domain.class';

describe('Checks User Authentication', () => {

    let _userService: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                UserService,
                Domain
            ]
        });

        _userService = TestBed.get(UserService);        //injects the UserService for this test
        httpMock = TestBed.get(HttpTestingController);     
    });

    afterEach( () => {
        httpMock.verify();      //verify that no unmatched requests are outstanding
    });

    it('authentication is false for user not logged in via GET', () => {

        let domain: string = 'http://localhost:3333';     // http://localhost:3333 , https://cstoreapi.herokuapp.com
        const dummyResponse = {authenticated: false};     //this is the mock data
        _userService.isLoggedIn().subscribe(res => {
            expect(res.authenticated).toEqual(false);

        });

        const req = httpMock.expectOne(domain + '/user/isauthenticated');   //expects one request made to the url

        expect(req.request.method).toEqual('GET');      //expects the http request to be a GET

        req.flush(dummyResponse);       //delivering the mock data in the response
    });

});