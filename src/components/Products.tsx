import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import chapatiImg from "@/assets/chapati.jpg";
import creamBunImg from "@/assets/cream-bun.jpg";
import chocolateBunImg from "@/assets/chocolate-bun.jpg";
import breadImg from "@/assets/bread.jpg";
import ruskImg from "@/assets/rusk.jpg";
import babyChocolateBunImg from "@/assets/baby-chocolate-bun.jpg";

const products = [
  {
    name: "Chapati",
    description: "Soft, fresh chapati made daily with premium ingredients",
    images: [chapatiImg, breadImg, ruskImg],
    ingredients: ["Whole wheat flour", "Water", "Salt", "Oil"],
    calories: 150,
    price: 20,
    gst: 2,
  },
  {
    name: "Cream Bun",
    description: "Delicious cream-filled buns with smooth vanilla cream",
    images: [creamBunImg, chocolateBunImg, babyChocolateBunImg],
    ingredients: ["Flour", "Cream", "Sugar", "Yeast", "Vanilla"],
    calories: 250,
    price: 30,
    gst: 3,
  },
  {
    name: "Normal Buns",
    description: "Freshly baked, delightfully soft—your perfect companion for any meal",
    images: [chocolateBunImg, creamBunImg, babyChocolateBunImg],
    ingredients: ["Flour", "Sugar", "Yeast", "Milk", "Butter"],
    calories: 200,
    price: 25,
    gst: 2.5,
  },
  {
    name: "Baby Chocolate Bun",
    description: "Soft, rich, and perfectly sized for a satisfying chocolate treat.",
    images: [babyChocolateBunImg, chocolateBunImg, creamBunImg],
    ingredients: ["Flour", "Chocolate", "Sugar", "Yeast", "Butter"],
    calories: 180,
    price: 15,
    gst: 1.5,
  },
  {
    name: "Bread",
    description: "Fresh, soft bread baked to perfection every day",
    images: [breadImg, chapatiImg, ruskImg],
    ingredients: ["Flour", "Water", "Yeast", "Salt", "Sugar"],
    calories: 120,
    price: 40,
    gst: 4,
  },
  {
    name: "Rusk",
    description: "Crispy, golden rusk perfect for tea time",
    images: [ruskImg, breadImg, chapatiImg],
    ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Yeast"],
    calories: 100,
    price: 35,
    gst: 3.5,
  },
];

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section id="products" className="py-16 md:py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Our Premium Products
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our range of freshly baked products, made with love and the finest ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <Card
              key={product.name}
              className="group overflow-hidden border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-scale-in transform cursor-pointer"
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => {
                setSelectedProduct(product);
                setDialogOpen(true);
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              <CardContent className="p-6 transition-all duration-500">
                <h3 className="text-2xl font-bold mb-2 text-foreground transition-colors duration-300 group-hover:text-primary">{product.name}</h3>
                <p className="text-muted-foreground transition-all duration-300">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl w-full mx-4 rounded-xl p-6 md:p-8">
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
                    <p className="text-xs md:text-sm"><strong>Calories:</strong> {selectedProduct.calories} kcal</p>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-bold">Price: ₹{selectedProduct.price + selectedProduct.gst} (including GST)</p>
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
