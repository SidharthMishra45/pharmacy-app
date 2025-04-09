import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [RouterModule, FooterComponent, FormsModule],
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  ConfirmPassword: string = '';
  role: string = ''; 

  constructor(private router: Router, private authService: AuthService) {}

  onSignup() {
    console.log("Submitting registration:", {
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.ConfirmPassword,
      role: this.role
    });
    
    if (this.name && this.email && this.password && this.ConfirmPassword && this.role) {
      if (this.password !== this.ConfirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      this.authService.register({
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.ConfirmPassword,
        role: this.role
      }).subscribe({
        next: () => {
          alert('Account Created Successfully!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error("Signup error:", err);
          if (err.error && typeof err.error === 'object') {
            const messages = Object.values(err.error).flat();
            alert('Signup failed:\n' + messages.join('\n'));
          } else {
            alert('Signup failed: ' + (err.error || 'Something went wrong'));
          }
        }
      });
    } else {
      alert('Please fill in all fields');
    }
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  
}

