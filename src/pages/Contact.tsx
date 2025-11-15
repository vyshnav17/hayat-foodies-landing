import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import SEO from "@/components/SEO";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-cream/30">
      <SEO
        title="Contact Hayat Foods - Get in Touch | Kannur, Kerala"
        description="Contact Hayat Foods for inquiries about our premium bakery products. Located in Kannur, Kerala. Call us or visit our bakery for fresh chapati, buns, bread, and rusk."
        keywords="contact hayat foods, hayat foods contact, hayat foods kannur contact, hayat foods phone number, hayat foods address"
        url="https://vyshnav17.github.io/hayat-foodies-landing/contact"
      />
      <Navbar />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
