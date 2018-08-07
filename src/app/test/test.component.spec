import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestComponent } from './test.component';
import { ShoppingCartService } from '../services/shopping.cart.service';
import { Observable } from 'rxjs/Rx';

describe('TestComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let shoppingCartService: ShoppingCartService;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    let userServiceStub = {
      totalQuantity: 5,
    };

    TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      providers: [ {provide: ShoppingCartService, useValue: Observable.of({totalQuantity: 5})} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    shoppingCartService = fixture.debugElement.injector.get(ShoppingCartService);


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



});
