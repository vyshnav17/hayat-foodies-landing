import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Availability from "@/components/Availability";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Products />
      <About />
      <Availability />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
