import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

import buttercreamCake from "@/assets/buttercream-cake.jpg";
import chocolateCake from "@/assets/chocolate-cake.jpg";
import redVelvetCake from "@/assets/red-velvet-cake.jpg";
import carrotCake from "@/assets/carrot-cake.jpg";
import cupcakes from "@/assets/cupcakes.jpg";
import heroCake from "@/assets/hero-cake.jpg";

const cakeImages = [
  { src: buttercreamCake, title: "Elegant Buttercream" },
  { src: chocolateCake, title: "Rich Chocolate" },
  { src: redVelvetCake, title: "Classic Red Velvet" },
  { src: carrotCake, title: "Spiced Carrot" },
  { src: cupcakes, title: "Artisan Cupcakes" },
  { src: heroCake, title: "Celebration Cake" },
];

// Double the array for seamless loop
const duplicatedImages = [...cakeImages, ...cakeImages];

export function WorkShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-16 md:py-24 bg-secondary/30 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Our Wall of Work
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the cakes we've lovingly crafted for our wonderful clients
          </p>
        </motion.div>
      </div>

      {/* First row - scrolls left */}
      <div className="relative mb-6">
        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, -50 * cakeImages.length * 16],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedImages.map((cake, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 w-64 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={cake.src}
                alt={cake.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second row - scrolls right */}
      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{
            x: [-50 * cakeImages.length * 16, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
        >
          {duplicatedImages.reverse().map((cake, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 w-64 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={cake.src}
                alt={cake.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
