import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X } from "lucide-react";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const handleStartTrial = () => {
    if (isAuthenticated) {
      logout();
    }
    navigate('/register');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
    { label: "Testimonials", id: "testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled
          ? "backdrop-blur-lg shadow-soft border-b"
          : "bg-transparent"
      }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
        borderColor: isScrolled ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-medium transition-smooth"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Convertfy CRM
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <Menu setActive={setActive}>
              <MenuItem setActive={setActive} active={active} item="Home">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink onClick={() => scrollToSection("home")}>
                    Overview
                  </HoveredLink>
                  <HoveredLink onClick={() => scrollToSection("features")}>
                    Quick Features
                  </HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Features">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink onClick={() => scrollToSection("features")}>
                    Email & SMS Automation
                  </HoveredLink>
                  <HoveredLink onClick={() => scrollToSection("features")}>
                    E-commerce Integrations
                  </HoveredLink>
                  <HoveredLink onClick={() => scrollToSection("features")}>
                    Analytics Dashboard
                  </HoveredLink>
                  <HoveredLink onClick={() => scrollToSection("features")}>
                    Campaign Management
                  </HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="How It Works">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink onClick={() => scrollToSection("how-it-works")}>
                    Step-by-Step Guide
                  </HoveredLink>
                  <HoveredLink onClick={() => scrollToSection("how-it-works")}>
                    Integration Process
                  </HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Pricing">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink onClick={() => scrollToSection("pricing")}>
                    View Plans
                  </HoveredLink>
                  <HoveredLink onClick={() => scrollToSection("pricing")}>
                    Compare Features
                  </HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Testimonials">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink onClick={() => scrollToSection("testimonials")}>
                    Customer Stories
                  </HoveredLink>
                  <HoveredLink onClick={() => scrollToSection("testimonials")}>
                    Success Metrics
                  </HoveredLink>
                </div>
              </MenuItem>
            </Menu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="default"
              className="text-text-secondary hover:text-white"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              size="default"
              className="text-white hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden backdrop-blur-lg border-t animate-fade-in"
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            borderColor: 'rgba(59, 130, 246, 0.2)'
          }}
        >
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left py-2 text-sm font-medium text-text-secondary hover:text-white transition-smooth"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 space-y-3 border-t" style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <Button
                variant="outline"
                size="default"
                className="w-full text-white hover:bg-white/10"
                style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                size="default"
                className="w-full text-white"
                style={{ backgroundColor: '#25D366' }}
                onClick={handleStartTrial}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
