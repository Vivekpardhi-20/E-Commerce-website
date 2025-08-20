import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  loggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.loggedIn$.subscribe(status => this.loggedIn = status);
  }
}
