import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faClipboardList, 
  faSyncAlt, 
  faSearch, 
  faChevronDown, 
  faArrowDown, 
  faArrowUp, 
  faPills, 
  faCheckCircle, 
  faTimesCircle, 
  faCheckDouble,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  // Font Awesome icons
  icons = {
    faClipboardList,
    faSyncAlt,
    faSearch,
    faChevronDown,
    faArrowDown,
    faArrowUp,
    faPills,
    faCheckCircle,
    faTimesCircle,
    faCheckDouble,
    faBoxOpen
  };

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;

  searchQuery: string = '';
  selectedStatusFilter: string = 'All';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
        this.sortOrders('latest');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    if (this.selectedStatusFilter !== 'All') {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === this.selectedStatusFilter.toLowerCase()
      );
    }

    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(query) ||
        (Array.isArray(order.items) &&
        order.items.some(item => 
          item.drugName.toLowerCase().includes(query)
        ))
      );
    }

    this.filteredOrders = filtered;
  }

  sortOrders(order: 'latest' | 'oldest'): void {
    this.filteredOrders.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return order === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    if (confirm(`Are you sure you want to change this order's status to ${newStatus}?`)) {
      this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
        next: () => {
          this.fetchOrders();
        },
        error: (error) => {
          console.error('Error updating order status:', error);
          alert('Failed to update order status');
        }
      });
    }
  }
}