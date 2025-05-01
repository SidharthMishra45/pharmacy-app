import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconModule } from '@coreui/icons-angular';
import { cilApplicationsSettings, cilCart, cilPeople, cilTags, cilChart, cilListRich, cilAccountLogout } from '@coreui/icons';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule, IconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  icons = { 
    cilApplicationsSettings, 
    cilCart, 
    cilPeople, 
    cilTags, 
    cilChart, 
    cilListRich,
    cilAccountLogout 
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}