import { useEffect, useState } from "react";
import { getItems } from "@/lib/erpnext/items";
import type { Allergen, ErpItem, Goal, LifeStage, PetType } from "@/lib/erpnext/types";

export interface PetSignals {
  pet_type: PetType;
  life_stage?: LifeStage;
  allergens: Allergen[];
  goals: Goal[];
  food_preference?: "veg" | "non-veg" | "both";
}

interface Ranked extends ErpItem {
  _score: number;
}

export function useRecommendations(signals: PetSignals | null, limit = 6) {
  const [items, setItems] = useState<Ranked[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!signals) return;
    let cancel = false;
    setLoading(true);
    getItems({
      pet_type: signals.pet_type,
      exclude_allergens: signals.allergens,
      food_preference: signals.food_preference,
      life_stage: signals.life_stage,
      item_group: "PET FOOD",
    }).then((rows) => {
      if (cancel) return;
      const ranked = rows
        .map<Ranked>((it) => {
          let score = 0;
          for (const g of signals.goals) if (it.goals.includes(g)) score += 3;
          if (signals.life_stage && it.life_stage.includes(signals.life_stage)) score += 2;
          if (it.in_stock) score += 1;
          return { ...it, _score: score };
        })
        .sort((a, b) => b._score - a._score)
        .slice(0, limit);
      setItems(ranked);
      setLoading(false);
    });
    return () => {
      cancel = true;
    };
  }, [JSON.stringify(signals), limit]);

  return { items, loading };
}
