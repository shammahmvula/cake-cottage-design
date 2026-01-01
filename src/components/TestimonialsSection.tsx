import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Wedding Client",
    content: "Melody created the most stunning wedding cake for our special day. The buttercream flowers were absolutely breathtaking, and the taste was even better than it looked!",
    rating: 5,
  },
  {
    name: "David K.",
    role: "Corporate Client",
    content: "We've been ordering from The Cake Cottage for all our corporate events. The quality and presentation are consistently excellent. Highly recommended!",
    rating: 5,
  },
  {
    name: "Linda T.",
    role: "Birthday Celebration",
    content: "The chocolate cake was divine! My mother's 60th birthday was made extra special thanks to Melody's incredible creation. Everyone couldn't stop talking about it.",
    rating: 5,
  },
  {
    name: "James O.",
    role: "Anniversary Party",
    content: "From the initial consultation to the delivery, the experience was seamless. The red velvet cake was moist, flavorful, and absolutely gorgeous.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-primary/5" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full font-body">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="font-body text-lg text-foreground/70 max-w-2xl mx-auto">
            Don't just take our word for it — hear from our happy customers.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-elegant">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-muted fill-muted" />
                ))}
              </div>

              <p className="font-body text-lg md:text-xl text-foreground/80 text-center mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>

              <div className="text-center">
                <p className="font-display text-xl font-semibold text-foreground">
                  {testimonials[currentIndex].name}
                </p>
                <p className="font-body text-sm text-primary">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-border"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
