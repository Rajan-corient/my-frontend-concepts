import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGeneratorComponent } from './form-generator/form-generator.component';
import { NominationComponent } from './nomination/nomination.component';
import { NominationHeaderComponent } from './nomination/nomination-header/nomination-header.component';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import { MarineDetailsComponent } from './nomination/marine-details/marine-details.component';
import { SecuredSectionComponent } from './nomination/secured-section/secured-section.component';
import { LedgerComponent } from './nomination/ledger/ledger.component';
import { OrderItemComponent } from './nomination/order-item/order-item.component';
import { OrderItemsComponent } from './nomination/order-items/order-items.component';
import { NominationCreatePage2Component } from './nomination/nomination-create-page-2/nomination-create-page2.component';
import { NominationCreatePage1Component } from './nomination/nomination-create-page-1/nomination-create-page1.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    PanelModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    RouterModule.forChild([
      {
        path:'',
        component:NominationComponent
      }
    ])
  ],
  declarations: [
    FormGeneratorComponent,
    NominationComponent,
    NominationCreatePage1Component,
    NominationCreatePage2Component,
    NominationHeaderComponent,
    MarineDetailsComponent,
    SecuredSectionComponent,
    LedgerComponent,
    OrderItemComponent,
    OrderItemsComponent,
  ],
  providers:[
    DatePipe
  ]
})
export class CustomFormsFeatureModule {}
