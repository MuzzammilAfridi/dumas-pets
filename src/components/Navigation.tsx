import { ShoppingCart, Search, User, LogOut, Menu, PawPrint } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { useState } from "react";

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = getItemCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    
    { name: "Shop", href: "/shop" },
    { name: "Nutrition Plan", href: "/nutrition-plan" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "FAQ", href: "/faq" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-md">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-all group-hover:scale-105">
              <PawPrint className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-primary tracking-wide">DUMAS</span>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Bakes 'N' Meals</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
              <Search className="w-5 h-5" />
            </Button>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all">
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 animate-in zoom-in-50">
                  {itemCount}
                </Badge>
              )}
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-12">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                        isActive(link.href)
                          ? "text-primary bg-primary/10"
                          : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
