import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react";
import logo from "@/assets/logo.png";
import whatsappIcon from "@/assets/icons8-whatsapp-24.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 80; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-cream/20'
        : 'bg-white shadow-lg'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Hayat Foods Logo"
                className={`w-auto transition-all duration-500 ease-in-out ${
                  isScrolled ? 'h-10 md:h-12' : 'h-14 md:h-16'
                } hover:scale-105 transform`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("products")}
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Our Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("availability")}
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Where to Buy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </button>
          </div>

          {/* Right Section - Social Media Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:text-terracotta hover:bg-cream/50 p-2 transition-all duration-300 ease-in-out hover:scale-110 transform"
              onClick={() => window.open('https://wa.me/918111928999', '_blank')}
            >
              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="h-5 w-5 transition-transform duration-300 ease-in-out"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:text-terracotta hover:bg-cream/50 transition-all duration-300 ease-in-out hover:scale-110 transform"
              onClick={() => window.open('https://www.instagram.com/hayatfoodsindia/', '_blank')}
            >
              <Instagram className="h-5 w-5 transition-transform duration-300 ease-in-out" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:text-terracotta hover:bg-cream/50 transition-all duration-300 ease-in-out hover:scale-110 transform"
              onClick={() => window.open('https://www.facebook.com/hayatfoodsindia/', '_blank')}
            >
              <Facebook className="h-5 w-5 transition-transform duration-300 ease-in-out" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-brown hover:bg-cream/30 transition-all duration-300 ease-in-out">
                  <Menu className="h-6 w-6 transition-transform duration-300 ease-in-out" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 bg-white/95 backdrop-blur-md">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img src={logo} alt="Hayat Foods Logo" className="h-8 w-auto transition-transform duration-300 ease-in-out hover:scale-105" />
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-6">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-4">
                    <button
                      onClick={() => scrollToSection("hero")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                    >
                      Home
                    </button>

                    <button
                      onClick={() => scrollToSection("products")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                    >
                      Our Products
                    </button>

                    <button
                      onClick={() => scrollToSection("about")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                    >
                      About Us
                    </button>

                    <button
                      onClick={() => scrollToSection("availability")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                    >
                      Where to Buy
                    </button>

                    <button
                      onClick={() => scrollToSection("contact")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                    >
                      Contact
                    </button>
                  </div>

                  {/* Mobile Contact Info */}
                  <div className="border-t border-cream/30 pt-6 space-y-4">
                    <div className="flex items-center space-x-3 group">
                      <Phone className="h-4 w-4 text-terracotta transition-transform duration-300 ease-in-out group-hover:scale-110" />
                      <span className="text-sm transition-colors duration-300 ease-in-out">+91 99952 36569</span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                      <Mail className="h-4 w-4 text-terracotta transition-transform duration-300 ease-in-out group-hover:scale-110" />
                      <span className="text-sm transition-colors duration-300 ease-in-out">info@hayatfoods.com</span>
                    </div>
                    <div className="flex items-center space-x-3 group">
                      <MapPin className="h-4 w-4 text-terracotta transition-transform duration-300 ease-in-out group-hover:scale-110" />
                      <span className="text-sm transition-colors duration-300 ease-in-out">Kannur, Kerala</span>
                    </div>
                  </div>

                  {/* Mobile Social Media */}
                  <div className="border-t border-cream/30 pt-6">
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform"
                        onClick={() => window.open('https://wa.me/918111928999', '_blank')}
                      >
                        <img
                          src={whatsappIcon}
                          alt="WhatsApp"
                          className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out"
                        />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform"
                        onClick={() => window.open('https://www.instagram.com/hayatfoodsindia/', '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out" />
                        Instagram
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform"
                        onClick={() => window.open('https://www.facebook.com/hayatfoodsindia/', '_blank')}
                      >
                        <Facebook className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out" />
                        Facebook
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
