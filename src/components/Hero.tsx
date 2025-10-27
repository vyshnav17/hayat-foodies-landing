import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bread.jpg";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    productsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          <img
            src={logo}
            alt="Hayat Foods Logo"
            className="h-36 md:h-44 lg:h-56 mx-auto mb-6 md:mb-8 drop-shadow-2xl animate-fade-in animate-float"
          />
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Hayat Foods India
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 font-light animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Premium Bakery Products Since Establishment
          </p>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/90 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Bringing Fresh, Quality Baked Goods to Kannur, Kerala
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 transform"
            >
              Explore Our Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/80 font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all duration-500 hover:scale-110 transform"
              onClick={() => {
                const contactSection = document.getElementById("contact");
                contactSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
