import { Component, OnInit, Input } from '@angular/core';

import { address } from '../../objects/address.class';

@Component({
  selector: 'app-invoice-details-shippingaddress',
  templateUrl: './invoice-details-shippingaddress.component.html',
  styleUrls: ['./invoice-details-shippingaddress.component.css']
})
export class InvoiceDetailsShippingaddressComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  shipToAddress: address;
  @Input()
  shipToName: string;

}
