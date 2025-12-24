import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Home,
  Users,
  UserCheck,
  GraduationCap,
  DollarSign,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home, exact: true },
    { href: "/operator/onboarding", label: "Onboarding", icon: UserCheck },
    { href: "/operator/payouts", label: "Payouts", icon: DollarSign },
    { href: "/parent", label: "Parent Portal", icon: Users },
    { href: "/instructor/sessions", label: "Instructor", icon: GraduationCap },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <nav className={`bg-card border-b border-card-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
                F
              </div>
              <span className="font-bold text-xl">Foundry Online</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ href, label, icon: Icon, exact }) => (
              <Button
                key={href}
                variant={isActive(href, exact) ? "default" : "ghost"}
                size="sm"
                asChild
                data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
              >
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="mobile-nav">
            {navItems.map(({ href, label, icon: Icon, exact }) => (
              <Button
                key={href}
                variant={isActive(href, exact) ? "default" : "ghost"}
                size="sm"
                asChild
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-nav-${label.toLowerCase().replace(' ', '-')}`}
              >
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}