import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { ShoppingCartService } from '../../services/shopping.cart.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})

export class PurchaseHistoryComponent implements OnInit {

  constructor(
    private shoppingCart: ShoppingCartService,
    private user: UserService,
    private _router: Router) {}
  
  ngOnInit() {
      this.getTotalQuantity();
      this.getPurchaseHistory();
  }
  
  total_qty: number = 0;    //stores the number of items in the variable and this number is shown beside the shopping cart link
  orders: any = [];
  itemsInCart: any = [];
  // This function will ge the total quantity of items in the cart to update the badge in the header
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

  getPurchaseHistory(){
    this.user.getPurchaseHistory()
      .subscribe(
        data => {
          this.orders = data.customerOrders;
          //console.log(data.customerOrders);

          //The below code puts the individual items in the cart in an array to use in Angular ngFor loop in html page
          //****************************************************************** */
          this.orders.forEach((element:any) => {
            var a: any = [];
            //push the cart items into the array
            for (var i in element.cart.items) {
              a.push(element.cart.items[i]);
            }
            this.itemsInCart.push(a);
          })
          //push the cart orders into the orders array
          for (var i in this.orders) {
            this.orders[i].cart.items = this.itemsInCart[i];
          }
          //******************************************************************* */
          //console.log(this.orders);
        },
        err => {
            this._router.navigate(['/login']);
        },
        () => console.log('complete getting purchase history')
      )
  }
}    
