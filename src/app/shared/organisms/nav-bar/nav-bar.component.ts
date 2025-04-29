import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  template: `
    <nav class="nav-bar">
      <div class="logo">Real Estate App</div>
      <ul class="nav-links">
        <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
        <li><a routerLink="/contact" routerLinkActive="active">Contact</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    a {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    a:hover, a.active {
      color: #007bff;
    }
  `]
})
export class NavBarComponent { } 