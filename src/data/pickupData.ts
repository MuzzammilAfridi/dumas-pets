export type PickupStatus =
  | 'Pending Pickup' | 'Eligible' | 'Assigned' | 'Out for Delivery' | 'Delivered' | 'Reassigned' | 'Failed Validation';

export const PICKUP_STATUSES: PickupStatus[] = [
  'Pending Pickup', 'Eligible', 'Assigned', 'Out for Delivery', 'Delivered', 'Reassigned', 'Failed Validation',
];

export const statusPill: Record<PickupStatus, string> = {
  'Pending Pickup':     'bg-gray-100 text-gray-700 border-gray-200',
  'Eligible':           'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Assigned':           'bg-blue-50 text-blue-700 border-blue-200',
  'Out for Delivery':   'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Delivered':          'bg-green-50 text-green-700 border-green-200',
  'Reassigned':         'bg-amber-50 text-amber-700 border-amber-200',
  'Failed Validation':  'bg-red-50 text-red-700 border-red-200',
};

export interface Pickup {
  id: string;
  kitchenRef: string;
  salesOrder: string;
  deliveryNote: string;
  customer: string;
  phone: string;
  address: string;
  area: string;
  timeSlot: string;
  deliveryType: 'Standard' | 'Express';
  itemsCount: number;
  itemsSummary: string;
  priority: 'Normal' | 'High' | 'Urgent';
  paymentDone: boolean;
  stockReady: boolean;
  addressAvailable: boolean;
  contactAvailable: boolean;
  zoneServiceable: boolean;
  status: PickupStatus;
  assignedPartnerId?: string;
  suggestedPartnerId?: string;
  expectedWindow: string;
  reassignedToday?: boolean;
  audit: { action: string; user: string; at: string; remarks?: string }[];
}

export interface Partner {
  id: string;
  name: string;
  initials: string;
  status: 'online' | 'on-shift' | 'offline';
  active: boolean;
  areas: string[];
  assigned: number;
  capacity: number;
  expressCapable: boolean;
  currentRoute: string;
}

export const mockPartners: Partner[] = [
  { id: 'DP-01', name: 'Rohan Mehta',   initials: 'RM', status: 'online',   active: true,  areas: ['Bandra','Khar'],          assigned: 3, capacity: 8, expressCapable: true,  currentRoute: 'West Loop A' },
  { id: 'DP-02', name: 'Aisha Khan',    initials: 'AK', status: 'on-shift', active: true,  areas: ['Andheri','Juhu'],         assigned: 6, capacity: 8, expressCapable: true,  currentRoute: 'West Loop B' },
  { id: 'DP-03', name: 'Vikram Singh',  initials: 'VS', status: 'online',   active: true,  areas: ['Powai','Vikhroli'],       assigned: 7, capacity: 8, expressCapable: false, currentRoute: 'East Loop' },
  { id: 'DP-04', name: 'Priya Sharma',  initials: 'PS', status: 'on-shift', active: true,  areas: ['Worli','Lower Parel'],    assigned: 2, capacity: 6, expressCapable: true,  currentRoute: 'South Loop' },
  { id: 'DP-05', name: 'Karan Patel',   initials: 'KP', status: 'offline',  active: false, areas: ['Malad','Goregaon'],       assigned: 0, capacity: 8, expressCapable: false, currentRoute: '—' },
  { id: 'DP-06', name: 'Neha Iyer',     initials: 'NI', status: 'online',   active: true,  areas: ['Bandra','Worli'],         assigned: 4, capacity: 8, expressCapable: true,  currentRoute: 'Central' },
];

const mk = (i: number, p: Partial<Pickup>): Pickup => ({
  id: `PU-${1000 + i}`,
  kitchenRef: `KR-${2000 + i}`,
  salesOrder: `SO-${5000 + i}`,
  deliveryNote: `DN-${7000 + i}`,
  customer: 'Customer', phone: '+91 90000 00000',
  address: '—', area: 'Bandra', timeSlot: '10:00 – 12:00',
  deliveryType: 'Standard', itemsCount: 2, itemsSummary: 'Chicken Meal ×2',
  priority: 'Normal',
  paymentDone: true, stockReady: true, addressAvailable: true, contactAvailable: true, zoneServiceable: true,
  status: 'Eligible', expectedWindow: 'Today 12:00 – 14:00',
  audit: [{ action: 'Created', user: 'System', at: new Date().toISOString() }],
  ...p,
});

export const mockPickups: Pickup[] = [
  mk(1, { customer: 'Anita Rao',     phone: '+91 98200 12345', address: 'Flat 4B, Linking Rd, Bandra West', area: 'Bandra',  timeSlot: '10:00 – 12:00', deliveryType: 'Express',  itemsCount: 3, itemsSummary: 'Chicken Bowl ×2, Treats ×1', priority: 'High',   suggestedPartnerId: 'DP-01' }),
  mk(2, { customer: 'Rahul Verma',   phone: '+91 99300 22345', address: '12, Hill Road, Bandra',           area: 'Bandra',  timeSlot: '12:00 – 14:00', deliveryType: 'Standard', itemsCount: 2, itemsSummary: 'Lamb Stew ×2',              priority: 'Normal', suggestedPartnerId: 'DP-06', status: 'Assigned', assignedPartnerId: 'DP-06' }),
  mk(3, { customer: 'Sneha Pillai',  phone: '+91 98765 43210', address: 'B-7, Andheri East',                area: 'Andheri', timeSlot: '14:00 – 16:00', deliveryType: 'Express',  itemsCount: 4, itemsSummary: 'Cake ×1, Treats ×3',         priority: 'Urgent', suggestedPartnerId: 'DP-02' }),
  mk(4, { customer: 'Imran Sheikh',  phone: '+91 91000 99887', address: 'A-22, JVPD, Juhu',                 area: 'Juhu',    timeSlot: '10:00 – 12:00', deliveryType: 'Standard', itemsCount: 1, itemsSummary: 'Chicken Meal ×1',          priority: 'Normal', suggestedPartnerId: 'DP-02', status: 'Out for Delivery', assignedPartnerId: 'DP-02' }),
  mk(5, { customer: 'Divya Nair',    phone: '+91 90909 80808', address: 'Hiranandani, Powai',               area: 'Powai',   timeSlot: '16:00 – 18:00', deliveryType: 'Standard', itemsCount: 2, itemsSummary: 'Veg Mix ×2',                priority: 'Normal', suggestedPartnerId: 'DP-03', stockReady: false, status: 'Failed Validation' }),
  mk(6, { customer: 'Aman Joshi',    phone: '+91 90011 22334', address: 'Vikhroli Park Site',               area: 'Vikhroli',timeSlot: '12:00 – 14:00', deliveryType: 'Standard', itemsCount: 3, itemsSummary: 'Lamb Stew ×3',              priority: 'High',   suggestedPartnerId: 'DP-03' }),
  mk(7, { customer: 'Tara Kapoor',   phone: '+91 99887 66554', address: 'Sea View, Worli',                  area: 'Worli',   timeSlot: '10:00 – 12:00', deliveryType: 'Express',  itemsCount: 2, itemsSummary: 'Birthday Cake ×1, Treats ×1', priority: 'Urgent', suggestedPartnerId: 'DP-04' }),
  mk(8, { customer: 'Manish Gupta',  phone: '+91 90000 11122', address: 'Kamala Mills, Lower Parel',        area: 'Lower Parel', timeSlot: '14:00 – 16:00', deliveryType: 'Standard', itemsCount: 5, itemsSummary: 'Chicken Bowl ×3, Treats ×2', priority: 'Normal', suggestedPartnerId: 'DP-04', status: 'Delivered', assignedPartnerId: 'DP-04' }),
  mk(9, { customer: 'Riya Bhatt',    phone: '+91 98989 77665', address: 'Inorbit, Malad West',              area: 'Malad',   timeSlot: '16:00 – 18:00', deliveryType: 'Standard', itemsCount: 1, itemsSummary: 'Treats ×1',                  priority: 'Normal', addressAvailable: false, status: 'Pending Pickup' }),
  mk(10,{ customer: 'Kabir Shah',    phone: '+91 90222 33344', address: 'Khar Pali Naka',                   area: 'Khar',    timeSlot: '12:00 – 14:00', deliveryType: 'Express',  itemsCount: 2, itemsSummary: 'Chicken Bowl ×2',           priority: 'High',   suggestedPartnerId: 'DP-01', reassignedToday: true, status: 'Reassigned', assignedPartnerId: 'DP-01' }),
];
