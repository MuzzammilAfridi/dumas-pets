export type TripStatus = 'Draft' | 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled';
export type StopStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Failed';
export type DNStatus = 'Open' | 'Partially Delivered' | 'Delivered';

export interface Driver {
  id: string;
  name: string;
  mobile: string;
  license: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
}

export interface Vehicle {
  id: string;
  number: string;
  type: 'Mini Van' | 'Truck' | 'Bike' | 'Tempo';
  capacity: string;
  odometer: number;
}

export interface DeliveryNote {
  id: string;
  customer: string;
  date: string;
  address: string;
  contact: string;
  qty: number;
  status: DNStatus;
}

export interface DeliveryStop {
  stopNo: number;
  deliveryNoteId: string;
  customer: string;
  address: string;
  contact: string;
  eta: string;
  status: StopStatus;
}

export interface ActivityEntry {
  timestamp: string;
  user: string;
  activity: string;
  remarks: string;
}

export interface TrackingStep {
  key: 'Draft' | 'Scheduled' | 'Driver Assigned' | 'Vehicle Assigned' | 'In Transit' | 'Completed';
  timestamp?: string;
  user?: string;
  done: boolean;
}

export const mockDrivers: Driver[] = [
  { id: 'DRV-001', name: 'Ramesh Kumar',    mobile: '+91 98765 43210', license: 'DL-0420180012345', status: 'Available' },
  { id: 'DRV-002', name: 'Suresh Patel',    mobile: '+91 99820 11122', license: 'DL-0420190098765', status: 'On Trip'   },
  { id: 'DRV-003', name: 'Arjun Singh',     mobile: '+91 90909 88776', license: 'DL-0420170045678', status: 'Available' },
  { id: 'DRV-004', name: 'Mohammed Iqbal',  mobile: '+91 93210 55443', license: 'DL-0420160033221', status: 'Off Duty'  },
];

export const mockVehicles: Vehicle[] = [
  { id: 'VEH-001', number: 'MH-12-AB-3344', type: 'Mini Van', capacity: '750 kg',  odometer: 48230 },
  { id: 'VEH-002', number: 'MH-14-CD-8821', type: 'Tempo',    capacity: '1500 kg', odometer: 91204 },
  { id: 'VEH-003', number: 'KA-05-EF-2210', type: 'Bike',     capacity: '40 kg',   odometer: 15670 },
  { id: 'VEH-004', number: 'DL-08-GH-7766', type: 'Truck',    capacity: '3500 kg', odometer: 120876 },
];

export const mockDeliveryNotes: DeliveryNote[] = [
  { id: 'DN-1001', customer: 'Sarah Mitchell', date: '2026-06-05', address: '123 Oak St, Bandra West, Mumbai',     contact: '+91 98111 22233', qty: 3, status: 'Open' },
  { id: 'DN-1002', customer: 'John Davis',     date: '2026-06-05', address: '456 Elm Ave, Powai, Mumbai',          contact: '+91 98222 33344', qty: 2, status: 'Open' },
  { id: 'DN-1003', customer: 'Emily Roberts',  date: '2026-06-05', address: '789 Pine Rd, Andheri East, Mumbai',   contact: '+91 98333 44455', qty: 5, status: 'Partially Delivered' },
  { id: 'DN-1004', customer: 'Priya Sharma',   date: '2026-06-05', address: '12 Hill View, Juhu, Mumbai',          contact: '+91 98444 55566', qty: 1, status: 'Open' },
  { id: 'DN-1005', customer: 'Karthik Iyer',   date: '2026-06-05', address: '88 MG Road, Worli, Mumbai',           contact: '+91 98555 66677', qty: 4, status: 'Open' },
  { id: 'DN-1006', customer: 'Anjali Verma',   date: '2026-06-05', address: '4 Lake Side, Goregaon West, Mumbai',  contact: '+91 98666 77788', qty: 2, status: 'Open' },
];

export const mockActivity: ActivityEntry[] = [
  { timestamp: '2026-06-04 09:12', user: 'admin', activity: 'Trip Created',     remarks: 'Draft DT-0001 created' },
  { timestamp: '2026-06-04 09:45', user: 'admin', activity: 'Driver Assigned',  remarks: 'Ramesh Kumar assigned' },
  { timestamp: '2026-06-04 09:46', user: 'admin', activity: 'Vehicle Assigned', remarks: 'MH-12-AB-3344 assigned' },
  { timestamp: '2026-06-04 10:00', user: 'admin', activity: 'Trip Scheduled',   remarks: 'Departure 2026-06-05 08:00' },
];

export const statusPill = (s: TripStatus | StopStatus | DNStatus | Driver['status']) => {
  const map: Record<string, string> = {
    'Draft':                'bg-gray-100 text-gray-700 border-gray-200',
    'Scheduled':            'bg-blue-100 text-blue-700 border-blue-200',
    'In Transit':           'bg-amber-100 text-amber-800 border-amber-200',
    'Completed':            'bg-green-100 text-green-700 border-green-200',
    'Cancelled':            'bg-red-100 text-red-700 border-red-200',
    'Pending':              'bg-gray-100 text-gray-700 border-gray-200',
    'Delivered':            'bg-green-100 text-green-700 border-green-200',
    'Failed':               'bg-red-100 text-red-700 border-red-200',
    'Open':                 'bg-blue-100 text-blue-700 border-blue-200',
    'Partially Delivered':  'bg-amber-100 text-amber-800 border-amber-200',
    'Available':            'bg-green-100 text-green-700 border-green-200',
    'On Trip':              'bg-amber-100 text-amber-800 border-amber-200',
    'Off Duty':             'bg-gray-100 text-gray-700 border-gray-200',
  };
  return map[s] ?? 'bg-muted text-foreground border-border';
};
