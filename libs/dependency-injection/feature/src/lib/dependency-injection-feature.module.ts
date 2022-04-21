import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { DiContainerComponent } from './di-container/di-container.component';

export const dependencyInjectionFeatureRoutes: Route[] = [
  {
    path: '',
    component: DiContainerComponent
  }
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(dependencyInjectionFeatureRoutes)
  ],
  declarations: [
    DiContainerComponent
  ],
  exports: [
    DiContainerComponent
  ],
})
export class DependencyInjectionFeatureModule {}
