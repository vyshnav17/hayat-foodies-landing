import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import About from "@/components/About";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-cream/30">
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
