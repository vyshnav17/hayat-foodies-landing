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
    name: "Baby Chocolate Bun",
    description: "Sweet chocolate buns perfect for kids and chocolate lovers",
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
    <section id="products" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Premium Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our range of freshly baked products, made with love and the finest ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <Card 
              key={product.name}
              className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
