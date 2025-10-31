import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Availability from "@/components/Availability";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Products />
      <About />
      <Availability />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
