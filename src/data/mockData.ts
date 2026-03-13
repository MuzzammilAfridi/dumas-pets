export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
  address: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Pet {
  id: string;
  customerId: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  medicalNotes: string;
  image: string;
}

export interface Address {
  id: string;
  customerId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export const mockOrders: Order[] = [
  { id: 'ORD-001', customerId: 'c1', customerName: 'Sarah Mitchell', items: [{ name: 'Premium Chicken & Rice', quantity: 2, price: 24.99 }, { name: 'Crunchy Chicken Bites', quantity: 1, price: 12.99 }], total: 62.97, status: 'Delivered', date: '2026-03-10', address: '123 Oak St, Portland' },
  { id: 'ORD-002', customerId: 'c2', customerName: 'John Davis', items: [{ name: 'Birthday Celebration Cake', quantity: 1, price: 34.99 }], total: 34.99, status: 'Processing', date: '2026-03-11', address: '456 Elm Ave, Seattle' },
  { id: 'ORD-003', customerId: 'c1', customerName: 'Sarah Mitchell', items: [{ name: 'Grain-Free Chicken', quantity: 3, price: 29.99 }], total: 89.97, status: 'Pending', date: '2026-03-12', address: '123 Oak St, Portland' },
  { id: 'ORD-004', customerId: 'c3', customerName: 'Emily Roberts', items: [{ name: 'Peanut Butter Bones', quantity: 2, price: 10.99 }, { name: 'Dental Chew Sticks', quantity: 1, price: 14.99 }], total: 36.97, status: 'Delivered', date: '2026-03-08', address: '789 Pine Rd, Denver' },
  { id: 'ORD-005', customerId: 'c2', customerName: 'John Davis', items: [{ name: 'Buffalo & Grain Mix', quantity: 1, price: 27.99 }], total: 27.99, status: 'Cancelled', date: '2026-03-09', address: '456 Elm Ave, Seattle' },
  { id: 'ORD-006', customerId: 'c3', customerName: 'Emily Roberts', items: [{ name: 'Complete Nutrition Mix', quantity: 2, price: 25.99 }], total: 51.98, status: 'Pending', date: '2026-03-13', address: '789 Pine Rd, Denver' },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '555-0101', joinDate: '2025-06-15', totalOrders: 12, totalSpent: 456.80 },
  { id: 'c2', name: 'John Davis', email: 'john@example.com', phone: '555-0102', joinDate: '2025-08-22', totalOrders: 8, totalSpent: 289.50 },
  { id: 'c3', name: 'Emily Roberts', email: 'emily@example.com', phone: '555-0103', joinDate: '2025-11-01', totalOrders: 5, totalSpent: 178.90 },
];

export const mockPets: Pet[] = [
  { id: 'p1', customerId: 'c1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', age: 4, weight: 32, medicalNotes: 'Allergic to grains', image: '' },
  { id: 'p2', customerId: 'c1', name: 'Luna', type: 'Cat', breed: 'Persian', age: 2, weight: 4.5, medicalNotes: 'None', image: '' },
  { id: 'p3', customerId: 'c2', name: 'Max', type: 'Dog', breed: 'French Bulldog', age: 3, weight: 12, medicalNotes: 'Sensitive stomach', image: '' },
];

export const mockAddresses: Address[] = [
  { id: 'a1', customerId: 'c1', label: 'Home', street: '123 Oak St', city: 'Portland', state: 'OR', zip: '97201', isDefault: true },
  { id: 'a2', customerId: 'c1', label: 'Work', street: '456 Business Ave', city: 'Portland', state: 'OR', zip: '97205', isDefault: false },
  { id: 'a3', customerId: 'c2', label: 'Home', street: '456 Elm Ave', city: 'Seattle', state: 'WA', zip: '98101', isDefault: true },
];
