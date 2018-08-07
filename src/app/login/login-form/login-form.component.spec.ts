import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { LoginFormComponent } from "./login-form.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe("test login form", () => {

    let loginFormComponent: LoginFormComponent;
    let fixture: ComponentFixture<LoginFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginFormComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(LoginFormComponent);
            loginFormComponent = fixture.componentInstance;
            loginFormComponent.ngOnInit();
        });
    }));

    it("test form is invalid when all fields are empty", () => {
        expect(loginFormComponent.loginForm.valid).toBeFalsy();
    });

    it("test form is invalid when only password is empty", () => {
        let username = loginFormComponent.loginForm.controls["username"];
        username.setValue("test1");
        expect(loginFormComponent.loginForm.valid).toBeFalsy();
    });

    it("test form is invalid when only username is empty", () => {
        let password = loginFormComponent.loginForm.controls["password"];
        password.setValue("1234567");
        expect(loginFormComponent.loginForm.valid).toBeFalsy();
    });
    
    it("test form is valid when fields are not empty", () => {
        loginFormComponent.loginForm.controls["username"].setValue("test1");
        loginFormComponent.loginForm.controls["password"].setValue("1234567");
        expect(loginFormComponent.loginForm.valid).toBeTruthy();
    });

    it("test form when emitting correct value", ()=> {
        let uname: string = "";
        let pword: string = "";

        loginFormComponent.loginEmitter.subscribe(value => {
            uname = value.username;
            pword = value.password;
        });

        loginFormComponent.loginForm.controls["username"].setValue("test1");
        loginFormComponent.loginForm.controls["password"].setValue("1234567");

        loginFormComponent.login(loginFormComponent.loginForm);

        expect(uname).toBe("test1");
        expect(pword).toBe("1234567");

    });

});