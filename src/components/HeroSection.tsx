import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroCake from "@/assets/hero-cake.jpg";

export function HeroSection() {
  const scrollToOrder = () => {
    const element = document.querySelector("#order");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroCake}
          alt="Elegant buttercream cake with purple floral decorations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-gold bg-gold/20 rounded-full border border-gold/30 font-body">
              Artisan Bakery • Vaal, Johannesburg
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold-light leading-tight mb-6"
          >
            The Cake Cottage
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-display text-xl md:text-2xl italic text-gold mb-4"
          >
            "Where Taste Meets Elegance"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-body text-lg text-gold-light/90 mb-10 max-w-xl"
          >
            Handcrafted artisan buttercream cakes for your most cherished moments. 
            Each creation is a masterpiece of flavor and elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="lg" onClick={scrollToOrder}>
              Order Your Custom Cake
            </Button>
            <Button variant="heroOutline" size="lg" onClick={scrollToAbout}>
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-light animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
}
