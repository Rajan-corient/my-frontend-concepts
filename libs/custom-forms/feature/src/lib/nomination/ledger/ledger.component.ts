import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorBase } from '../../types/control-value-accessor-base';

@Component({
  selector: 'my-frontend-concepts-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LedgerComponent,
      multi: true,
    },
  ],
})
export class LedgerComponent
  extends ControlValueAccessorBase
  implements OnInit
{
  receiptsTotal = 0;
  delveriesTotal = 0;
  @Output() balanceChanged: EventEmitter<any> = new EventEmitter();
  constructor() {
    super();
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formGroup = new FormGroup({
      deliveries: new FormControl(),
      receipts: new FormControl(),
    });
  }

  handleReceiptsTotalChanged(total: any) {
    console.log('receipts changed', total);
    this.receiptsTotal = total;
    this.raiseBalanceChanged();
  }
  handlerDeliveriesTotalChanged(total: any) {
    this.delveriesTotal = total;
    this.raiseBalanceChanged();
  }

  raiseBalanceChanged() {
    this.balanceChanged.emit({
      receiptTotal: this.receiptsTotal,
      deliveriesTotal: this.delveriesTotal,
      balanced: this.receiptsTotal === this.delveriesTotal ? true : false,
    });
  }
}
