
## Goal
Layer an ERPNext-compatible product/subscription system on top of the existing Dumas 'N' Bismi app. Mock data now, swap to real ERPNext later by changing one client module.

## Architecture

```
src/
  lib/erpnext/
    client.ts        ← single fetch wrapper (mock | real toggle via env)
    items.ts         ← getItems({filters}) → ERPNext Item shape
    subscriptions.ts ← create/list/cancel subscriptions
    types.ts         ← ERPNext Item, Subscription, Customer types
  data/
    erpnextMock.ts   ← mock Items with custom fields: allergens[], life_stage,
                       protein_source, goals[], price_inr, image, stock
  hooks/
    useRecommendations.ts ← filters items by pet profile + wizard answers
```

When the user later supplies an ERPNext URL + key, only `client.ts` changes (swap mock for `fetch(${ERPNEXT_URL}/api/resource/Item?filters=...)` through an edge function proxy).

## Data model (ERPNext-shaped)

**Item** (mock, mirrors ERPNext Item doctype + custom fields):
- `item_code`, `item_name`, `item_group` (PET FOOD/TREATS/CAKES)
- `standard_rate` (₹), `image`, `description`
- Custom: `allergens: string[]`, `life_stage`, `protein_source`,
  `goals: string[]` (weight_loss, muscle, coat, digestion, energy),
  `pet_type: 'dog'|'cat'|'both'`

**Subscription** (Lovable Cloud table, ERPNext Subscription-compatible fields):
- `id`, `user_id`, `pet_id`, `item_code`, `qty`, `frequency`
  ('weekly'|'biweekly'|'monthly'), `next_delivery`, `status`, `created_at`

**Pet profile** (Cloud table, replaces current localStorage mockPets):
- `id`, `user_id`, `name`, `type`, `breed`, `age`, `weight`,
  `allergens[]`, `goals[]`, `food_preference`, `activity_level`

## Phase plan (all in one ship)

1. **Enable Lovable Cloud** + email/Google auth. Migrate current `AuthContext` mock login to Supabase auth (keep `admin/admin` + sarah demo by seeding).
2. **DB migration**: `pets`, `subscriptions` tables with RLS (user owns their rows). `profiles` + `user_roles` table for admin gating.
3. **ERPNext mock client** (`src/lib/erpnext/`) returning ~15 items with the custom fields above.
4. **Recommendation engine** (`useRecommendations`): excludes items containing any pet allergen, ranks by goal/life_stage/protein match, returns top N.
5. **Wizard upgrade**: extend existing `NutritionPlan.tsx` final step to:
   - Save pet profile to Cloud (if logged in) or prompt login.
   - Call `useRecommendations` → show real product cards (price ₹, Add to Cart, Subscribe).
6. **Subscription flow**: "Subscribe" on a product opens dialog (frequency + start date) → inserts row into `subscriptions`. Customer dashboard gets a new **My Subscriptions** page (list, pause, cancel).
7. **Product listing filters**: extend `/shop` and category pages with sidebar filters bound to ERPNext custom fields (allergens, goals, food preference, pet type, price range). Existing `products.ts` is replaced/aliased by `erpnext/items.ts`.
8. **Responsive QA**: reuse existing rounded-2xl / orange theme; mobile filter drawer.

## Out of scope (call out explicitly)
- Real ERPNext network calls — stub returns mock; swap later.
- Payment provider — subscriptions are records only; checkout still uses existing Cart flow.
- Admin CRUD for ERPNext items — admin still edits local catalog; real ERPNext would manage this.

## Risk / size
Large change (~10–12 files new, ~6 edited, 1 migration). Existing wizard, cart, customer dashboard, and auth all touched. Worth confirming before I start.
