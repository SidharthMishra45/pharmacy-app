export interface Order {
  orderId: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];  
}

export interface OrderItem {
  drugId: string;
  drugName: string;
  quantity: number;
  price: number;
}
