import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

const Gallery = () => {
  const galleryImages = [
    { src: "/assets/gallery/baby-chocolate-bun.jpg", alt: "Baby Chocolate Bun" },
    { src: "/assets/gallery/bread.jpg", alt: "Fresh Bread" },
    { src: "/assets/gallery/chapati.jpg", alt: "Chapati" },
    { src: "/assets/gallery/chocolate-bun.jpg", alt: "Chocolate Bun" },
    { src: "/assets/gallery/cream-bun.jpg", alt: "Cream Bun" },
    { src: "/assets/gallery/hero-bread.jpg", alt: "Hero Bread" },
  ];

  return (
    <div className="min-h-screen bg-cream/30">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-brown/80 max-w-2xl mx-auto">
              Explore our delicious bakery products through our photo gallery
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 transform"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 ease-in-out" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <p className="text-white font-medium text-center">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Contact />
      <Footer />
    </div>
  );
};

export default Gallery;
