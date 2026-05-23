// ERPNext-compatible types. Shape mirrors the ERPNext Item doctype + custom fields
// so swapping the mock client for a real REST call requires no consumer changes.

export type LifeStage = "puppy" | "kitten" | "adult" | "senior";
export type PetType = "dog" | "cat" | "both";
export type Goal =
  | "weight_loss"
  | "muscle_gain"
  | "coat_health"
  | "digestion"
  | "energy"
  | "immunity"
  | "joint_support";

export type Allergen = "chicken" | "beef" | "fish" | "grain" | "dairy" | "egg" | "soy";

export interface ErpItem {
  item_code: string;
  item_name: string;
  item_group: "PET FOOD" | "TREATS" | "CAKES";
  description: string;
  standard_rate: number; // INR
  image: string;
  in_stock: boolean;
  // Custom fields
  allergens: Allergen[];
  life_stage: LifeStage[];
  protein_source: string;
  goals: Goal[];
  pet_type: PetType;
  food_preference: "veg" | "non-veg" | "both";
}

export interface ItemFilters {
  item_group?: ErpItem["item_group"];
  pet_type?: PetType;
  food_preference?: "veg" | "non-veg" | "both";
  exclude_allergens?: Allergen[];
  goals?: Goal[];
  life_stage?: LifeStage;
  max_price?: number;
  search?: string;
}

export type SubscriptionFrequency = "weekly" | "biweekly" | "monthly";

export interface Subscription {
  id: string;
  user_id: string;
  pet_id: string | null;
  item_code: string;
  item_name: string;
  qty: number;
  unit_price: number;
  frequency: SubscriptionFrequency;
  next_delivery: string;
  status: "active" | "paused" | "cancelled";
  created_at: string;
}
