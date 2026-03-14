import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockOrders, Order } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Package, RefreshCw, Eye } from 'lucide-react';

const statusSteps = ['Pending', 'Processing', 'Delivered'];

const MyOrders = () => {
  const { user } = useAuth();
  const orders = mockOrders.filter(o => o.customerId === user?.id);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">My Orders</h2>

      {orders.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>No orders yet.</p>
        </CardContent></Card>
      ) : orders.map(order => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-foreground">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.date} • {order.items.length} items</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{order.status}</Badge>
                <span className="font-bold">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            {order.status !== 'Cancelled' && (
              <div className="mt-4 flex items-center gap-1">
                {statusSteps.map((step, i) => {
                  const currentIdx = statusSteps.indexOf(order.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} className="flex-1 flex items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
                      <span className={`text-xs ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step}</span>
                      {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 ${done ? 'bg-primary' : 'bg-border'}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}><Eye className="w-3 h-3 mr-1" /> Details</Button>
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Re-ordered!', description: `Items from ${order.id} added to cart.` })}><RefreshCw className="w-3 h-3 mr-1" /> Re-order</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Order {selectedOrder?.id}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-3">
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Date:</span> {selectedOrder.date}</p>
                <p><span className="text-muted-foreground">Address:</span> {selectedOrder.address}</p>
              </div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-1"><span>Total</span><span>₹{selectedOrder.total.toFixed(2)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;
