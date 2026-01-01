import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import buttercreamCake from "@/assets/buttercream-cake.jpg";
import chocolateCake from "@/assets/chocolate-cake.jpg";
import redVelvetCake from "@/assets/red-velvet-cake.jpg";
import carrotCake from "@/assets/carrot-cake.jpg";
import cupcakes from "@/assets/cupcakes.jpg";

const cakeCategories = [
  {
    name: "Buttercream Cakes",
    description: "Our signature artisan buttercream creations, perfect for any celebration.",
    image: buttercreamCake,
    featured: true,
  },
  {
    name: "Chocolate Cakes",
    description: "Rich, decadent chocolate cakes that satisfy every craving.",
    image: chocolateCake,
  },
  {
    name: "Red Velvet",
    description: "Classic red velvet with cream cheese frosting.",
    image: redVelvetCake,
  },
  {
    name: "Carrot Cake",
    description: "Moist carrot cake with perfectly spiced flavors.",
    image: carrotCake,
  },
  {
    name: "Cupcakes",
    description: "Delightful individual treats for any occasion.",
    image: cupcakes,
  },
];

export function CakesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const scrollToOrder = () => {
    const element = document.querySelector("#order");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="cakes" className="py-20 md:py-32 bg-background" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-secondary bg-secondary/10 rounded-full font-body">
            Our Creations
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Cake <span className="text-primary">Categories</span>
          </h2>
          <p className="font-body text-lg text-foreground/70 max-w-2xl mx-auto">
            Each cake is made to order, ensuring freshness and allowing for customization 
            to match your unique vision and taste preferences.
          </p>
        </motion.div>

        {/* Featured Cake */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden group cursor-pointer" onClick={scrollToOrder}>
            <img
              src={cakeCategories[0].image}
              alt={cakeCategories[0].name}
              className="w-full h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-gold bg-gold/20 rounded-full border border-gold/30 font-body">
                Signature Collection
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-light mb-2">
                {cakeCategories[0].name}
              </h3>
              <p className="font-body text-gold-light/80 mb-4 max-w-xl">
                {cakeCategories[0].description}
              </p>
              <Button variant="gold" size="default" className="group/btn">
                Inquire Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Other Cakes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cakeCategories.slice(1).map((cake, index) => (
            <motion.div
              key={cake.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              onClick={scrollToOrder}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img
                  src={cake.image}
                  alt={cake.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body font-medium text-sm">
                    Order Now
                  </span>
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {cake.name}
              </h3>
              <p className="font-body text-sm text-foreground/60">
                {cake.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
