import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell">
      <app-navbar *ngIf="isLoggedIn()"></app-navbar>
      <main [ngClass]="isLoggedIn() ? 'app-main app-main-authenticated' : 'app-main app-main-guest'">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
