import { CartItem } from './cart-item';

export interface Order {
  id:      string;
  items:   CartItem[];
  total:   number;
  date:    string;  // ISO
  status:  string;
}
