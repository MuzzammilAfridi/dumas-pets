import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { createSubscription } from "@/lib/erpnext/subscriptions";
import type { ErpItem, SubscriptionFrequency } from "@/lib/erpnext/types";
import { Loader2, Repeat } from "lucide-react";

export const SubscribeDialog = ({ item, trigger }: { item: ErpItem; trigger?: React.ReactNode }) => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [freq, setFreq] = useState<SubscriptionFrequency>("monthly");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Create a free account to subscribe." });
      navigate("/auth");
      return;
    }
    setBusy(true);
    try {
      await createSubscription({ item, pet_id: null, qty, frequency: freq });
      toast({ title: "Subscription created", description: `${item.item_name} • ${freq}` });
      setOpen(false);
      navigate("/dashboard/subscriptions");
    } catch (e: any) {
      toast({ title: "Could not subscribe", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const discount = freq === "monthly" ? 0 : freq === "biweekly" ? 5 : 10;
  const total = item.standard_rate * qty * (1 - discount / 100);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button variant="secondary" className="rounded-xl"><Repeat className="w-4 h-4 mr-2" />Subscribe</Button>}</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader><DialogTitle>Subscribe to {item.item_name}</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Quantity</Label>
              <Input type="number" min={1} max={10} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} />
            </div>
            <div>
              <Label>Unit price</Label>
              <Input value={`₹${item.standard_rate}`} disabled />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Delivery frequency</Label>
            <RadioGroup value={freq} onValueChange={(v) => setFreq(v as SubscriptionFrequency)} className="grid grid-cols-3 gap-2">
              {[
                { v: "weekly", label: "Weekly", off: "10% off" },
                { v: "biweekly", label: "Bi-weekly", off: "5% off" },
                { v: "monthly", label: "Monthly", off: "Standard" },
              ].map((o) => (
                <Label key={o.v} className={`border rounded-xl p-3 cursor-pointer text-center transition-all ${freq === o.v ? "border-primary bg-primary/5" : ""}`}>
                  <RadioGroupItem value={o.v} className="sr-only" />
                  <div className="font-semibold text-sm">{o.label}</div>
                  <div className="text-xs text-muted-foreground">{o.off}</div>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 flex justify-between font-semibold">
            <span>Per delivery</span><span className="text-primary">₹{total.toFixed(0)}</span>
          </div>
          <Button onClick={submit} disabled={busy} className="w-full rounded-xl">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm subscription"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
