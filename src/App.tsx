import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import CategoryListing from "./pages/CategoryListing";
import AllProducts from "./pages/AllProducts";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AboutUs from "./pages/AboutUs";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import OrdersManagement from "./pages/admin/OrdersManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyOrders from "./pages/customer/MyOrders";
import PetProfile from "./pages/customer/PetProfile";
import ProfileManagement from "./pages/customer/ProfileManagement";
import AddressManagement from "./pages/customer/AddressManagement";
import RateCard from "./pages/customer/RateCard";
import NutritionPlan from "./pages/NutritionPlan";
import BlogDetails from "./pages/BlogDetails";
import EventDetails from "./pages/EventDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/nutrition-plan" element={<NutritionPlan />} />
              <Route path="/category/:category" element={<CategoryListing />} />
              <Route path="/category/:category/all" element={<AllProducts />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="orders" element={<OrdersManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
              </Route>

              {/* Customer Routes */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>}>
                <Route index element={<CustomerDashboard />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="pets" element={<PetProfile />} />
                <Route path="profile" element={<ProfileManagement />} />
                <Route path="addresses" element={<AddressManagement />} />
                <Route path="rate-card" element={<RateCard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
