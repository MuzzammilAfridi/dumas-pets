import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { ProductFilters } from "@/components/ProductFilters";
import { ErpProductCard } from "@/components/ErpProductCard";
import { getItems } from "@/lib/erpnext/items";
import type { Allergen, ErpItem, Goal, ItemFilters } from "@/lib/erpnext/types";
import { Search, Loader2 } from "lucide-react";

const ErpShop = () => {
  const [search] = useSearchParams();
  const initial: ItemFilters = useMemo(() => ({
    goals: (search.get("goals")?.split(",").filter(Boolean) as Goal[]) ?? [],
    exclude_allergens: (search.get("allergens")?.split(",").filter(Boolean) as Allergen[]) ?? [],
    pet_type: (search.get("pet_type") as any) ?? undefined,
  }), [search]);

  const [filters, setFilters] = useState<ItemFilters>(initial);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ErpItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getItems({ ...filters, search: query }).then((r) => {
      setItems(r);
      setLoading(false);
    });
  }, [filters, query]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-3">Smart Catalog</h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto">Powered by our ERPNext-connected inventory. Filter by allergens, goals & preferences.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="hidden lg:block"><ProductFilters value={filters} onChange={setFilters} /></aside>
          <div>
            <div className="relative mb-5">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 rounded-xl" />
            </div>
            <div className="lg:hidden mb-5"><ProductFilters value={filters} onChange={setFilters} /></div>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : items.length === 0 ? (
              <p className="text-center text-muted-foreground py-20">No products match these filters. Try resetting.</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">{items.length} products</p>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {items.map((it) => <ErpProductCard key={it.item_code} item={it} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpShop;
