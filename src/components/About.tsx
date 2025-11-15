import { Factory, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="about" className="py-16 md:py-20 bg-muted/30">
      <div className="container px-4">
        <motion.div
          ref={titleRef}
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose Hayat Foods?
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Hayat Foods is committed to excellence in every product we create
          </motion.p>
        </motion.div>

        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={gridVisible ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    backgroundColor: "rgba(var(--primary), 0.15)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </motion.div>
                </motion.div>
                <motion.h3
                  className="text-xl font-bold mb-3 text-foreground"
                  initial={{ opacity: 0 }}
                  animate={gridVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={gridVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
