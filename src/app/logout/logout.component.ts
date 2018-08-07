import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping.cart.service'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  private total_qty: number = 0;

  constructor(
    private shoppingCart: ShoppingCartService
  ) {}

  ngOnInit() {
    this.getTotalQuantity();
  }

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
}
