import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('../pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../pages/auth/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('../pages/payment/payment.component').then((m) => m.PaymentComponent),
  },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import('../pages/order-confirmation/order-confirmation.component').then((m) => m.OrderConfirmationComponent),
  },
  { 
    path: 'orders/:id', 
    loadComponent: () =>
      import('../pages/order-details/order-details.component').then((m) => m.OrderDetailsComponent),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('../pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'admin/admin-dashboard',
    loadComponent: () =>
      import('../pages/admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'manage-drugs',
        pathMatch: 'full',
      },
      {
        path: 'manage-drugs',
        loadComponent: () =>
          import('../pages/admin/manage-drugs/manage-drugs.component').then((m) => m.ManageDrugsComponent),
      },
      {
        path: 'manage-orders',
        loadComponent: () =>
          import('../pages/admin/manage-orders/manage-orders.component').then((m) => m.ManageOrdersComponent),
      },
      {
        path: 'manage-users',
        loadComponent: () =>
          import('../pages/admin/manage-users/manage-users.component').then((m) => m.ManageUsersComponent),
      },
      {
        path: 'manage-categories',
        loadComponent: () =>
          import('../pages/admin/manage-categories/manage-categories.component').then((m) => m.ManageCategoriesComponent),
      },
      {
        path: 'reports/inventory-report',
        loadComponent: () =>
          import('../pages/admin/reports/inventory-report/inventory-report.component').then((m) => m.InventoryReportComponent),
      },
      {
        path: 'reports/sales-report',
        loadComponent: () =>
          import('../pages/admin/reports/sales-report/sales-report.component').then((m) => m.SalesReportComponent),
      },
    
    ]
  },
  {
    path: 'supplier/dashboard',
    loadComponent: () =>
      import('../pages/supplier/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full',
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('../pages/supplier/inventory/inventory.component').then((m) => m.InventoryComponent),
      },
      {
        path: 'drug-list',
        loadComponent: () =>
          import('../pages/supplier/drug-list/drug-list.component').then((m) => m.DrugListComponent),
      },
      {
        path: 'new-orders',
        loadComponent: () =>
          import('../pages/supplier/new-orders/new-orders.component').then((m) => m.NewOrdersComponent),
      },
      {
        path: 'picked-orders',
        loadComponent: () =>
          import('../pages/supplier/picked-orders/picked-orders.component').then((m) => m.PickedOrdersComponent),
      },
      {
        path: 'rejected-orders',
        loadComponent: () =>
          import('../pages/supplier/rejected-orders/rejected-orders.component').then((m) => m.RejectedOrdersComponent),
      },
      {
        path: 'sales-report',
        loadComponent: () =>
          import('../pages/supplier/sales-report/sales-report.component').then((m) => m.SalesReportComponent),
      },
      
    ],
  },
];
