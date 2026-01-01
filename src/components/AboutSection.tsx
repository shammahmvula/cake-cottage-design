import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Award, Sparkles } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every cake is handcrafted with passion and care, using only the finest ingredients.",
  },
  {
    icon: Award,
    title: "Artisan Excellence",
    description: "Self-taught perfection through years of dedication to the craft of baking.",
  },
  {
    icon: Sparkles,
    title: "Unique Creations",
    description: "Custom designs tailored to your vision for any celebration or event.",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 md:py-32 bg-gold-gradient" ref={ref}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full font-body">
              Our Story
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Meet <span className="text-primary">Melody Manda</span>
            </h2>

            <div className="space-y-4 text-foreground/80 font-body text-lg leading-relaxed">
              <p>
                From a childhood dream to a flourishing passion, The Cake Cottage was born from 
                Melody Manda's lifelong love affair with baking. What started as experimenting 
                in her mother's kitchen has evolved into an artisan bakery celebrated for its 
                exquisite buttercream creations.
              </p>
              <p>
                Self-taught and endlessly dedicated, Melody has mastered the art of transforming 
                simple ingredients into breathtaking cakes that taste as incredible as they look. 
                Her signature buttercream technique has become the hallmark of The Cake Cottage, 
                earning her a devoted following among discerning clients across Johannesburg.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-primary">500+</p>
                <p className="font-body text-sm text-foreground/60">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-secondary">10+</p>
                <p className="font-body text-sm text-foreground/60">Years Baking</p>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-primary">100%</p>
                <p className="font-body text-sm text-foreground/60">Made with Love</p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-card p-6 rounded-2xl shadow-card hover:shadow-elegant transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
