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

const CustomerManagement = () => {
  const { customers, loading } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const customerOrders = selectedCustomer
    ? customers.filter((o) => o.customerId === selectedCustomer.id)
    : [];

    console.log("customer in customer management", customers, customerOrders);
    

const filteredCustomers = customers.filter((c) =>
  `${c.customer_name} ${c.email} ${c.phone}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
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
      onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredCustomers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.customer_name}
                  </TableCell>
                  <TableCell>{c.customer_type}</TableCell>
                  <TableCell>{c.gender}</TableCell>
                  <TableCell>
                    {c.joinDate
                      ? new Date(c.joinDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{c.totalOrders ? c.totalOrders : "0"}</TableCell>
                  <TableCell>
                    ₹{c.totalSpent ? c.totalSpent.toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCustomer(c)}
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
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {selectedCustomer.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {selectedCustomer.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Joined:</span>{" "}
                  {selectedCustomer.joinDate
                    ? new Date(selectedCustomer.joinDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Total Spent:</span> ₹
                  {selectedCustomer.totalSpent
                    ? selectedCustomer.totalSpent.toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">
                  Order History ({customerOrders.length})
                </p>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No orders yet.
                  </p>
                ) : (
                  customerOrders.map((o) => (
                    <div
                      key={o.id}
                      className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">{o.id}</p>
                        <p className="text-muted-foreground text-xs">
                          {o.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>₹{o.total ? o.total.toFixed(2) : "0.00"}</span>
                        <Badge variant="outline">{o.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
