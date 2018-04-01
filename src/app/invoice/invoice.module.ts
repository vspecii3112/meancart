import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceDetailsShippingaddressComponent } from './invoice-details-shippingaddress/invoice-details-shippingaddress.component';
import { InvoiceDetailsProductsComponent } from './invoice-details-products/invoice-details-products.component';
import { InvoiceDetailsTotalComponent } from './invoice-details-total/invoice-details-total.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InvoiceDetailsShippingaddressComponent,
        InvoiceDetailsProductsComponent,
        InvoiceDetailsTotalComponent
    ],
    providers: [
    ],
    exports: [
        InvoiceDetailsShippingaddressComponent,
        InvoiceDetailsProductsComponent,
        InvoiceDetailsTotalComponent
    ]
})

export class InvoiceModule {
}