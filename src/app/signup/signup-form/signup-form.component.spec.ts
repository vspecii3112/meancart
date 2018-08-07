import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { SignupFormComponent } from "./signup-form.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe("test signup form", () => {
    let signupFormComponent: SignupFormComponent;
    let fixture: ComponentFixture<SignupFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignupFormComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SignupFormComponent);
            signupFormComponent = fixture.componentInstance;
            signupFormComponent.ngOnInit();
        });
    }));

    it("test if form is invalid when all fields are empty", () => {
        expect(signupFormComponent.signupForm.valid).toBeFalsy();
    });

    it("test if form is invalid when first name is empty", () => {
        signupFormComponent.signupForm.controls["lname"].setValue("lastname");
        signupFormComponent.signupForm.controls["email"].setValue("1@1.com");
        signupFormComponent.signupForm.controls["username"].setValue("test1");
        signupFormComponent.signupForm.controls["password"].setValue("1234567");
        expect(signupFormComponent.signupForm.valid).toBeFalsy();
    });

    it("test if form is invalid when last name is empty", () => {
        signupFormComponent.signupForm.controls["fname"].setValue("firstname");
        signupFormComponent.signupForm.controls["email"].setValue("1@1.com");
        signupFormComponent.signupForm.controls["username"].setValue("test1");
        signupFormComponent.signupForm.controls["password"].setValue("1234567");
        expect(signupFormComponent.signupForm.valid).toBeFalsy();
    });

    it("test if form is invalid when email is empty", () => {
        signupFormComponent.signupForm.controls["lname"].setValue("lastname");
        signupFormComponent.signupForm.controls["fname"].setValue("firstname");
        signupFormComponent.signupForm.controls["username"].setValue("test1");
        signupFormComponent.signupForm.controls["password"].setValue("1234567");
        expect(signupFormComponent.signupForm.valid).toBeFalsy();
    });

    it("test if form is invalid when username is empty", () => {
        signupFormComponent.signupForm.controls["lname"].setValue("lastname");
        signupFormComponent.signupForm.controls["fname"].setValue("firstname");
        signupFormComponent.signupForm.controls["email"].setValue("1@1.com");
        signupFormComponent.signupForm.controls["password"].setValue("1234567");
        expect(signupFormComponent.signupForm.valid).toBeFalsy();
    });

    it("test if form is invalid when password is empty", () => {
        signupFormComponent.signupForm.controls["lname"].setValue("lastname");
        signupFormComponent.signupForm.controls["fname"].setValue("firstname");
        signupFormComponent.signupForm.controls["email"].setValue("1@1.com");
        signupFormComponent.signupForm.controls["username"].setValue("test1");
        expect(signupFormComponent.signupForm.valid).toBeFalsy();
    });

    it("test form when emitting correct value", ()=> {
        let lname: string = "";
        let fname: string = "";
        let email: string = "";
        let uname: string = "";
        let pword: string = ""

        signupFormComponent.formEmitter.subscribe(value => {
            lname = value.lname;
            fname = value.fname;
            email = value.email;
            uname = value.username;
            pword = value.password;
        });

        signupFormComponent.signupForm.controls["lname"].setValue("lastname");
        signupFormComponent.signupForm.controls["fname"].setValue("firstname");
        signupFormComponent.signupForm.controls["email"].setValue("1@1.com");
        signupFormComponent.signupForm.controls["username"].setValue("test1");
        signupFormComponent.signupForm.controls["password"].setValue("1234567");

        signupFormComponent.signup(signupFormComponent.signupForm);

        expect(lname).toBe("lastname");
        expect(fname).toBe("firstname");
        expect(email).toBe("1@1.com");
        expect(uname).toBe("test1");
        expect(pword).toBe("1234567");

    });

});