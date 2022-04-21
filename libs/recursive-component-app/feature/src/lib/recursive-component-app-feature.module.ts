import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { PostContainerComponent } from './post-container/post-container.component';
import { CommentComponent } from './comment/comment.component';

export const recursiveComponentAppFeatureRoutes: Route[] = [
  {
    path: '',
    component: PostContainerComponent
  }
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(recursiveComponentAppFeatureRoutes)
  ],
  declarations: [
    PostContainerComponent,
    CommentComponent
  ],
  exports: [
    PostContainerComponent,
    CommentComponent
  ],
})
export class RecursiveComponentAppFeatureModule {}
