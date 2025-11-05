import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Autoplay from "embla-carousel-autoplay";
import chapatiImg from "@/assets/chapati.jpg";
import creamBunImg from "@/assets/cream-bun.jpg";
import chocolateBunImg from "@/assets/chocolate-bun.jpg";
import breadImg from "@/assets/bread.jpg";
import ruskImg from "@/assets/rusk.jpg";
import babyChocolateBunImg from "@/assets/baby-chocolate-bun.jpg";

const defaultProducts = [
  {
    name: "Chapati",
    description: "Soft, fresh chapati made daily with premium ingredients",
    images: [chapatiImg, breadImg, ruskImg],
    ingredients: ["Whole wheat flour", "Water", "Salt", "Oil"],
    weight: 450,
    price: 60,
    gst: 3,
  },
  {
    name: "Cream Bun",
    description: "Delicious cream-filled buns with smooth vanilla cream",
    images: [creamBunImg, chocolateBunImg, babyChocolateBunImg],
    ingredients: ["Flour", "Cream", "Sugar", "Yeast", "Vanilla"],
    quantity: 4,
    price: 45,
    gst: 2.25,
  },
  {
    name: "Normal Buns",
    description: "Freshly baked, delightfully soft—your perfect companion for any meal",
    images: [chocolateBunImg, creamBunImg, babyChocolateBunImg],
    ingredients: ["Flour", "Sugar", "Yeast", "Milk", "Butter"],
    quantity: 2,
    price: 20,
    gst: 1,
  },
  {
    name: "Baby Chocolate Bun",
    description: "Soft, rich, and perfectly sized for a satisfying chocolate treat.",
    images: [babyChocolateBunImg, chocolateBunImg, creamBunImg],
    ingredients: ["Flour", "Chocolate", "Sugar", "Yeast", "Butter"],
    quantity: 5,
    price: 40,
    gst: 2,
  },
  {
    name: "Bread",
    description: "Fresh, soft bread baked to perfection every day",
    images: [breadImg, chapatiImg, ruskImg],
    ingredients: ["Flour", "Water", "Yeast", "Salt", "Sugar"],
    weight: 300,
    price: 40,
    gst: 2,
  },
  {
    name: "Rusk",
    description: "Crispy, golden rusk perfect for tea time",
    images: [ruskImg, breadImg, chapatiImg],
    ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Yeast"],
    weight: 250,
    price: 45,
    gst: 3.5,
  },
];

const Products = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [selectedProduct, setSelectedProduct] = useState<typeof defaultProducts[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.2 });

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        if (products.length > 0) {
          setProducts(products);
        } else {
          // Initialize with default products if database is empty
          setProducts(defaultProducts);
          // Save default products to database
          await Promise.all(defaultProducts.map(product =>
            fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(product)
            })
          ));
        }
      } else {
        console.error('Failed to fetch products');
        // Fallback to default products
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to default products
      setProducts(defaultProducts);
    }
  };

  useEffect(() => {
    // Load products from API, fallback to defaultProducts
    fetchProducts();
  }, []);

  useEffect(() => {
    // Preload images for better performance
    products.forEach(product => {
      product.images.forEach(image => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded(prev => ({ ...prev, [image]: true }));
        };
        img.src = image;
      });
    });
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section id="products" className="py-16 md:py-20 bg-background">
      <div className="container px-4">
        <motion.div
          ref={titleRef}
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Premium Products
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover our range of freshly baked products, made with love and the finest ingredients
          </motion.p>
        </motion.div>

        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={gridVisible ? "visible" : "hidden"}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="group overflow-hidden border-border hover:shadow-2xl transition-all duration-500 transform cursor-pointer h-full"
                data-product={product.name.toLowerCase().replace(' ', '-')}
                onClick={() => {
                  setSelectedProduct(product);
                  setDialogOpen(true);
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.3 }
                    }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <motion.div
                    className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    ₹{product.price}
                  </motion.div>
                </div>
                <CardContent className="p-6">
                  <motion.h3
                    className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={gridVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {product.name}
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={gridVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {product.description}
                  </motion.p>
                  <motion.div
                    className="mt-4 flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={gridVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span className="text-sm text-muted-foreground">
                      {product.weight ? `${product.weight} gm` : `${product.quantity} pieces`}
                    </span>
                    <motion.button
                      className="text-primary hover:text-primary/80 font-semibold text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details →
                    </motion.button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl w-full mx-0 rounded-xl p-6 md:p-8">
            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-6">
                  <div className="relative">
                    <Carousel className="w-full" plugins={[Autoplay({ delay: 2000 })]}>
                      <CarouselContent>
                        {selectedProduct.images.map((image, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <img
                              src={image}
                              alt={`${selectedProduct.name} ${imgIndex + 1}`}
                              className="w-full h-48 md:h-64 object-cover rounded-lg"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>

                  </div>
                </div>
                <div className="space-y-6 p-2 md:p-4">
                  <h3 className="text-xl md:text-2xl font-bold">{selectedProduct.name}</h3>
                  <p className="text-muted-foreground text-sm md:text-base">{selectedProduct.description}</p>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Ingredients:</h4>
                    <ul className="list-disc list-inside text-xs md:text-sm text-muted-foreground mt-2">
                      {selectedProduct.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm"><strong>{selectedProduct.weight ? 'Weight:' : 'Quantity:'}</strong> {selectedProduct.weight ? `${selectedProduct.weight} gm` : `${selectedProduct.quantity} pieces`}</p>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-bold">Price: ₹{selectedProduct.price}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Products;
