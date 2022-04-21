import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: ()=> import('@my-frontend-concepts/recursive-component-app/feature')
        .then((m) => m.RecursiveComponentAppFeatureModule)
      },
    ]),
  ],
  providers: [],
})
export class RemoteEntryModule {}
