import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { mockCustomers, mockOrders } from '@/data/mockData';

const CustomerManagement = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  const customerOrders = selectedCustomer ? mockOrders.filter(o => o.customerId === selectedCustomer.id) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.joinDate}</TableCell>
                  <TableCell>{c.totalOrders}</TableCell>
                  <TableCell>₹{c.totalSpent.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(c)}><Eye className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedCustomer?.name}</DialogTitle></DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-muted-foreground">Email:</span> {selectedCustomer.email}</p>
                <p><span className="text-muted-foreground">Phone:</span> {selectedCustomer.phone}</p>
                <p><span className="text-muted-foreground">Joined:</span> {selectedCustomer.joinDate}</p>
                <p><span className="text-muted-foreground">Total Spent:</span> ₹{selectedCustomer.totalSpent.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Order History ({customerOrders.length})</p>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                ) : customerOrders.map(o => (
                  <div key={o.id} className="flex justify-between items-center text-sm py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{o.id}</p>
                      <p className="text-muted-foreground text-xs">{o.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>${o.total.toFixed(2)}</span>
                      <Badge variant="outline">{o.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
