import { Factory, Heart, Award } from "lucide-react";

const features = [
  {
    icon: Factory,
    title: "Local Manufacturing",
    description: "Our state-of-the-art manufacturing unit is located right here in Kannur, ensuring the freshest products",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every product is crafted with care and attention to quality, using traditional recipes and modern techniques",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "We use only the finest ingredients to deliver exceptional taste and freshness in every bite",
  },
];

const About = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why Choose Hayat Foods?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Committed to excellence in every product we create
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
