import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { listSubscriptions, updateSubscriptionStatus, deleteSubscription } from "@/lib/erpnext/subscriptions";
import type { Subscription } from "@/lib/erpnext/types";
import { Calendar, Loader2, Pause, Play, Repeat, Trash2 } from "lucide-react";

const MySubscriptions = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    refresh();
  }, [user, authLoading]);

  const refresh = async () => {
    setLoading(true);
    try {
      setSubs(await listSubscriptions());
    } catch (e: any) {
      toast({ title: "Could not load subscriptions", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (s: Subscription) => {
    const next = s.status === "active" ? "paused" : "active";
    await updateSubscriptionStatus(s.id, next);
    toast({ title: next === "paused" ? "Subscription paused" : "Subscription resumed" });
    refresh();
  };

  const remove = async (s: Subscription) => {
    await deleteSubscription(s.id);
    toast({ title: "Subscription cancelled" });
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">My Subscriptions</h1>
            <p className="text-muted-foreground text-sm">Pause, resume or cancel anytime.</p>
          </div>
          <Button onClick={() => navigate("/erp-shop")} variant="outline" className="rounded-xl">Browse catalog</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : subs.length === 0 ? (
          <Card className="rounded-2xl"><CardContent className="py-16 text-center text-muted-foreground">
            <Repeat className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No subscriptions yet.</p>
            <Button onClick={() => navigate("/erp-shop")} className="mt-4 rounded-xl">Find a plan</Button>
          </CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {subs.map((s) => (
              <Card key={s.id} className="rounded-2xl hover:shadow-md transition-all">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold">{s.item_name}</h3>
                      <Badge variant={s.status === "active" ? "default" : "secondary"} className="capitalize">{s.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize mt-1">
                      {s.qty} × ₹{s.unit_price} • {s.frequency}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Next delivery: {new Date(s.next_delivery).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toggle(s)}>
                      {s.status === "active" ? <><Pause className="w-4 h-4 mr-1" />Pause</> : <><Play className="w-4 h-4 mr-1" />Resume</>}
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-xl text-destructive" onClick={() => remove(s)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;
