import { ShoppingCart, Search, User } from "lucide-react";
import { Button } from "./ui/button";

const Navigation = () => {
  const navLinks = ["Home", "About Us", "Shop", "Blog", "Events", "Gallery", "FAQ", "Contact"];

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
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
