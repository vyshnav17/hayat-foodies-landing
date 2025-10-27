import { MapPin, Truck } from "lucide-react";

const Availability = () => {
  return (
    <section id="availability" className="py-16 md:py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Where to Find Us
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Currently serving the entire Kannur district with fresh products daily
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 animate-scale-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Manufacturing Unit</h3>
                  <p className="text-muted-foreground">
                    Our modern manufacturing facility is located in Kannur, Kerala, where we produce
                    all our fresh bakery products daily.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Delivery Coverage</h3>
                  <p className="text-muted-foreground">
                    We deliver fresh products throughout the Kannur district. Available at select
                    retail outlets and stores near you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Availability;
