import { MapPin, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Availability = () => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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
    <section id="availability" className="py-16 md:py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            ref={titleRef}
            className="text-center mb-8 md:mb-12"
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
              Where to Find Us
            </motion.h2>
            <motion.p
              className="text-base md:text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Currently serving the entire Kannur district with fresh products daily
            </motion.p>
          </motion.div>

          <motion.div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={gridVisible ? "visible" : "hidden"}
          >
            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="bg-card border border-border rounded-2xl p-8 h-full"
                whileHover={{
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{
                        backgroundColor: "rgba(var(--primary), 0.2)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      <MapPin className="w-6 h-6 text-primary" />
                    </motion.div>
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-2xl font-bold mb-2 text-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      animate={gridVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }}
                    >
                      Manufacturing Unit
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={gridVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: 0.4 }}
                    >
                      Our modern manufacturing facility is located in Kannur, Kerala, where we produce
                      all our fresh bakery products daily.
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.03,
                rotateY: -5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="bg-card border border-border rounded-2xl p-8 h-full"
                whileHover={{
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center"
                      whileHover={{
                        backgroundColor: "rgba(var(--accent), 0.2)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Truck className="w-6 h-6 text-accent" />
                    </motion.div>
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-2xl font-bold mb-2 text-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      animate={gridVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: 0.5 }}
                    >
                      Delivery Coverage
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={gridVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: 0.6 }}
                    >
                      We deliver fresh products throughout the Kannur district. Available at select
                      retail outlets and stores near you.
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Availability;
