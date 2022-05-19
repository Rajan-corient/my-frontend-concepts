import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: 'login',
          loadChildren: () =>
            import('login/Module').then((m) => m.RemoteEntryModule),
        },
        {
          path: 'custom-forms',
          loadChildren: () =>
            import('custom-forms/Module').then((m) => m.RemoteEntryModule),
        },
        {
          path: 'recursive-component',
          loadChildren: () =>
            import('recursive-component-app/Module').then(
              (m) => m.RemoteEntryModule
            ),
        },
        {
          path: 'dependency-injection',
          loadChildren: () =>
            import('dependency-injection/Module').then(
              (m) => m.RemoteEntryModule
            ),
        },
        // {
        //   path: 'custom-forms',
        //   loadChildren: () =>
        //     import('custom-forms/Module').then((m) => m.RemoteEntryModule),
        // },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
