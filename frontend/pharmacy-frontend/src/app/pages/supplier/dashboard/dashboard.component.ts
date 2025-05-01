import { Component } from '@angular/core';
import { Router } from '@angular/router'; // 👈 import Router
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  logout(): void {
    // Clear token/localStorage/sessionStorage as per your auth system
    localStorage.removeItem('token'); // 👈 Remove token
    localStorage.removeItem('user');  // 👈 Optional if you store user data

    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
