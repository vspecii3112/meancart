/*
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HeaderComponent } from './header.component'
import { Router} from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Observable';

class RouterStub {
    navigateByUrl(url: string) {
        return url;
    }
}

describe('Header Component', () => {

    let comp: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let _userService: UserService;

    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            providers: [
                UserService,
                {provide: Router, useClass: RouterStub}
            ]
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(HeaderComponent);
                comp = fixture.componentInstance;
                _userService = fixture.debugElement.injector.get(UserService);

                let spy = spyOn(_userService, 'isLoggedIn').and.returnValue(Observable.of({authenticated: false}));
                
                de = fixture.debugElement.query(By.css('h1'));
                el = de.nativeElement;

            });


    }));
    */

    /*
    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);

        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('h1'));
        el = de.nativeElement;
    });
*/
    /*
    it('should contain header title', () => {
        fixture.detectChanges();
        expect(el.textContent).toContain(comp.title);
    });
    */
//});