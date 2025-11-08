import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Products from "@/components/Products";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-cream/30">
      <Navbar />
      <div className="pt-20 pb-12">
        <Products />
      </div>
      <Contact />
      <Footer />
    </div>
  );
};

export default ProductsPage;
