import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { getSalesOrdersByCustomer } from "@/services/customerService";

const CustomerManagement = () => {
  const { customers, loading } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerOrders, setCustomerOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

const ITEMS_PER_PAGE = 10;

  console.log("customer in customer management", customers, customerOrders);

  const filteredCustomers = customers.filter((c) =>
    `${c.customer_name} ${c.email} ${c.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(
  filteredCustomers.length / ITEMS_PER_PAGE
);

const paginatedCustomers = filteredCustomers.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="relative">
              {/* Search Icon */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              {/* Input */}
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
               onChange={(e) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1);
}}
                className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {paginatedCustomers.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="font-medium">
                    {c.customer_name}
                  </TableCell>
                  <TableCell>{c.customer_type}</TableCell>
                  <TableCell>{c.gender}</TableCell>
                  <TableCell>
                    {c.creation
                      ? new Date(c.creation).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{c.totalOrders ? c.totalOrders : "0"}</TableCell>
                  <TableCell>₹{c.totalSpent?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        try {
                          setSelectedCustomer(c);

                          const res = await getSalesOrdersByCustomer(
                            c.customer_name,
                          );

                          setCustomerOrders(res.data.data || []);
                        } catch (err) {
                          console.error(err);
                          setCustomerOrders([]);
                        }
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-4 border-t">
  
  <p className="text-sm text-muted-foreground">
    Showing{" "}
    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
    {" - "}
    {Math.min(
      currentPage * ITEMS_PER_PAGE,
      filteredCustomers.length
    )}{" "}
    of {filteredCustomers.length} customers
  </p>

  <div className="flex items-center gap-2">
    
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((p) => p - 1)
      }
    >
      Previous
    </Button>

    <div className="text-sm font-medium px-3">
      {currentPage} / {totalPages}
    </div>

    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage((p) => p + 1)
      }
    >
      Next
    </Button>
  </div>
</div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.customer_name}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* TOP PROFILE CARD */}
              <div className="rounded-2xl border bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedCustomer.customer_name}
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.customer_type || "Customer"}
                    </p>
                  </div>

                  <Badge className="text-sm px-4 py-1">
                    {selectedCustomer.gender || "N/A"}
                  </Badge>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Total Orders</p>

                  <p className="text-2xl font-bold mt-1">
                    {selectedCustomer.totalOrders || 0}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Total Spent</p>

                  <p className="text-2xl font-bold mt-1 text-green-600">
                    ₹{selectedCustomer.totalSpent?.toFixed(2) || "0.00"}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Email</p>

                  <p className="text-sm font-medium mt-1 break-all">
                    {selectedCustomer.email_id || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Phone</p>

                  <p className="text-sm font-medium mt-1">
                    {selectedCustomer.mobile_no || "N/A"}
                  </p>
                </div>
              </div>

              {/* ORDER HISTORY */}
              <div className="rounded-2xl border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Order History</h3>

                  <Badge variant="secondary">
                    {customerOrders.length} Orders
                  </Badge>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {customerOrders.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      No orders found
                    </div>
                  ) : (
                    customerOrders.map((o) => (
                      <div
                        key={o.name}
                        className="rounded-xl border p-4 hover:bg-muted/40 transition-all"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{o.name}</p>

                            <p className="text-xs text-muted-foreground mt-1">
                              {o.transaction_date}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-base">
                              ₹{o.grand_total?.toFixed(2) || "0.00"}
                            </p>

                            <Badge
                              variant={
                                o.status === "Cancelled"
                                  ? "destructive"
                                  : o.status === "Draft"
                                    ? "secondary"
                                    : "default"
                              }
                              className="mt-1"
                            >
                              {o.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
