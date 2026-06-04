export type KitchenOrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'In Preparation'
  | 'Ready for Packing'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface KitchenOrderItem {
  itemName: string;
  quantity: number;
  rawMaterials: string[];
  cookingInstructions: string;
  gpvRatio: string;
}

export interface StatusHistoryEntry {
  status: KitchenOrderStatus;
  timestamp: string;
  updatedBy: string;
}

export interface KitchenOrder {
  id: string;
  orderDate: string;
  pickupDate: string;
  timeSlot: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  items: KitchenOrderItem[];
  deliveryBoy: string;
  deliveryBoyPhone: string;
  vehicleNumber?: string;
  assignedTime?: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  status: KitchenOrderStatus;
  specialNotes?: string;
  lastUpdated: string;
  history: StatusHistoryEntry[];
}

export const KITCHEN_STATUSES: KitchenOrderStatus[] = [
  'Pending',
  'Accepted',
  'In Preparation',
  'Ready for Packing',
  'Packed',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const statusColorMap: Record<KitchenOrderStatus, { bg: string; text: string; row: string }> = {
  'Pending':           { bg: 'bg-gray-100 text-gray-700 border-gray-300',     text: 'text-gray-700',   row: 'bg-gray-50/40' },
  'Accepted':          { bg: 'bg-blue-100 text-blue-700 border-blue-300',     text: 'text-blue-700',   row: 'bg-blue-50/40' },
  'In Preparation':    { bg: 'bg-orange-100 text-orange-700 border-orange-300', text: 'text-orange-700', row: 'bg-orange-50/40' },
  'Ready for Packing': { bg: 'bg-purple-100 text-purple-700 border-purple-300', text: 'text-purple-700', row: 'bg-purple-50/40' },
  'Packed':            { bg: 'bg-cyan-100 text-cyan-700 border-cyan-300',     text: 'text-cyan-700',   row: 'bg-cyan-50/40' },
  'Out for Delivery':  { bg: 'bg-indigo-100 text-indigo-700 border-indigo-300', text: 'text-indigo-700', row: 'bg-indigo-50/40' },
  'Delivered':         { bg: 'bg-green-100 text-green-700 border-green-300',  text: 'text-green-700',  row: 'bg-green-50/40' },
  'Cancelled':         { bg: 'bg-red-100 text-red-700 border-red-300',        text: 'text-red-700',    row: 'bg-red-50/40' },
};

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

export const mockKitchenOrders: KitchenOrder[] = [
  {
    id: 'KO-1001', orderDate: today, pickupDate: today, timeSlot: '10:00 AM - 12:00 PM',
    customerName: 'Sarah Mitchell', phone: '+91 98765 43210', altPhone: '+91 98765 11111',
    items: [{ itemName: 'Premium Chicken & Rice', quantity: 2, rawMaterials: ['Chicken 500g', 'Rice 300g', 'Carrots 100g'], cookingInstructions: 'Boil chicken, mix with steamed rice. No salt.', gpvRatio: 'Puppy' }],
    deliveryBoy: 'Rajesh Kumar', deliveryBoyPhone: '+91 90000 11111', vehicleNumber: 'KA-01-AB-1234', assignedTime: '09:00 AM',
    address: '123 Oak Street, Apt 4B', landmark: 'Near Central Park', city: 'Bangalore', state: 'KA', pincode: '560001',
    status: 'In Preparation', specialNotes: 'Customer prefers warm packaging.',
    lastUpdated: new Date().toISOString(),
    history: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), updatedBy: 'System' },
      { status: 'Accepted', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), updatedBy: 'Chef Anil' },
      { status: 'In Preparation', timestamp: new Date(Date.now() - 3600000).toISOString(), updatedBy: 'Chef Anil' },
    ],
  },
  {
    id: 'KO-1002', orderDate: today, pickupDate: tomorrow, timeSlot: '2:00 PM - 4:00 PM',
    customerName: 'John Davis', phone: '+91 99887 76655',
    items: [{ itemName: 'Birthday Celebration Cake', quantity: 1, rawMaterials: ['Flour 500g', 'Yogurt 200g', 'Carob powder 50g'], cookingInstructions: 'Bake at 180°C for 35 min. Decorate with paw print.', gpvRatio: 'Puppy' }],
    deliveryBoy: 'Suresh Patel', deliveryBoyPhone: '+91 90000 22222', vehicleNumber: 'KA-02-CD-5678',
    address: '456 Elm Avenue', landmark: 'Opposite City Mall', city: 'Mumbai', state: 'MH', pincode: '400001',
    status: 'Pending', specialNotes: 'Add "Happy Birthday Rex" on cake.',
    lastUpdated: new Date().toISOString(),
    history: [{ status: 'Pending', timestamp: new Date().toISOString(), updatedBy: 'System' }],
  },
  {
    id: 'KO-1003', orderDate: today, pickupDate: today, timeSlot: '6:00 PM - 8:00 PM',
    customerName: 'Emily Roberts', phone: '+91 97777 88888',
    items: [
      { itemName: 'Peanut Butter Bones', quantity: 2, rawMaterials: ['Peanut Butter 100g', 'Whole Wheat 200g'], cookingInstructions: 'Shape into bones, bake 20 min.', gpvRatio: 'Adult' },
      { itemName: 'Dental Chew Sticks', quantity: 1, rawMaterials: ['Sweet Potato 150g', 'Parsley 20g'], cookingInstructions: 'Dehydrate for 4 hours.', gpvRatio: 'Senior' },
    ],
    deliveryBoy: 'Mahesh Singh', deliveryBoyPhone: '+91 90000 33333',
    address: '789 Pine Road', landmark: 'Behind Tech Park', city: 'Pune', state: 'MH', pincode: '411001',
    status: 'Ready for Packing',
    lastUpdated: new Date().toISOString(),
    history: [
      { status: 'Pending', timestamp: new Date(Date.now() - 7200000).toISOString(), updatedBy: 'System' },
      { status: 'Ready for Packing', timestamp: new Date().toISOString(), updatedBy: 'Chef Priya' },
    ],
  },
  {
    id: 'KO-1004', orderDate: today, pickupDate: today, timeSlot: '12:00 PM - 2:00 PM',
    customerName: 'Arjun Sharma', phone: '+91 91234 56789',
    items: [{ itemName: 'Grain-Free Chicken', quantity: 3, rawMaterials: ['Chicken 1kg', 'Sweet Potato 300g', 'Spinach 100g'], cookingInstructions: 'Slow cook 45 min. No grains.', gpvRatio: 'Adult' }],
    deliveryBoy: 'Rajesh Kumar', deliveryBoyPhone: '+91 90000 11111', vehicleNumber: 'KA-01-AB-1234',
    address: '12 MG Road', landmark: 'Near Metro Station', city: 'Bangalore', state: 'KA', pincode: '560002',
    status: 'Out for Delivery',
    lastUpdated: new Date().toISOString(),
    history: [{ status: 'Out for Delivery', timestamp: new Date().toISOString(), updatedBy: 'Dispatch' }],
  },
  {
    id: 'KO-1005', orderDate: today, pickupDate: dayAfter, timeSlot: '10:00 AM - 12:00 PM',
    customerName: 'Priya Nair', phone: '+91 95555 12345',
    items: [{ itemName: 'Buffalo & Grain Mix', quantity: 1, rawMaterials: ['Buffalo Meat 400g', 'Brown Rice 200g'], cookingInstructions: 'Cook thoroughly. Cool before packing.', gpvRatio: 'Adult' }],
    deliveryBoy: 'Suresh Patel', deliveryBoyPhone: '+91 90000 22222',
    address: '88 Marine Drive', landmark: 'Sea facing', city: 'Mumbai', state: 'MH', pincode: '400020',
    status: 'Packed',
    lastUpdated: new Date().toISOString(),
    history: [{ status: 'Packed', timestamp: new Date().toISOString(), updatedBy: 'Packer Ravi' }],
  },
  {
    id: 'KO-1006', orderDate: today, pickupDate: today, timeSlot: '4:00 PM - 6:00 PM',
    customerName: 'Vikram Reddy', phone: '+91 93333 44444',
    items: [{ itemName: 'Complete Nutrition Mix', quantity: 2, rawMaterials: ['Chicken 500g', 'Rice 200g', 'Carrots 100g', 'Pumpkin 100g'], cookingInstructions: 'Balanced portion. Pack hot.', gpvRatio: 'Puppy' }],
    deliveryBoy: 'Mahesh Singh', deliveryBoyPhone: '+91 90000 33333',
    address: '45 Jubilee Hills', landmark: 'Road No. 5', city: 'Hyderabad', state: 'TG', pincode: '500033',
    status: 'Delivered',
    lastUpdated: new Date().toISOString(),
    history: [{ status: 'Delivered', timestamp: new Date().toISOString(), updatedBy: 'Mahesh Singh' }],
  },
  {
    id: 'KO-1007', orderDate: today, pickupDate: today, timeSlot: '8:00 AM - 10:00 AM',
    customerName: 'Anita Desai', phone: '+91 96666 77777',
    items: [{ itemName: 'Senior Dog Soft Meal', quantity: 1, rawMaterials: ['Fish 300g', 'Pumpkin 150g'], cookingInstructions: 'Mash well, easy to chew.', gpvRatio: 'Senior' }],
    deliveryBoy: 'Unassigned', deliveryBoyPhone: '-',
    address: '101 Linking Road', landmark: 'Bandra West', city: 'Mumbai', state: 'MH', pincode: '400050',
    status: 'Cancelled', specialNotes: 'Customer cancelled — refund issued.',
    lastUpdated: new Date().toISOString(),
    history: [{ status: 'Cancelled', timestamp: new Date().toISOString(), updatedBy: 'Customer' }],
  },
  {
    id: 'KO-1008', orderDate: today, pickupDate: tomorrow, timeSlot: '6:00 PM - 8:00 PM',
    customerName: 'Rohan Kapoor', phone: '+91 92222 33333',
    items: [{ itemName: 'Lamb & Vegetable Bowl', quantity: 2, rawMaterials: ['Lamb 600g', 'Mixed Veg 200g'], cookingInstructions: 'Slow simmer 60 min.', gpvRatio: 'Adult' }],
    deliveryBoy: 'Rajesh Kumar', deliveryBoyPhone: '+91 90000 11111',
    address: '22 Banjara Hills', landmark: 'Phase 3', city: 'Hyderabad', state: 'TG', pincode: '500034',
    status: 'Accepted',
    lastUpdated: new Date().toISOString(),
    history: [{ status: 'Accepted', timestamp: new Date().toISOString(), updatedBy: 'Chef Anil' }],
  },
];
