import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule],
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
          this.router.navigate(['/']);
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
