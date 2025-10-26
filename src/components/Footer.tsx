import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import whatsAppLogo from "@/assets/WhatsApp.png";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="container px-4">
        <div className="text-center space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-bold">Hayat Foods India PVT. LTD</h3>
          <p className="text-sm opacity-90">
            Premium Bakery Products | Kannur, Kerala, India
          </p>
          
          <div className="flex justify-center gap-6 pt-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-all duration-300 hover:scale-125 transform"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://www.instagram.com/hayatfoodsindia/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-all duration-300 hover:scale-125 transform"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-all duration-300 hover:scale-125 transform"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-all duration-300 hover:scale-125 transform"
              aria-label="YouTube"
            >
              <Youtube size={24} />
            </a>
          </div>

          <div className="pt-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="font-semibold text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300"
            >
              <a
                href="https://wa.me/918111928999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <img
                  src={whatsAppLogo}
                  alt="WhatsApp"
                  className="w-6 h-6"
                />
                Contact Us Today
              </a>
            </Button>
          </div>

          <p className="text-xs opacity-75 pt-4">
            © {new Date().getFullYear()} Hayat Foods India PVT. LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
