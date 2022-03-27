import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of } from 'rxjs';
import { base_template } from '../../base-template';
import { FormGeneratorComponent } from '../../form-generator/form-generator.component';
import { ControlType, SmartFormControl } from '../../types/basic-form-types';

@Component({
  selector: 'my-frontend-concepts-order-item',
  template: `${base_template}`,
  // templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      multi:true,
      useExisting:OrderItemComponent
    }
  ]
})
export class OrderItemComponent extends FormGeneratorComponent implements OnInit,OnDestroy {

  constructor() {
    super();
   }

 override ngOnInit(): void {
   this.createForm();
   super.ngOnInit();
  }

  createForm() {
    this.formGroup = new FormGroup({
      facility: new SmartFormControl({
        caption: 'Facility',
        type: ControlType.DropDown,
        options: of(['Facility-1', 'Facility-2']),
      }),
      product: new SmartFormControl({
        caption: 'Product',
        type: ControlType.DropDown,
        options: of(['Product-1', 'Product-2']),
      }),
      quantity: new SmartFormControl({
        caption: 'Qty',
        type: ControlType.TextBox,
      }),
    });
  }
  override ngOnDestroy(): void {
      super.ngOnDestroy();
  }

}
