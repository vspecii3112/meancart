import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-details-products',
  templateUrl: './invoice-details-products.component.html',
  styleUrls: ['./invoice-details-products.component.css']
})
export class InvoiceDetailsProductsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  orderedProducts: any;
}
