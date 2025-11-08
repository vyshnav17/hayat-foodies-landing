import { Facebook, Instagram, Heart } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Mock Instagram posts - replace with actual API data
  const instagramPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop", alt: "Fresh bread baking" },
    { id: 2, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop", alt: "Delicious buns" },
    { id: 3, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop", alt: "Bakery products" },
    { id: 4, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop", alt: "Fresh pastries" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">


          {/* Main Footer Content */}
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
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="hover:opacity-80 transition-all duration-300 hover:scale-125 transform"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Follow Us on Instagram</DialogTitle>
                  </DialogHeader>
                  <div className="w-full h-96 bg-white rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.instagram.com/hayatfoodsindia/embed/"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency={true}
                      className="w-full h-full"
                      title="Instagram Profile Embed"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-xs opacity-75 pt-4">
              © {new Date().getFullYear()} Hayat Foods India PVT. LTD. All rights reserved. | Created by{" "}
              <a
                href="https://www.instagram.com/vyshnav.tv/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Instagram size={14} />
                Vyshnav T V
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
