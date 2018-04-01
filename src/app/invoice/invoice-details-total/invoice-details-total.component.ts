import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-invoice-details-total',
  templateUrl: './invoice-details-total.component.html',
  styleUrls: ['./invoice-details-total.component.css']
})
export class InvoiceDetailsTotalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  orderSubTotal: number;
}
