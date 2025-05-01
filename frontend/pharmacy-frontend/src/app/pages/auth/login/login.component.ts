import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          alert('Login successful!');
  
          const role = this.authService.getUserRole();
          console.log('User role after login:', role);

          if (role === 'Supplier') {
            this.router.navigate(['/supplier/dashboard']);
          } else if (role === 'Admin') {
            this.router.navigate(['/admin/admin-dashboard']);
          } else {
            this.router.navigate(['/']); // default: Doctor/home
          }
        },
        error: (err) => {
          console.error(err);
          alert('Invalid credentials');
        }
      });
    } else {
      alert('Please enter valid credentials');
    }
  }
  

  navigateToSignup() {
    this.router.navigate(['/signup']); 
  }
}
