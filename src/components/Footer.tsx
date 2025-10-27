import { Facebook, Instagram, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const Footer = () => {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        // Instagram Basic Display API endpoint
        // Note: This requires Instagram Business account and API setup
        // For now, using a placeholder that would be replaced with actual API call
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink&access_token=YOUR_ACCESS_TOKEN`);
        const data = await response.json();

        if (data.data) {
          const posts = data.data.slice(0, 4).map(post => ({
            id: post.id,
            image: post.media_url,
            permalink: post.permalink,
            alt: "Instagram post"
          }));
          setInstagramPosts(posts);
        }
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        // Fallback to mock data if API fails
        setInstagramPosts([
          { id: 1, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop", alt: "Fresh bread baking" },
          { id: 2, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop", alt: "Delicious buns" },
          { id: 3, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop", alt: "Bakery products" },
          { id: 4, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop", alt: "Fresh pastries" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Instagram Feed Section */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6">Follow Us on Instagram</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))
              ) : (
                instagramPosts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink || "https://www.instagram.com/hayatfoodsindia/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg aspect-square hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={post.image}
                      alt={post.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Instagram className="w-8 h-8 text-white" />
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

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
              <a
                href="https://www.instagram.com/hayatfoodsindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-all duration-300 hover:scale-125 transform"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>

            <p className="text-xs opacity-75 pt-4">
              © {new Date().getFullYear()} Hayat Foods India PVT. LTD. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
