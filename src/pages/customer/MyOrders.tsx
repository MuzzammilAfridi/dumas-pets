import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Package, RefreshCw, Eye } from "lucide-react";

import { useOrders } from "@/hooks/useOrders";

const statusSteps = ["Pending", "Processing", "Delivered"];

const MyOrders = () => {
  const { orders, loading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { toast } = useToast();


  console.log("orders in my order", orders);
  

  // ERP Sales Orders → UI Order History Format
 const formattedOrders = orders.map((o: any) => ({
  id: o.name,
  date: o.transaction_date,
  total: o.grand_total || 0,

  status:
    o.status === "Completed"
      ? "Delivered"
      : o.status === "To Deliver and Bill"
      ? "Processing"
      : o.status || "Pending",

  items:
    o.items?.map((item: any) => ({
      name: item.item_name || item.item_code,
      itemCode: item.item_code,
      quantity: item.qty,
      price: item.rate || 0,
      image: item.image
        ? `https://dumas.frappe.cloud${item.image}`
        : "/placeholder.png",
      category: item.item_group || "",
      deliveryDate: item.delivery_date || "",
    })) || [],

  // Address
  address:
    o.customer_address ||
    o.shipping_address_name ||
    "Address not available",

  // Customization Fields
  custom_meat_type: o.custom_meat_type || "",
  custom_grain_type: o.custom_grain_type || "",
  custom_grain_percentage:
    o.custom_grain_percentage || 0,
  custom_gpv_ratio: o.custom_gpv_ratio || "",
  custom_vegetables: o.custom_vegetables || "",
  custom_preparation_instructions:
    o.custom_preparation_instructions || "",
  custom_free_soup: o.custom_free_soup || 0,
  custom_extra_soup: o.custom_extra_soup || 0,

  // Delivery Fields
  custom_purchase_type:
    o.custom_purchase_type || "",
  delivery_date: o.delivery_date || "",
  custom_delivery_time_slot:
    o.custom_delivery_time_slot || "",
  custom_delivery_days:
    o.custom_delivery_days || "",

  // Payment + Status Fields
  billing_status: o.billing_status || "",
  delivery_status: o.delivery_status || "",
  payment_due:
    o.payment_schedule?.[0]?.outstanding || 0,
  paid_amount:
    o.payment_schedule?.[0]?.paid_amount || 0,
  due_date:
    o.payment_schedule?.[0]?.due_date || "",
}));

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Loading order history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">
        My Order History
      </h2>

      {formattedOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        formattedOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-foreground">
                    {order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.date} • {order.items.length} items
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{order.status}</Badge>
                  <span className="font-bold">
                    ₹{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Progress */}
              {order.status !== "Cancelled" && (
                <div className="mt-4 flex items-center gap-1">
                  {statusSteps.map((step, i) => {
                    const currentIdx =
                      statusSteps.indexOf(order.status);
                    const done = i <= currentIdx;

                    return (
                      <div
                        key={step}
                        className="flex-1 flex items-center gap-1"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            done
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </div>

                        <span
                          className={`text-xs ${
                            done
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step}
                        </span>

                        {i < statusSteps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 ${
                              done ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Buttons */}
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Details
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Re-ordered!",
                      description: `Items from ${order.id} added to cart.`,
                    })
                  }
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Re-order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Details Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
       <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden">
  <div className="p-6 border-b bg-muted/30">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">
        Order Details
      </DialogTitle>
      <p className="text-sm text-muted-foreground mt-1">
        {selectedOrder?.id}
      </p>
    </DialogHeader>
  </div>

  {selectedOrder && (
    <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">

      {/* Top Summary */}
      <Card className="p-5 rounded-2xl shadow-sm">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Order Date</p>
            <p className="font-semibold">{selectedOrder.date}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge className="mt-1">
              {selectedOrder.status}
            </Badge>
          </div>

          <div className="md:col-span-2">
            <p className="text-muted-foreground">Delivery Address</p>
            <p className="font-medium">
              {selectedOrder.address || "Address not available"}
            </p>
          </div>
        </div>
      </Card>

      {/* Ordered Items */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">
          Ordered Items
        </h3>

        {selectedOrder.items.map((item: any, i: number) => (
          <Card
            key={i}
            className="p-4 rounded-xl shadow-sm"
          >
            <div className="flex gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover border"
              />

              <div className="flex-1">
                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>

                <p className="text-sm text-muted-foreground">
                  Delivery: {item.deliveryDate || "-"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary">
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Customization + Delivery */}
      <div className="grid md:grid-cols-2 gap-4">

        <Card className="p-5 rounded-2xl">
          <h3 className="font-bold mb-3">
            Pet Food Customization
          </h3>

          <div className="space-y-2 text-sm">
            <p><strong>Meat:</strong> {selectedOrder.custom_meat_type || "-"}</p>
            <p><strong>Grain:</strong> {selectedOrder.custom_grain_type || "-"}</p>
            <p><strong>Grain %:</strong> {selectedOrder.custom_grain_percentage || 0}%</p>
            <p><strong>Vegetables:</strong> {selectedOrder.custom_vegetables || "-"}</p>
            <p><strong>Free Soup:</strong> {selectedOrder.custom_free_soup || 0}</p>
            <p><strong>Extra Soup:</strong> {selectedOrder.custom_extra_soup || 0}</p>
          </div>
        </Card>

        <Card className="p-5 rounded-2xl">
          <h3 className="font-bold mb-3">
            Delivery Details
          </h3>

          <div className="space-y-2 text-sm">
            <p><strong>Purchase Type:</strong> {selectedOrder.custom_purchase_type || "-"}</p>
            <p><strong>Delivery Date:</strong> {selectedOrder.delivery_date || "-"}</p>
            <p><strong>Time Slot:</strong> {selectedOrder.custom_delivery_time_slot || "-"}</p>
            <p><strong>Billing Status:</strong> {selectedOrder.billing_status || "-"}</p>
            <p><strong>Delivery Status:</strong> {selectedOrder.delivery_status || "-"}</p>
          </div>
        </Card>
      </div>

      {/* Payment Summary */}
      <Card className="p-5 rounded-2xl border-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">
              Grand Total
            </p>
            <p className="text-2xl font-bold text-primary">
              ₹{Number(selectedOrder.total).toFixed(2)}
            </p>
          </div>

          <Badge variant="outline" className="text-sm px-4 py-2">
            Paid: ₹{Number(selectedOrder.paid_amount || 0).toFixed(2)}
          </Badge>
        </div>
      </Card>

    </div>
  )}
</DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;