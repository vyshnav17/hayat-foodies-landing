import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import About from "@/components/About";
import SEO from "@/components/SEO";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-cream/30">
      <SEO
        title="About Hayat Foods - Premium Bakery Manufacturer in Kannur, Kerala"
        description="Learn about Hayat Foods - a leading bakery manufacturer in Kannur, Kerala. We are committed to excellence, using premium ingredients and traditional recipes to deliver quality baked goods."
        keywords="about hayat foods, hayat foods company, hayat foods kannur, hayat foods bakery, hayat foods manufacturer"
        url="https://vyshnav17.github.io/hayat-foodies-landing/about"
      />
      <Navbar />
      <div className="pt-20 pb-12">
        <About />
      </div>
      <Contact />
      <Footer />
    </div>
  );
};

export default AboutPage;
