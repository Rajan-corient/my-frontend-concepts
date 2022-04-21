import { Component, OnInit } from '@angular/core';
import { CommentSchema, Comment } from '@my-frontend-concepts/recursive-component-app/data-access';

@Component({
  selector: 'my-frontend-concepts-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss']
})
export class PostContainerComponent implements OnInit {

  commentList: Array<Comment> = [];

  constructor() { }

  ngOnInit(): void {
    this.commentList = CommentSchema;
  }

}
