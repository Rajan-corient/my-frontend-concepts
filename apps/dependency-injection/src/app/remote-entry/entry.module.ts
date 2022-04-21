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
        loadChildren: ()=> import('@my-frontend-concepts/dependency-injection/feature')
        .then((m) => m.DependencyInjectionFeatureModule)
      },
    ]),
  ],
  providers: [],
})
export class RemoteEntryModule {}
