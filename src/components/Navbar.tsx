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
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Hayat Foods Logo"
                className="h-24 md:h-55 w-auto transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-brown hover:text-terracotta transition-colors duration-300 font-medium"
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("products")}
              className="text-brown hover:text-terracotta transition-colors duration-300 font-medium"
            >
              Our Products
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="text-brown hover:text-terracotta transition-colors duration-300 font-medium"
            >
              About Us
            </button>

            <button
              onClick={() => scrollToSection("availability")}
              className="text-brown hover:text-terracotta transition-colors duration-300 font-medium"
            >
              Where to Buy
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-brown hover:text-terracotta transition-colors duration-300 font-medium"
            >
              Contact
            </button>
          </div>

          {/* Right Section - Social Media Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:text-terracotta hover:bg-cream/50 p-2"
              onClick={() => window.open('https://wa.me/918111928999', '_blank')}
            >
              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className="h-5 w-5"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:text-terracotta hover:bg-cream/50"
              onClick={() => window.open('https://www.instagram.com/hayatfoodsindia/', '_blank')}
            >
              <Instagram className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:text-terracotta hover:bg-cream/50"
              onClick={() => window.open('https://www.facebook.com/hayatfoodsindia/', '_blank')}
            >
              <Facebook className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-brown">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img src={logo} alt="Hayat Foods Logo" className="h-8 w-auto" />
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-6">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-4">
                    <button
                      onClick={() => scrollToSection("hero")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-colors duration-300 font-medium py-2"
                    >
                      Home
                    </button>

                    <button
                      onClick={() => scrollToSection("products")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-colors duration-300 font-medium py-2"
                    >
                      Our Products
                    </button>

                    <button
                      onClick={() => scrollToSection("about")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-colors duration-300 font-medium py-2"
                    >
                      About Us
                    </button>

                    <button
                      onClick={() => scrollToSection("availability")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-colors duration-300 font-medium py-2"
                    >
                      Where to Buy
                    </button>

                    <button
                      onClick={() => scrollToSection("contact")}
                      className="block w-full text-left text-brown hover:text-terracotta transition-colors duration-300 font-medium py-2"
                    >
                      Contact
                    </button>
                  </div>

                  {/* Mobile Contact Info */}
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-terracotta" />
                      <span className="text-sm">+91 99952 36569</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-terracotta" />
                      <span className="text-sm">info@hayatfoods.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-terracotta" />
                      <span className="text-sm">Kannur, Kerala</span>
                    </div>
                  </div>

                  {/* Mobile Social Media */}
                  <div className="border-t pt-6">
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1"
                        onClick={() => window.open('https://wa.me/918111928999', '_blank')}
                      >
                        <img
                          src={whatsappIcon}
                          alt="WhatsApp"
                          className="h-4 w-4 mr-2"
                        />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1"
                        onClick={() => window.open('https://www.instagram.com/hayatfoodsindia/', '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-1"
                        onClick={() => window.open('https://www.facebook.com/hayatfoodsindia/', '_blank')}
                      >
                        <Facebook className="h-4 w-4 mr-2" />
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
