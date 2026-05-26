// Mock BOM (Bill of Materials) and Inventory data for Store Requisition

export interface BomItem {
  materialName: string;
  unit: string;
  qtyPerProduct: number;
}

export interface InventoryItem {
  materialName: string;
  unit: string;
  availableStock: number;
}

// Keyed by product name (matches mockOrders item names)
export const productBom: Record<string, BomItem[]> = {
  'Premium Chicken & Rice': [
    { materialName: 'Chicken', unit: 'gm', qtyPerProduct: 250 },
    { materialName: 'Rice', unit: 'gm', qtyPerProduct: 150 },
    { materialName: 'Carrot', unit: 'gm', qtyPerProduct: 50 },
    { materialName: 'Packaging Pouch', unit: 'pcs', qtyPerProduct: 1 },
  ],
  'Crunchy Chicken Bites': [
    { materialName: 'Chicken', unit: 'gm', qtyPerProduct: 100 },
    { materialName: 'Flour', unit: 'gm', qtyPerProduct: 50 },
    { materialName: 'Packaging Pouch', unit: 'pcs', qtyPerProduct: 1 },
  ],
  'Birthday Celebration Cake': [
    { materialName: 'Flour', unit: 'gm', qtyPerProduct: 300 },
    { materialName: 'Yogurt', unit: 'gm', qtyPerProduct: 150 },
    { materialName: 'Carrot', unit: 'gm', qtyPerProduct: 80 },
    { materialName: 'Cake Box', unit: 'pcs', qtyPerProduct: 1 },
  ],
  'Grain-Free Chicken': [
    { materialName: 'Chicken', unit: 'gm', qtyPerProduct: 300 },
    { materialName: 'Sweet Potato', unit: 'gm', qtyPerProduct: 120 },
    { materialName: 'Packaging Pouch', unit: 'pcs', qtyPerProduct: 1 },
  ],
  'Peanut Butter Bones': [
    { materialName: 'Peanut Butter', unit: 'gm', qtyPerProduct: 80 },
    { materialName: 'Flour', unit: 'gm', qtyPerProduct: 60 },
    { materialName: 'Packaging Pouch', unit: 'pcs', qtyPerProduct: 1 },
  ],
  'Dental Chew Sticks': [
    { materialName: 'Flour', unit: 'gm', qtyPerProduct: 70 },
    { materialName: 'Mint', unit: 'gm', qtyPerProduct: 10 },
    { materialName: 'Packaging Pouch', unit: 'pcs', qtyPerProduct: 1 },
  ],
  'Buffalo & Grain Mix': [
    { materialName: 'Buffalo Meat', unit: 'gm', qtyPerProduct: 280 },
    { materialName: 'Rice', unit: 'gm', qtyPerProduct: 120 },
    { materialName: 'Packaging Pouch', unit: 'pcs', qtyPerProduct: 1 },
  ],
  'Complete Nutrition Mix': [
    { materialName: 'Chicken', unit: 'gm', qtyPerProduct: 150 },
    { materialName: 'Rice', unit: 'gm', qtyPerProduct: 100 },
    { materialName: 'Carrot', unit: 'gm', qtyPerProduct: 60 },
    { materialName: 'Sweet Potato', unit: 'gm', qtyPerProduct: 60 },
    { materialName: 'Packaging Pouch', unit: 'pcs', qtyPerProduct: 1 },
  ],
};

export const mockInventory: InventoryItem[] = [
  { materialName: 'Chicken', unit: 'gm', availableStock: 1500 },
  { materialName: 'Rice', unit: 'gm', availableStock: 2000 },
  { materialName: 'Carrot', unit: 'gm', availableStock: 400 },
  { materialName: 'Sweet Potato', unit: 'gm', availableStock: 300 },
  { materialName: 'Flour', unit: 'gm', availableStock: 800 },
  { materialName: 'Yogurt', unit: 'gm', availableStock: 200 },
  { materialName: 'Peanut Butter', unit: 'gm', availableStock: 150 },
  { materialName: 'Mint', unit: 'gm', availableStock: 50 },
  { materialName: 'Buffalo Meat', unit: 'gm', availableStock: 200 },
  { materialName: 'Packaging Pouch', unit: 'pcs', availableStock: 25 },
  { materialName: 'Cake Box', unit: 'pcs', availableStock: 10 },
];
