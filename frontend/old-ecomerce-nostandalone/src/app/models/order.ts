import { CartItem } from './cart-item';

export interface Order {
  id:     string;
  items:  CartItem[];
  total:  number;
  date:   string;   // ISO 8601
  status: string;
}
