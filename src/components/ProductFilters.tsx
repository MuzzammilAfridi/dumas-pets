import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { Allergen, Goal, ItemFilters, PetType } from "@/lib/erpnext/types";

const ALLERGENS: Allergen[] = ["chicken", "beef", "fish", "grain", "dairy", "egg", "soy"];
const GOALS: Goal[] = ["weight_loss", "muscle_gain", "coat_health", "digestion", "energy", "immunity", "joint_support"];

interface Props {
  value: ItemFilters;
  onChange: (next: ItemFilters) => void;
}

export const ProductFilters = ({ value, onChange }: Props) => {
  const toggleAllergen = (a: Allergen) => {
    const cur = value.exclude_allergens ?? [];
    onChange({ ...value, exclude_allergens: cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a] });
  };
  const toggleGoal = (g: Goal) => {
    const cur = value.goals ?? [];
    onChange({ ...value, goals: cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g] });
  };

  return (
    <Card className="rounded-2xl sticky top-24">
      <CardContent className="p-5 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={() => onChange({})}>Reset</Button>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold">Pet type</Label>
          <RadioGroup value={value.pet_type ?? "both"} onValueChange={(v) => onChange({ ...value, pet_type: v as PetType })} className="flex gap-2">
            {(["both", "dog", "cat"] as PetType[]).map((p) => (
              <Label key={p} className={`flex-1 border rounded-xl p-2 text-center text-sm cursor-pointer capitalize ${value.pet_type === p || (!value.pet_type && p === "both") ? "border-primary bg-primary/5" : ""}`}>
                <RadioGroupItem value={p} className="sr-only" />{p}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold">Food preference</Label>
          <RadioGroup value={value.food_preference ?? "both"} onValueChange={(v) => onChange({ ...value, food_preference: v as any })} className="flex gap-2">
            {(["both", "veg", "non-veg"] as const).map((p) => (
              <Label key={p} className={`flex-1 border rounded-xl p-2 text-center text-sm cursor-pointer ${(value.food_preference ?? "both") === p ? "border-primary bg-primary/5" : ""}`}>
                <RadioGroupItem value={p} className="sr-only" />{p}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold">Exclude allergens</Label>
          <div className="grid grid-cols-2 gap-2">
            {ALLERGENS.map((a) => (
              <Label key={a} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                <Checkbox checked={(value.exclude_allergens ?? []).includes(a)} onCheckedChange={() => toggleAllergen(a)} />
                {a}
              </Label>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold">Nutrition goals</Label>
          <div className="space-y-1">
            {GOALS.map((g) => (
              <Label key={g} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                <Checkbox checked={(value.goals ?? []).includes(g)} onCheckedChange={() => toggleGoal(g)} />
                {g.replace("_", " ")}
              </Label>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-semibold">Max price: ₹{value.max_price ?? 1000}</Label>
          <Slider value={[value.max_price ?? 1000]} min={200} max={1500} step={50} onValueChange={(v) => onChange({ ...value, max_price: v[0] })} />
        </div>
      </CardContent>
    </Card>
  );
};
