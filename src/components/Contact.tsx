import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Get in Touch
          </h2>
          <p className="text-base md:text-lg mb-8 md:mb-12 opacity-90 animate-fade-in">
            Have questions or want to know more about our products? We'd love to hear from you!
          </p>

          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            <div className="animate-scale-in">
              <div className="inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 rounded-full bg-primary-foreground/10 mb-4">
                <Phone className="w-5 md:w-6 h-5 md:h-6" />
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="opacity-90 text-sm md:text-base">Contact us for inquiries</p>
              <div className="opacity-90 text-sm md:text-base space-y-1">
                <p>+91 9988636383</p>
                <p>+91 8592056057</p>
                <p>+91 81119 28999</p>
              </div>
            </div>

            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="opacity-90">Send us your questions</p>
            </div>

            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="opacity-90">Kannur, Kerala, India</p>
            </div>
          </div>

          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg"
              variant="secondary"
              className="font-semibold text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300"
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
