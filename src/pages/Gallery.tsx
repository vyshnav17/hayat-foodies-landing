import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import SEO from "@/components/SEO";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  uploadedAt: string;
  uploadedBy: string;
}

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const images = await response.json();
          // Use only images from API (which includes defaults if database is empty)
          setGalleryImages(images);
        } else {
          // Fallback to default images if API fails
          console.error('Failed to fetch gallery images, using defaults');
          setGalleryImages([
            { id: "1", src: "/assets/gallery/baby-chocolate-bun.jpg", alt: "Baby Chocolate Bun", uploadedAt: "", uploadedBy: "" },
            { id: "2", src: "/assets/gallery/bread.jpg", alt: "Fresh Bread", uploadedAt: "", uploadedBy: "" },
            { id: "3", src: "/assets/gallery/chapati.jpg", alt: "Chapati", uploadedAt: "", uploadedBy: "" },
            { id: "4", src: "/assets/gallery/chocolate-bun.jpg", alt: "Chocolate Bun", uploadedAt: "", uploadedBy: "" },
            { id: "5", src: "/assets/gallery/cream-bun.jpg", alt: "Cream Bun", uploadedAt: "", uploadedBy: "" },
            { id: "6", src: "/assets/gallery/hero-bread.jpg", alt: "Hero Bread", uploadedAt: "", uploadedBy: "" },
          ]);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Fallback to default images
        setGalleryImages([
          { id: "1", src: "/assets/gallery/baby-chocolate-bun.jpg", alt: "Baby Chocolate Bun", uploadedAt: "", uploadedBy: "" },
          { id: "2", src: "/assets/gallery/bread.jpg", alt: "Fresh Bread", uploadedAt: "", uploadedBy: "" },
          { id: "3", src: "/assets/gallery/chapati.jpg", alt: "Chapati", uploadedAt: "", uploadedBy: "" },
          { id: "4", src: "/assets/gallery/chocolate-bun.jpg", alt: "Chocolate Bun", uploadedAt: "", uploadedBy: "" },
          { id: "5", src: "/assets/gallery/cream-bun.jpg", alt: "Cream Bun", uploadedAt: "", uploadedBy: "" },
          { id: "6", src: "/assets/gallery/hero-bread.jpg", alt: "Hero Bread", uploadedAt: "", uploadedBy: "" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="min-h-screen bg-cream/30">
      <SEO
        title="Hayat Foods Gallery - Photo Gallery of Premium Bakery Products"
        description="Browse Hayat Foods photo gallery showcasing our premium bakery products including fresh chapati, cream bun, baby chocolate bun, bread, and rusk. All products are freshly baked in Kannur, Kerala."
        keywords="hayat foods gallery, hayat foods photos, hayat foods images, hayat foods bakery gallery, hayat foods product images"
        url="https://vyshnav17.github.io/hayat-foodies-landing/gallery"
      />
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
              Hayat Foods Gallery
            </h1>
            <p className="text-lg text-brown/80 max-w-2xl mx-auto">
              Explore Hayat Foods delicious bakery products through our photo gallery
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.id || index}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 transform cursor-pointer"
                onClick={() => openModal(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full aspect-square object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-medium text-center">{image.alt}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Contact />
      <Footer />

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-0">
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            {selectedImage && (
              <div className="flex flex-col items-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedImage.alt}</h3>
                  {selectedImage.uploadedAt && (
                    <p className="text-gray-300 text-sm">
                      Uploaded: {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                  {selectedImage.uploadedBy && selectedImage.uploadedBy !== "admin" && (
                    <p className="text-gray-300 text-sm">
                      By: {selectedImage.uploadedBy}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
