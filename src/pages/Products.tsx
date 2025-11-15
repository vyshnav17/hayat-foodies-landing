import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Products from "@/components/Products";
import SEO from "@/components/SEO";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-cream/30">
      <SEO
        title="Hayat Foods Products - Premium Bakery Products in Kannur, Kerala"
        description="Explore Hayat Foods premium bakery products including fresh chapati, cream bun, baby chocolate bun, bread, and rusk. All products are freshly baked daily in Kannur, Kerala."
        keywords="hayat foods products, hayat foods bakery products, hayat foods chapati, hayat foods cream bun, hayat foods bread, hayat foods rusk, hayat foods kannur products"
        url="https://vyshnav17.github.io/hayat-foodies-landing/products"
      />
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
