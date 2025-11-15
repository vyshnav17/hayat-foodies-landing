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
import SEO from "@/components/SEO";

const Index = () => {
  const productsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen">
      <SEO
        title="Hayat Foods - Premium Bakery Products | Fresh Chapati, Buns, Bread in Kannur, Kerala"
        description="Hayat Foods - Leading bakery manufacturer in Kannur, Kerala. Premium fresh bakery products including chapati, cream bun, baby chocolate bun, bread, and rusk. Hayat Foods delivers quality baked goods throughout Kannur district."
        keywords="hayat foods, hayat foods india, hayat foods kannur, hayat foods kerala, bakery products kannur, fresh chapati kannur, cream bun kannur, bread kannur, rusk kannur, bakery manufacturer kerala, fresh bakery products, kannur bakery, hayat foods bakery, hayat foods products"
      />
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
