import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Meetup App';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  //logout
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  //get current usname
  get currentUserName(): string {
    return this.authService.getCurrentUser()?.name || '';
  }
}