import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container px-4">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold">Hayat Foods India PVT. LTD</h3>
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
              href="https://instagram.com" 
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

          <p className="text-xs opacity-75 pt-4">
            © {new Date().getFullYear()} Hayat Foods India PVT. LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
