import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Availability from "@/components/Availability";
import SEO from "@/components/SEO";

const AvailabilityPage = () => {
  return (
    <div className="min-h-screen bg-cream/30">
      <SEO
        title="Hayat Foods Availability - Find Our Products Near You | Kannur, Kerala"
        description="Check Hayat Foods product availability in your area. Find where to buy our fresh bakery products including chapati, cream bun, baby chocolate bun, bread, and rusk in Kannur, Kerala."
        keywords="hayat foods availability, hayat foods near me, hayat foods kannur availability, where to buy hayat foods, hayat foods distributors"
        url="https://vyshnav17.github.io/hayat-foodies-landing/availability"
      />
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
