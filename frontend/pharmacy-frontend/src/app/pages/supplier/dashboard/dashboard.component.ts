import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 👈 import RouterModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true, // 
  imports: [RouterModule, CommonModule], // 👈 add this
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}
