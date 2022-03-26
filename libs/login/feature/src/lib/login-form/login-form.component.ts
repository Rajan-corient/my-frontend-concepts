import { Component, OnInit } from '@angular/core';
import { UserService } from '@my-frontend-concepts/shared/data-access/user';

@Component({
  selector: 'my-frontend-concepts-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  username = '';
  password = '';

  isLoggedIn$ = this.userService.isUserLoggedIn$;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
  }

  login() {
    this.userService.checkCredentials(this.username, this.password);
  }
}
