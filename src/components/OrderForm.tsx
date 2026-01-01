import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MapPin, Truck, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const cakeTypes = [
  "Buttercream Cake",
  "Chocolate Cake",
  "Red Velvet Cake",
  "Carrot Cake",
  "Cupcakes",
  "Custom Design",
];

export function OrderForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Inquiry Submitted!",
      description: "Thank you for your order inquiry. Melody will get back to you within 24 hours.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
    setDeliveryOption("");
  };

  return (
    <section id="order" className="py-20 md:py-32 bg-gold-gradient" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-secondary bg-secondary/10 rounded-full font-body">
            Place Your Order
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Custom Order <span className="text-primary">Inquiry</span>
          </h2>
          <p className="font-body text-lg text-foreground/70 max-w-2xl mx-auto">
            Ready to create something special? Fill out the form below and we'll get back to you 
            within 24 hours to discuss your dream cake.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 shadow-elegant">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-body font-medium text-foreground">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                    className="h-12 font-body"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact" className="font-body font-medium text-foreground">
                    Phone / WhatsApp *
                  </Label>
                  <Input
                    id="contact"
                    name="contact"
                    type="tel"
                    required
                    placeholder="Your contact number"
                    className="h-12 font-body"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="cakeType" className="font-body font-medium text-foreground">
                    Cake Type *
                  </Label>
                  <Select name="cakeType" required>
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue placeholder="Select cake type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cakeTypes.map((type) => (
                        <SelectItem key={type} value={type} className="font-body">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType" className="font-body font-medium text-foreground">
                    Event / Function
                  </Label>
                  <Input
                    id="eventType"
                    name="eventType"
                    placeholder="e.g., Wedding, Birthday"
                    className="h-12 font-body"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="delivery" className="font-body font-medium text-foreground">
                    Delivery or Pickup *
                  </Label>
                  <Select 
                    name="delivery" 
                    required 
                    value={deliveryOption}
                    onValueChange={setDeliveryOption}
                  >
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup" className="font-body">Pickup from Vaal</SelectItem>
                      <SelectItem value="delivery" className="font-body">Delivery (additional cost)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="font-body font-medium text-foreground">
                    Date Needed *
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="h-12 font-body"
                  />
                </div>
              </div>

              {deliveryOption === "delivery" && (
                <div className="space-y-2 mt-6">
                  <Label htmlFor="location" className="font-body font-medium text-foreground">
                    Delivery Location *
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Your delivery address"
                    className="h-12 font-body"
                    required={deliveryOption === "delivery"}
                  />
                </div>
              )}

              <div className="space-y-2 mt-6">
                <Label htmlFor="notes" className="font-body font-medium text-foreground">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Tell us about your vision, design preferences, serving size, etc."
                  className="min-h-[120px] font-body"
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full mt-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Inquiry
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Pickup Location
                  </h3>
                  <p className="font-body text-foreground/70">
                    Vaal, Johannesburg, South Africa
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Delivery Info
                  </h3>
                  <p className="font-body text-foreground/70">
                    Delivery available at additional cost. Pricing depends on distance and cake size.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Order Lead Time
                  </h3>
                  <p className="font-body text-foreground/70">
                    Please place orders at least 3-5 days in advance. Custom designs may require more time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold text-primary-foreground mb-2">
                Need it faster?
              </h3>
              <p className="font-body text-primary-foreground/80 mb-4">
                WhatsApp us directly for urgent orders or quick questions.
              </p>
              <Button 
                variant="whatsapp" 
                size="default"
                onClick={() => window.open("https://wa.me/27000000000", "_blank")}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
