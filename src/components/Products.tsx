import { Card, CardContent } from "@/components/ui/card";
import chapatiImg from "@/assets/chapati.jpg";
import creamBunImg from "@/assets/cream-bun.jpg";
import chocolateBunImg from "@/assets/chocolate-bun.jpg";
import breadImg from "@/assets/bread.jpg";
import ruskImg from "@/assets/rusk.jpg";

const products = [
  {
    name: "Chapati",
    description: "Soft, fresh chapati made daily with premium ingredients",
    image: chapatiImg,
  },
  {
    name: "Cream Bun",
    description: "Delicious cream-filled buns with smooth vanilla cream",
    image: creamBunImg,
  },
  {
    name: "Normal Buns",
    description: "Freshly baked, delightfully soft—your perfect companion for any meal",
    image: chocolateBunImg,
  },
  {
    name: "Bread",
    description: "Fresh, soft bread baked to perfection every day",
    image: breadImg,
  },
  {
    name: "Rusk",
    description: "Crispy, golden rusk perfect for tea time",
    image: ruskImg,
  },
];

const Products = () => {
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
              className="group overflow-hidden border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-scale-in transform"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
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
      </div>
    </section>
  );
};

export default Products;
