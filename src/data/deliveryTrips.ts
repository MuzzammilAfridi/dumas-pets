export type TripStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type DeliveryStatus = 'Pending' | 'Out For Delivery' | 'Delivered' | 'Failed' | 'Cancelled';

export interface Delivery {
  deliveryId: string;
  orderNumber: string;
  packets: number;
  customerName: string;
  location: string;
  status: DeliveryStatus;
  deliveryBoyName?: string;
  deliveryBoyContact?: string;
}

export interface DeliveryTrip {
  tripId: string;
  date: string; // YYYY-MM-DD
  routeNumber: string;
  routeName: string;
  totalDeliveries: number;
  completedDeliveries: number;
  vehicleModel: string;
  vehicleType: string;
  vehicleNumber: string;
  status: TripStatus;
  deliveries: Delivery[];
}

export const deliveryBoy = {
  name: 'Ramesh Patel',
  vehicle: 'Tata Ace · GJ01AB1234',
  contact: '+91 98765 43210',
};

const today = new Date().toISOString().slice(0, 10);

const mk = (
  id: string,
  rn: string,
  name: string,
  vm: string,
  vt: string,
  vn: string,
  status: TripStatus,
  deliveries: Delivery[],
): DeliveryTrip => ({
  tripId: id,
  date: today,
  routeNumber: rn,
  routeName: name,
  totalDeliveries: deliveries.length,
  completedDeliveries: deliveries.filter(d => d.status === 'Delivered').length,
  vehicleModel: vm,
  vehicleType: vt,
  vehicleNumber: vn,
  status,
  deliveries,
});

export const mockTrips: DeliveryTrip[] = [
  mk('TRIP-001', 'R001', 'Ahmedabad East Route', 'Tata Ace', 'Mini Truck', 'GJ01AB1234', 'In Progress', [
    { deliveryId: 'DEL-001', orderNumber: 'ORD-1001', packets: 5, customerName: 'ABC Traders', location: 'Satellite, Ahmedabad', status: 'Delivered', deliveryBoyName: 'Ramesh Patel', deliveryBoyContact: '+91 98765 43210' },
    { deliveryId: 'DEL-002', orderNumber: 'ORD-1002', packets: 2, customerName: 'Pet Haven', location: 'Bodakdev, Ahmedabad', status: 'Delivered', deliveryBoyName: 'Ramesh Patel', deliveryBoyContact: '+91 98765 43210' },
    { deliveryId: 'DEL-003', orderNumber: 'ORD-1003', packets: 3, customerName: 'Furry Friends', location: 'Vastrapur, Ahmedabad', status: 'Out For Delivery', deliveryBoyName: 'Ramesh Patel', deliveryBoyContact: '+91 98765 43210' },
    { deliveryId: 'DEL-004', orderNumber: 'ORD-1004', packets: 1, customerName: 'Paws Corner', location: 'Thaltej, Ahmedabad', status: 'Pending', deliveryBoyName: 'Ramesh Patel', deliveryBoyContact: '+91 98765 43210' },
  ]),
  mk('TRIP-002', 'R002', 'Ahmedabad West Route', 'Mahindra Bolero', 'Pickup', 'GJ01CD5678', 'Pending', [
    { deliveryId: 'DEL-005', orderNumber: 'ORD-1005', packets: 4, customerName: 'Wagging Tails', location: 'Paldi, Ahmedabad', status: 'Pending', deliveryBoyName: 'Suresh Kumar', deliveryBoyContact: '+91 87654 32109' },
    { deliveryId: 'DEL-006', orderNumber: 'ORD-1006', packets: 6, customerName: 'Bark Avenue', location: 'Navrangpura, Ahmedabad', status: 'Pending', deliveryBoyName: 'Suresh Kumar', deliveryBoyContact: '+91 87654 32109' },
  ]),
  mk('TRIP-003', 'R003', 'Gandhinagar Route', 'Tata 407', 'Mini Truck', 'GJ18EF9012', 'Completed', [
    { deliveryId: 'DEL-007', orderNumber: 'ORD-1007', packets: 2, customerName: 'Happy Paws', location: 'Sector 21, Gandhinagar', status: 'Delivered', deliveryBoyName: 'Mahesh Singh', deliveryBoyContact: '+91 76543 21098' },
    { deliveryId: 'DEL-008', orderNumber: 'ORD-1008', packets: 3, customerName: 'Pet World', location: 'Sector 7, Gandhinagar', status: 'Delivered', deliveryBoyName: 'Mahesh Singh', deliveryBoyContact: '+91 76543 21098' },
    { deliveryId: 'DEL-009', orderNumber: 'ORD-1009', packets: 1, customerName: 'Animal Care', location: 'Sector 11, Gandhinagar', status: 'Delivered', deliveryBoyName: 'Mahesh Singh', deliveryBoyContact: '+91 76543 21098' },
  ]),
  mk('TRIP-004', 'R004', 'South Bopal Route', 'Ashok Leyland Dost', 'Pickup', 'GJ01GH3456', 'In Progress', [
    { deliveryId: 'DEL-010', orderNumber: 'ORD-1010', packets: 5, customerName: 'Doggy Den', location: 'South Bopal, Ahmedabad', status: 'Delivered', deliveryBoyName: 'Dinesh Yadav', deliveryBoyContact: '+91 65432 10987' },
    { deliveryId: 'DEL-011', orderNumber: 'ORD-1011', packets: 2, customerName: 'Kitty Kingdom', location: 'Shela, Ahmedabad', status: 'Out For Delivery', deliveryBoyName: 'Dinesh Yadav', deliveryBoyContact: '+91 65432 10987' },
    { deliveryId: 'DEL-012', orderNumber: 'ORD-1012', packets: 4, customerName: 'Pet Plaza', location: 'Ghuma, Ahmedabad', status: 'Pending', deliveryBoyName: 'Dinesh Yadav', deliveryBoyContact: '+91 65432 10987' },
    { deliveryId: 'DEL-013', orderNumber: 'ORD-1013', packets: 1, customerName: 'Tail Waggers', location: 'Bopal, Ahmedabad', status: 'Failed', deliveryBoyName: 'Dinesh Yadav', deliveryBoyContact: '+91 65432 10987' },
  ]),
  mk('TRIP-005', 'R005', 'SG Highway Route', 'Tata Ace', 'Mini Truck', 'GJ01IJ7890', 'Cancelled', [
    { deliveryId: 'DEL-014', orderNumber: 'ORD-1014', packets: 3, customerName: 'Pet Stop', location: 'SG Highway, Ahmedabad', status: 'Cancelled', deliveryBoyName: 'Ramesh Patel', deliveryBoyContact: '+91 98765 43210' },
    { deliveryId: 'DEL-015', orderNumber: 'ORD-1015', packets: 2, customerName: 'Paw Print', location: 'Sola, Ahmedabad', status: 'Cancelled', deliveryBoyName: 'Ramesh Patel', deliveryBoyContact: '+91 98765 43210' },
  ]),
];

export const tripStatusClass = (s: TripStatus) => {
  switch (s) {
    case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
  }
};

export const deliveryStatusClass = (s: DeliveryStatus) => {
  switch (s) {
    case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Out For Delivery': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
    case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
    case 'Cancelled': return 'bg-slate-200 text-slate-700 border-slate-300';
  }
};
