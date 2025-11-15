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
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home page first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

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
                alt="Hayat Foods - Premium Bakery Products Logo"
                className={`w-auto transition-all duration-500 ease-in-out ${
                  isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'
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

            <Link
              to="/products"
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Our Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/about"
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/availability"
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Where to Buy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/gallery"
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/contact"
              className="text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
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
                <Button variant="ghost" size="icon" className="text-brown hover:bg-cream/30">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 bg-white/95 backdrop-blur-md">
                <SheetHeader>
                  <SheetTitle className="flex justify-center">
                    <img src={logo} alt="Hayat Foods - Premium Bakery Products Logo" className="h-16 w-auto transition-transform duration-300 ease-in-out hover:scale-105" />
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

                    <Link
                      to="/products"
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Our Products
                    </Link>

                    <Link
                      to="/about"
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>

                    <Link
                      to="/availability"
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Where to Buy
                    </Link>

                    <Link
                      to="/gallery"
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Gallery
                    </Link>

                    <Link
                      to="/contact"
                      className="block w-full text-left text-brown hover:text-terracotta transition-all duration-300 ease-in-out font-medium py-2 hover:translate-x-2 transform"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>

                  {/* Mobile Contact Info */}
                  <div className="border-t border-cream/30 pt-6 space-y-4">
                    <div className="flex items-center space-x-3 group">
                      <Phone className="h-4 w-4 text-terracotta transition-transform duration-300 ease-in-out group-hover:scale-110" />
                      {isMobile ? (
                        <a href="tel:+919995236569" className="text-sm hover:underline transition-colors duration-300 ease-in-out">+91 99952 36569</a>
                      ) : (
                        <span className="text-sm transition-colors duration-300 ease-in-out">+91 99952 36569</span>
                      )}
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

                  {/* Mobile CTA Buttons */}
                  <div className="border-t border-cream/30 pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform py-3"
                        onClick={() => scrollToSection("contact")}
                      >
                        <Phone className="h-4 w-4" />
                        Contact
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform py-3"
                        onClick={() => {
                          const chatbot = document.querySelector('[data-chatbot-toggle]');
                          if (chatbot) {
                            (chatbot as HTMLElement).click();
                          }
                        }}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Chat
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Social Media */}
                  <div className="border-t border-cream/30 pt-6">
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        className="flex-1 px-8 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform"
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
                        className="flex-1 px-8 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform"
                        onClick={() => window.open('https://www.instagram.com/hayatfoodsindia/', '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out" />
                        Instagram
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 px-8 hover:bg-terracotta hover:text-white transition-all duration-300 ease-in-out hover:scale-105 transform"
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
