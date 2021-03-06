import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { UserService } from '../../services/user.service';
import { ShoppingCartService } from '../../services/shopping.cart.service';

import { address } from '../../objects/address.class';
import { currency } from '../../objects/currency.class';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  private orderID: string = '';
  private orderExist: boolean = true;
  private name: string = '';
  private shippingAddress: address = {
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    addressCountry: ''
  }
  private orders:any = [];
  private subTotal: number = 0;
  private date: string = '';
  private total_qty: number = 0;    //stores the number of items in the variable and this number is shown beside the shopping cart link
  private currency: currency = {
    currency: " USD",
    forex: "USD/USD",
    rate: 1
  };

  constructor(
    private user: UserService,
    private shoppingCart: ShoppingCartService,
    private _activatedRoute: ActivatedRoute) {
      this._activatedRoute.params.subscribe( params => {
        this.orderID = params.id;
        //console.log(this.orderID);
      });
    }

  ngOnInit() {
    this.getTotalQuantity();
    this.getOrderDetails(this.orderID);
  }

      //The getTotalQuantity function will get the number of items in the shopping cart and stores it in the variable total_qty
      getTotalQuantity() {
        this.shoppingCart.getTotalQuantity()
          .subscribe(
            data => {
              this.total_qty = data.totalQuantity;
            },
            err => console.log('error getting item quantity'),
            () => console.log('complete getting item quantity')
          )
    
      }

  getOrderDetails(orderID: string) {
    this.user.getOrderDetails(orderID)
    .subscribe(
      data => {
        this.orderExist = true;
        this.name = data.orderDetails.name;
        this.shippingAddress = data.orderDetails.address;
        this.orders = data.orderDetails.cart.items;
        this.subTotal = data.orderDetails.cart.totalPrice;
        this.date = data.orderDetails.date;
        this.currency = data.orderDetails.currency;
        //console.log(data.orderDetails);

      },
      err => {
        console.log(err);
        this.orderExist = false;
      },
      () => console.log("order details complete")
    )
  }

}
