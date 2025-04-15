// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';  // Import AuthService to get the user's role

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if the user has a valid role (e.g., 'supplier')
    const userRole = this.authService.getUserRole();

    if (userRole === 'Supplier') {
      return true;  // Allow access if the user is a supplier
    } else {
      // Redirect to login page if not a supplier
      this.router.navigate(['/login']);
      return false;
    }
  }
}
