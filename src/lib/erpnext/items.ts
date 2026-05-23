// ERPNext Item client — currently mock. To switch to live ERPNext:
//   replace `MOCK_ITEMS` lookup with `fetch(`${ERPNEXT_URL}/api/resource/Item?filters=${...}`,
//     { headers: { Authorization: `token ${KEY}:${SECRET}` } })` inside an edge function proxy.

import buffaloMeal from "@/assets/buffalo-meal.webp";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import type { ErpItem, ItemFilters } from "./types";

export const MOCK_ITEMS: ErpItem[] = [
  {
    item_code: "PF-CHK-001",
    item_name: "Premium Chicken & Rice",
    item_group: "PET FOOD",
    description: "Protein-rich chicken with brown rice for active adult dogs.",
    standard_rate: 749,
    image: product1,
    in_stock: true,
    allergens: ["chicken", "grain"],
    life_stage: ["adult"],
    protein_source: "chicken",
    goals: ["muscle_gain", "energy"],
    pet_type: "dog",
    food_preference: "non-veg",
  },
  {
    item_code: "PF-BUF-002",
    item_name: "Buffalo & Millet Bowl",
    item_group: "PET FOOD",
    description: "Lean buffalo with grain-free millet — great for sensitive tummies.",
    standard_rate: 849,
    image: buffaloMeal,
    in_stock: true,
    allergens: ["beef"],
    life_stage: ["adult", "senior"],
    protein_source: "buffalo",
    goals: ["digestion", "muscle_gain"],
    pet_type: "dog",
    food_preference: "non-veg",
  },
  {
    item_code: "PF-FISH-003",
    item_name: "Fish & Sweet Potato",
    item_group: "PET FOOD",
    description: "Omega-3 rich fish for a shiny coat and healthy joints.",
    standard_rate: 899,
    image: product1,
    in_stock: true,
    allergens: ["fish"],
    life_stage: ["adult", "senior"],
    protein_source: "fish",
    goals: ["coat_health", "joint_support", "immunity"],
    pet_type: "both",
    food_preference: "non-veg",
  },
  {
    item_code: "PF-VEG-004",
    item_name: "Veggie Wholesome Mix",
    item_group: "PET FOOD",
    description: "Plant-based blend of lentils, pumpkin and quinoa.",
    standard_rate: 649,
    image: product3,
    in_stock: true,
    allergens: [],
    life_stage: ["adult", "puppy"],
    protein_source: "lentil",
    goals: ["digestion", "weight_loss"],
    pet_type: "dog",
    food_preference: "veg",
  },
  {
    item_code: "PF-PUP-005",
    item_name: "Puppy Growth Formula",
    item_group: "PET FOOD",
    description: "Calorie-dense chicken & egg for growing puppies.",
    standard_rate: 799,
    image: product1,
    in_stock: true,
    allergens: ["chicken", "egg"],
    life_stage: ["puppy"],
    protein_source: "chicken",
    goals: ["muscle_gain", "energy", "immunity"],
    pet_type: "dog",
    food_preference: "non-veg",
  },
  {
    item_code: "PF-SEN-006",
    item_name: "Senior Joint Care",
    item_group: "PET FOOD",
    description: "Low-fat mutton with glucosamine for older pets.",
    standard_rate: 949,
    image: buffaloMeal,
    in_stock: true,
    allergens: [],
    life_stage: ["senior"],
    protein_source: "mutton",
    goals: ["joint_support", "weight_loss"],
    pet_type: "dog",
    food_preference: "non-veg",
  },
  {
    item_code: "PF-CAT-007",
    item_name: "Cat Salmon Delight",
    item_group: "PET FOOD",
    description: "Wild-caught salmon recipe for cats of all ages.",
    standard_rate: 699,
    image: product2,
    in_stock: true,
    allergens: ["fish"],
    life_stage: ["adult", "kitten", "senior"],
    protein_source: "salmon",
    goals: ["coat_health", "immunity"],
    pet_type: "cat",
    food_preference: "non-veg",
  },
  {
    item_code: "TR-CHK-101",
    item_name: "Crunchy Chicken Bites",
    item_group: "TREATS",
    description: "Training treats baked with real chicken.",
    standard_rate: 299,
    image: product2,
    in_stock: true,
    allergens: ["chicken"],
    life_stage: ["adult", "puppy"],
    protein_source: "chicken",
    goals: ["energy"],
    pet_type: "dog",
    food_preference: "non-veg",
  },
  {
    item_code: "TR-VEG-102",
    item_name: "Sweet Potato Chews",
    item_group: "TREATS",
    description: "Single-ingredient veg treats.",
    standard_rate: 249,
    image: product3,
    in_stock: true,
    allergens: [],
    life_stage: ["adult", "puppy", "senior"],
    protein_source: "none",
    goals: ["digestion", "weight_loss"],
    pet_type: "both",
    food_preference: "veg",
  },
  {
    item_code: "CK-BDAY-201",
    item_name: "Birthday Pupcake",
    item_group: "CAKES",
    description: "Banana & peanut butter cake for celebrations.",
    standard_rate: 599,
    image: product3,
    in_stock: true,
    allergens: [],
    life_stage: ["adult"],
    protein_source: "none",
    goals: [],
    pet_type: "dog",
    food_preference: "veg",
  },
];

/** ERPNext-style filter. Mirrors `/api/resource/Item?filters=[...]`. */
export async function getItems(filters: ItemFilters = {}): Promise<ErpItem[]> {
  await new Promise((r) => setTimeout(r, 120)); // simulate latency

  return MOCK_ITEMS.filter((item) => {
    if (filters.item_group && item.item_group !== filters.item_group) return false;
    if (filters.pet_type && item.pet_type !== filters.pet_type && item.pet_type !== "both") return false;
    if (
      filters.food_preference &&
      filters.food_preference !== "both" &&
      item.food_preference !== filters.food_preference &&
      item.food_preference !== "both"
    )
      return false;
    if (filters.exclude_allergens?.length) {
      if (item.allergens.some((a) => filters.exclude_allergens!.includes(a))) return false;
    }
    if (filters.life_stage && !item.life_stage.includes(filters.life_stage)) return false;
    if (filters.max_price !== undefined && item.standard_rate > filters.max_price) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!item.item_name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q))
        return false;
    }
    return true;
  });
}

export async function getItem(item_code: string): Promise<ErpItem | undefined> {
  await new Promise((r) => setTimeout(r, 80));
  return MOCK_ITEMS.find((i) => i.item_code === item_code);
}
