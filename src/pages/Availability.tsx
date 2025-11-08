import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Availability from "@/components/Availability";

const AvailabilityPage = () => {
  return (
    <div className="min-h-screen bg-cream/30">
      <Navbar />
      <div className="pt-20 pb-12">
        <Availability />
      </div>
      <Contact />
      <Footer />
    </div>
  );
};

export default AvailabilityPage;
