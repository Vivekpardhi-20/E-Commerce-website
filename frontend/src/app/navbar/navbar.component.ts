import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username = '';

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      const user = this.auth.getUser();
      this.username = user ? user.email : '';
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
