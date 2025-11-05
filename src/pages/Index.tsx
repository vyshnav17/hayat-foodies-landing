import { useRef } from "react";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Availability from "@/components/Availability";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import DistributorModal from "@/components/DistributorModal";

const Index = () => {
  const productsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div ref={productsRef}>
        <Products />
      </div>
      <About />
      <Availability />
      <Contact />
      <div ref={footerRef}>
        <Footer />
      </div>
      <Chatbot />
      <DistributorModal productsRef={productsRef} footerRef={footerRef} />
    </div>
  );
};

export default Index;
