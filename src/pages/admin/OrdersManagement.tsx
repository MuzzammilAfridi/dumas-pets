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
import { Eye, Loader2 } from "lucide-react";
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
  markOrderAsDelivered,
  getAddress,
} from "@/services/salesOrderService";
import { useToast } from "@/hooks/use-toast";

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

  if (order.status === "To Deliver" || order.status === "To Deliver and Bill")
    return "Processing";

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

  const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 10;

  const findInvoiceForOrder = async (orderId: string) => {
    const res = await getInvoices();

    const invoices = res.data.data;

    for (const inv of invoices) {
      // check inside items
      const match = inv.items?.find((item) => item.sales_order === orderId);

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

const totalPages = Math.ceil(filtered.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const paginatedOrders = filtered.slice(startIndex, endIndex);
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
        description: err?.response?.data?.exception || "Failed to update order",
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
        rawStatus: o.status, // optional (debugging)
        docstatus: o.docstatus, // optional (debugging)
      }));

      setOrders(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
  value={filter}
  onValueChange={(value) => {
    setFilter(value);
    setCurrentPage(1);
  }}
>
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
            {paginatedOrders.map((order) => (
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
                      disabled={updatingId === order.id}
                      onValueChange={(v) =>
                        updateStatus(order.id, v as Order["status"])
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        {updatingId === order.id ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Updating
                          </div>
                        ) : (
                          <SelectValue />
                        )}
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

                        const addressRes = await getAddress(o.customer_address);
                        const addr = addressRes.data.data;

                        setSelectedOrder({
                          id: o.name,
                          customerName: o.customer,
                          date: o.transaction_date,
                          total: o.grand_total,
                          status: o.status,
                          address: [
                            addr.address_line1,
                            addr.address_line2,
                            addr.city,
                            addr.state,
                            addr.pincode,
                          ]
                            .filter(Boolean)
                            .join(", "),
                          phone: addr.phone,
                          email: addr.email_id,
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
      {filtered.length > itemsPerPage && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
    <p className="text-sm text-muted-foreground">
      Showing{" "}
      {filtered.length === 0 ? 0 : startIndex + 1}-
      {Math.min(endIndex, filtered.length)} of {filtered.length} orders
    </p>

    <div className="flex items-center gap-2 flex-wrap justify-center">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Previous
      </Button>

      <div className="flex items-center gap-1 flex-wrap justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            size="sm"
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Next
      </Button>
    </div>
  </div>
)}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* TOP SUMMARY */}
              <div className="flex flex-wrap items-center justify-between gap-3 border rounded-lg p-4 bg-muted/30">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-semibold">{selectedOrder.id}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>

                  <Badge variant={statusColor(selectedOrder.status) as any}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>

                  <p className="font-bold text-lg">
                    ₹{selectedOrder.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* CUSTOMER DETAILS */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base">Customer Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer Name</p>

                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>

                  {selectedOrder.phone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>

                      <p className="font-medium">📞 {selectedOrder.phone}</p>
                    </div>
                  )}

                  {selectedOrder.email && (
                    <div>
                      <p className="text-muted-foreground">Email</p>

                      <p className="font-medium break-all">
                        ✉️ {selectedOrder.email}
                      </p>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Delivery Address</p>

                    <p className="font-medium leading-6 mt-1">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base">Order Items</h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border rounded-lg p-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{item.item_name}</p>

                        <p className="text-xs text-muted-foreground">
                          Qty: {item.qty}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          ₹{item.rate} each
                        </p>
                      </div>

                      <div className="font-semibold text-sm">
                        ₹{(item.rate * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL SUMMARY */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>

                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>

                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
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
