import { ShoppingCart, Search, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "./ui/badge";

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Nutrition Plan", href: "/nutrition-plan" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-primary">DUMAS</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
