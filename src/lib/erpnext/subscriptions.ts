import { supabase } from "@/integrations/supabase/client";
import type { ErpItem, Subscription, SubscriptionFrequency } from "./types";

function nextDeliveryFor(freq: SubscriptionFrequency): string {
  const d = new Date();
  d.setDate(d.getDate() + (freq === "weekly" ? 7 : freq === "biweekly" ? 14 : 30));
  return d.toISOString().slice(0, 10);
}

export async function createSubscription(args: {
  item: ErpItem;
  pet_id: string | null;
  qty: number;
  frequency: SubscriptionFrequency;
}) {
  const { data: session } = await supabase.auth.getSession();
  const user = session.session?.user;
  if (!user) throw new Error("Please sign in to start a subscription.");

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      pet_id: args.pet_id,
      item_code: args.item.item_code,
      item_name: args.item.item_name,
      qty: args.qty,
      unit_price: args.item.standard_rate,
      frequency: args.frequency,
      next_delivery: nextDeliveryFor(args.frequency),
      status: "active",
    })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Subscription;
}

export async function listSubscriptions(): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Subscription[];
}

export async function updateSubscriptionStatus(
  id: string,
  status: Subscription["status"],
) {
  const { error } = await supabase.from("subscriptions").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteSubscription(id: string) {
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  if (error) throw error;
}
