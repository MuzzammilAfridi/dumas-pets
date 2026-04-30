import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import {
  getAllSalesOrdersAdmin,
  getSalesOrder,
  submitOrder,
  cancelOrder,
  cancelInvoice,
  getInvoiceBySalesOrder,
  getInvoices,
  getInvoiceFromOrder,
  cancelOrderWithDependencies,
  markOrderAsDelivered
} from "@/services/salesOrderService";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";
import axios from "axios";

const statusColor = (s: string) => {
  switch (s) {
    case "Delivered":
      return "default";
    case "Processing":
      return "secondary";
    case "Pending":
      return "outline";
    default:
      return "destructive";
  }
};

const mapERPStatus = (order) => {
  if (order.docstatus === 0) return "Pending";
  if (order.docstatus === 2) return "Cancelled";

  // ✅ NEW: detect delivered via billing %
  if (order.per_billed === 100) return "Delivered";

  if (
    order.status === "To Deliver" ||
    order.status === "To Deliver and Bill"
  ) return "Processing";

  return "Processing";
};

const mapStatus = (status, docstatus) => {
  if (docstatus === 0) return "Pending";
  if (docstatus === 2) return "Cancelled";

  if (status === "Completed") return "Delivered";

  return "Processing";
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const findInvoiceForOrder = async (orderId: string) => {
  const res = await getInvoices();

  const invoices = res.data.data;

  for (const inv of invoices) {
    // check inside items
    const match = inv.items?.find(
      (item) => item.sales_order === orderId
    );

    if (match) {
      return inv.name;
    }
  }

  return null;
};

const getExistingInvoiceId = async (orderId) => {
  try {
    const res = await getInvoiceFromOrder(orderId);

    const doc = res?.data?.message;

    // If already invoiced → ERP attaches reference
    if (doc?.items?.length) {
      return doc.items[0].sales_invoice || null;
    }

    return null;
  } catch (err) {
    console.log("Invoice lookup failed, fallback needed");
    return null;
  }
};

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

const updateStatus = async (id: string, status: string) => {
  setUpdatingId(id);

  try {
    // ✅ PROCESSING = submit order (only if draft)
    if (status === "Processing") {
      const res = await getSalesOrder(id);
      const order = res.data.data;

      if (order.docstatus === 0) {
        await submitOrder(id);
      }
    }

    // ✅ DELIVERED = create invoice (REAL ERP ACTION)
    if (status === "Delivered") {
      await markOrderAsDelivered(id);
    }

    // ✅ CANCELLED
    if (status === "Cancelled") {
      await cancelOrderWithDependencies(id);
    }

    fetchOrders();

    toast({
      title: "Updated",
      description: `Order ${id} updated`,
    });

  } catch (err: any) {
    toast({
      title: "Error",
      description:
        err?.response?.data?.exception ||
        "Failed to update order",
      variant: "destructive",
    });
  } finally {
    setUpdatingId(null);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllSalesOrdersAdmin();

      console.log("ADMIN ORDERS:", res.data.data);

     const formatted = res.data.data.map((o: any) => ({
  id: o.name,
  customerName: o.customer,
  date: o.transaction_date,
  total: o.grand_total || 0,
  status: mapERPStatus(o), // ✅ FIX
  rawStatus: o.status,     // optional (debugging)
  docstatus: o.docstatus,  // optional (debugging)
}));

      setOrders(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Update</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor(order.status) as any}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(v) =>
                        updateStatus(order.id, v as Order["status"])
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                     onClick={async () => {
  const res = await getSalesOrder(order.id);
  const o = res.data.data;

  setSelectedOrder({
    id: o.name,
    customerName: o.customer,
    date: o.transaction_date,
    total: o.grand_total,
    status: o.status,
    address: o.customer_address,
    items: o.items,
  });
}}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Customer:</span>{" "}
                  {selectedOrder.customerName}
                </p>
                <p>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  {selectedOrder.date}
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  {selectedOrder.status}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {selectedOrder.address}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm py-1 border-b border-border last:border-0"
                  >
                    <span>
  {item.item_name} × {item.qty}
</span>
<span>
  ₹{(item.rate * item.qty).toFixed(2)}
</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm pt-2">
                  <span>Total</span>
                  <span>₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
