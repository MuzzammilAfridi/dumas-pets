import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, PawPrint, MapPin, User, Package } from 'lucide-react';
import { mockOrders } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

import { useEffect, useState } from "react";
import { getSalesOrders } from "@/services/orderService";

const CustomerDashboard = () => {
  const { user } = useAuth();
  
  const [recentOrders, setRecentOrders] = useState([]);

useEffect(() => {
  if (!user?.name) return;

  const fetchOrders = async () => {
    try {
      const res = await getSalesOrders(user.name);

      const orders = res.data.data.slice(0, 3);

      setRecentOrders(orders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  fetchOrders();
}, [user]);

console.log("Recent order" ,recentOrders);


  const quickActions = [
    { label: 'View Orders', icon: ShoppingBag, path: '/dashboard/orders' },
    { label: 'Pet Profiles', icon: PawPrint, path: '/dashboard/pets' },
    { label: 'Addresses', icon: MapPin, path: '/dashboard/addresses' },
    { label: 'Edit Profile', icon: User, path: '/dashboard/profile' },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 🐾</h2>
          <p className="opacity-90 mt-1">Manage your orders, pets, and account settings.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map(action => (
          <Link key={action.path} to={action.path}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link to="/dashboard/orders"><Button variant="outline" size="sm">View All</Button></Link>
        </CardHeader>
        <CardContent>
{recentOrders.length === 0 ? (
  <div className="text-center py-8 text-muted-foreground">
    <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
    <p>No orders yet. Start shopping!</p>
    <Link to="/shop">
      <Button className="mt-3" size="sm">
        Browse Products
      </Button>
    </Link>
  </div>
) : (
  recentOrders.map((order) => (
    <div
      key={order.name}
      className="flex justify-between items-center py-3 border-b border-border last:border-0"
    >
      <div>
        <p className="font-medium text-sm text-foreground">
          {order.name}
        </p>

        <p className="text-xs text-muted-foreground">
          {order.transaction_date} • {order.total_qty || 0} items
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm">
          ₹{Number(order.grand_total || 0).toFixed(2)}
        </span>

        <Badge variant="outline">
          {order.status || "Draft"}
        </Badge>
      </div>
    </div>
  ))
)}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
