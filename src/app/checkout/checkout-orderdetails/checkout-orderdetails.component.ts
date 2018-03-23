import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-checkout-orderdetails',
  templateUrl: './checkout-orderdetails.component.html',
  styleUrls: ['./checkout-orderdetails.component.css']
})
export class CheckoutOrderdetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
    _cartTotalPrice: number;

}
