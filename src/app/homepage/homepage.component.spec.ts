//import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import{ HomepageComponent } from './homepage.component';

function isValidInput(input: number): boolean {
    if (Number(input) < 1 || !Number.isInteger(Number(input))) {
      return false;
    }
    return true;
  }

describe("checks to see if input is valid using the function isValidInput()", ()=> {
    /*
    let homepageComponent: HomepageComponent;
    let fixture: ComponentFixture<HomepageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomepageComponent]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomepageComponent);
        homepageComponent = fixture.componentInstance;
    });
    */

    it("should expect 0 to not be valid", ()=>{
        expect(isValidInput(0)).toBeFalsy();
    });

    it("should expect -1 to not be valid", () => {
        expect(isValidInput(-1)).toBeFalsy();
    });

    it("should expect 1.1 to not be valid", () => {
        expect(isValidInput(1.1)).toBeFalsy();
    });

    it("should expect 1 to be valid", () => {
        expect(isValidInput(1)).toBeTruthy();
    });

    it("should expect 2 to be valid", () => {
        expect(isValidInput(2)).toBeTruthy();
    });
});