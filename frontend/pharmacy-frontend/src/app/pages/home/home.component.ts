import { Component } from '@angular/core';
import { DrugListComponent } from '../../components/drug-list/drug-list.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [NavbarComponent, DrugListComponent, FooterComponent], 
})
export class HomeComponent {
  searchQuery: string = '';
  
  onSearch(query: string) {
    this.searchQuery = query;
    console.log('Home received search:', query);

  }
}