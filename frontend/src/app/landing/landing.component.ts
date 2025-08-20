import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  template: `
    <app-navbar></app-navbar>
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to E-Shop</h1>
        <p>Discover amazing products, add to cart, and place your orders effortlessly.</p>
        <div class="hero-buttons">
          <a routerLink="/products" class="btn primary">Shop Now</a>
          <a routerLink="/register" class="btn secondary">Sign Up</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="assets/images/hero.png" alt="E-Shop Hero" />
      </div>
    </section>
  `,
  styles: [`
    .hero {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8rem 5%; gap: 2rem;
      background: linear-gradient(to right, #1976d2, #42a5f5);
      color: white; min-height: 80vh;
    }
    .hero-content { max-width: 50%; }
    .hero-content h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero-content p { font-size: 1.2rem; margin-bottom: 2rem; }
    .hero-buttons .btn { padding: 0.8rem 1.5rem; border-radius: 5px; font-weight: bold; text-decoration: none; margin-right: 1rem; }
    .btn.primary { background-color: white; color: #1976d2; }
    .btn.secondary { background-color: transparent; color: white; border: 2px solid white; }
    .btn.primary:hover, .btn.secondary:hover { opacity: 0.85; }
    .hero-image img { max-width: 500px; width: 100%; border-radius: 15px; }
    @media(max-width: 768px) {
      .hero { flex-direction: column; text-align: center; padding-top: 6rem; }
      .hero-content { max-width: 100%; }
      .hero-image { margin-top: 2rem; }
    }
  `]
})
export class LandingComponent {}
