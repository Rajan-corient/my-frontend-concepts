import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@my-frontend-concepts/shared/data-access/user';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'my-frontend-concepts-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public isLoggedIn$ = this.userService.isUserLoggedIn$;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$
    .pipe(distinctUntilChanged())
    .subscribe(async (loggedIn) => {
      if (!loggedIn) {
        this.router.navigateByUrl('login');
      } else {
        this.router.navigateByUrl('');
      }
    });
  }

}
