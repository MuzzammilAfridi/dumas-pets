import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockOrders, Order } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';

const statusColor = (s: string) => {
  switch (s) { case 'Delivered': return 'default'; case 'Processing': return 'secondary'; case 'Pending': return 'outline'; default: return 'destructive'; }
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast({ title: 'Updated', description: `Order ${id} status changed to ${status}.` });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
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
              {filtered.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>₹{order.total.toFixed(2)}</TableCell>
                  <TableCell><Badge variant={statusColor(order.status) as any}>{order.status}</Badge></TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={v => updateStatus(order.id, v as Order['status'])}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}><Eye className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Order {selectedOrder?.id}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-muted-foreground">Customer:</span> {selectedOrder.customerName}</p>
                <p><span className="text-muted-foreground">Date:</span> {selectedOrder.date}</p>
                <p><span className="text-muted-foreground">Status:</span> {selectedOrder.status}</p>
                <p><span className="text-muted-foreground">Address:</span> {selectedOrder.address}</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm pt-2">
                  <span>Total</span><span>${selectedOrder.total.toFixed(2)}</span>
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
