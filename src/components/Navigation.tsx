import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import logo from "../assets/Droptaxi_Logo.jpeg";

const Navigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false); // Close mobile menu after navigation
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Selvendhira DropTaxi Logo" className="w-20 h-20 object-cover" />
            <span className={`text-2xl font-display transition-colors duration-300 ${
              isScrolled ? "text-primary" : "text-white"
            }`}>
              Selvendhira DropTaxi
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={isScrolled ? "" : "text-white hover:bg-white/10"}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 glass-card">
                <div className="flex flex-col gap-6 mt-6">
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-left text-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="text-left text-foreground hover:text-primary transition-colors"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection("routes")}
                    className="text-left text-foreground hover:text-primary transition-colors"
                  >
                    Routes
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-left text-foreground hover:text-primary transition-colors"
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setIsOpen(false);
                    }}
                    className="text-left text-foreground hover:text-primary transition-colors"
                  >
                    Admin
                  </button>
                   <Button
                     onClick={() => scrollToSection("contact")}
                     className="w-full btn-cta hover:opacity-90 rounded-full"
                   >
                     Contact
                   </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("home")}
              className={`transition-colors duration-300 ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className={`transition-colors duration-300 ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("routes")}
              className={`transition-colors duration-300 ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Routes
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className={`transition-colors duration-300 ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() => navigate("/admin")}
              className={`transition-colors duration-300 ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Admin
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="btn-cta hover:opacity-90 rounded-full px-6"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
