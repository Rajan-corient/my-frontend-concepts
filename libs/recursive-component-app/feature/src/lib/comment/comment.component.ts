import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '@my-frontend-concepts/recursive-component-app/data-access';

@Component({
  selector: 'my-frontend-concepts-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input()
  comments!: Array<Comment>;

  constructor() { }

  ngOnInit(): void {
  }

}
