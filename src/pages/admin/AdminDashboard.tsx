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
import { ShoppingBag, Clock, CheckCircle, Users, Package } from "lucide-react";
import { mockOrders, mockCustomers } from "@/data/mockData";
import { products } from "@/data/products";
import { getAllSalesOrdersAdmin } from "@/services/salesOrderService";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";

import { useNavigate } from "react-router-dom";

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

const chartData = [
  { name: "Mon", orders: 4 },
  { name: "Tue", orders: 7 },
  { name: "Wed", orders: 5 },
  { name: "Thu", orders: 8 },
  { name: "Fri", orders: 12 },
  { name: "Sat", orders: 9 },
  { name: "Sun", orders: 6 },
];

const AdminDashboard = () => {


  const { customers, loading } = useCustomers();
  const { products } = useProducts();
  const [orders, setOrders] = useState<any[]>([]);
const [loadingOrders, setLoadingOrders] = useState(true);

  const navigate = useNavigate();

  // console.log("products in admin dashboard", products);

  const pending = orders.filter((o) => o.status === "Pending").length;
const completed = orders.filter((o) => o.status === "Delivered").length;

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-primary",
      route: "/admin/orders",
    },
    { label: "Pending", value: pending, icon: Clock, color: "text-secondary" , route: "/admin/orders?status=Pending",},
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "text-primary",
          route: "/admin/orders?status=Delivered",
    },
    {
      label: "Customers",
      value: customers.length,
      icon: Users,
      color: "text-secondary",
      route: "/admin/customers",
    },
    {
      label: "Products",
      value: products.length,
      icon: Package,
      color: "text-primary",
      route: "/admin/products",
    },
  ];

const mapERPStatus = (order) => {
  if (order.docstatus === 2) return "Cancelled";

  if (order.per_billed === 100) return "Delivered";

  // ✅ NEW: Pending logic
  if (order.status === "To Deliver and Bill") return "Pending";

  // Processing
  if (order.status === "To Deliver") return "Processing";

  return "Processing";
};

  useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    const res = await getAllSalesOrdersAdmin();

    const formatted = res.data.data.map((o: any) => ({
      id: o.name,
      customerName: o.customer,
      total: o.grand_total || 0,
      status: mapERPStatus(o),
    }));

    setOrders(formatted);
  } catch (err) {
    console.error("Dashboard orders error", err);
  } finally {
    setLoadingOrders(false);
  }
};

if (loading || loadingOrders) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            onClick={() => s.route && navigate(s.route)}
            className="cursor-pointer"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-primary/10 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="orders"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>₹{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor(order.status) as any}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
