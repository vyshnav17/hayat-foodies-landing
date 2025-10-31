import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TypographyAnimation, TextReveal } from "./TypographyAnimation";
import { useParallax } from "@/hooks/useScrollAnimation";
import Chatbot from "./Chatbot";
import heroImage from "@/assets/hero-bread.jpg";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    productsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const { elementRef: parallaxRef, offset } = useParallax(0.3);

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <motion.div
        ref={parallaxRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: offset
        }}
        animate={{
          backgroundPosition: ['center', 'center 10%', 'center']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.img
            src={logo}
            alt="Hayat Foods Logo"
            className="h-36 md:h-44 lg:h-56 mx-auto mb-6 md:mb-8 drop-shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 1.5
            }}
            whileHover={{
              scale: 1.05,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
          />

          <TypographyAnimation
            text="Hayat Foods India"
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
            type="reveal"
            delay={0.5}
            duration={1}
          />

          <TextReveal
            className="text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 font-light"
            stagger={0.1}
          >
            Premium Bakery Products Since Establishment
          </TextReveal>

          <TypographyAnimation
            text="Bringing Fresh, Quality Baked Goods to Kannur, Kerala"
            className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/90"
            type="fade"
            delay={1.5}
            duration={0.8}
          />

          <motion.div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={scrollToProducts}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform"
              >
                Explore Our Products
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/80 font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all duration-500 transform"
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  contactSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Floating CTA Button - Bottom Right */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.5, type: "spring" }}
      >
        <motion.button
          onClick={() => {
            const contactSection = document.getElementById("contact");
            contactSection?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-14 h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
