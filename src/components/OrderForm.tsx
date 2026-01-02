import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Sparkles } from "lucide-react";
import { QuotationSurvey } from "./QuotationSurvey";

const cakeTypes = [
  "Buttercream Cake",
  "Chocolate Cake",
  "Red Velvet",
  "Carrot Cake",
  "Cupcakes",
  "Not sure — I need guidance",
];

const occasions = [
  "Birthday",
  "Wedding",
  "Corporate Event",
  "Baby Shower / Gender Reveal",
  "Anniversary",
  "Other",
];

const timeframes = [
  "Within 5 days (rush order)",
  "1–2 weeks",
  "3–4 weeks",
  "More than a month away",
];

export function OrderForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [cakeType, setCakeType] = useState("");
  const [occasion, setOccasion] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  const canContinue = cakeType && occasion && timeframe;

  const handleContinue = () => {
    if (canContinue) {
      setIsSurveyOpen(true);
    }
  };

  const handleSurveyClose = () => {
    setIsSurveyOpen(false);
    // Reset form after successful submission
    setCakeType("");
    setOccasion("");
    setTimeframe("");
  };

  return (
    <>
      <section id="order" className="py-20 md:py-32 bg-gold-gradient" ref={ref}>
        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Request a Custom Cake
            </h2>
            <p className="font-body text-lg text-foreground/70 max-w-xl mx-auto">
              Tell us a bit about your dream cake and we'll guide you through the rest.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-elegant space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Let's Get Started
                  </h3>
                  <p className="font-body text-sm text-foreground/60">
                    Answer 3 quick questions to begin
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cakeType" className="font-body font-medium text-foreground">
                    What type of cake are you looking for? *
                  </Label>
                  <Select value={cakeType} onValueChange={setCakeType}>
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
                  <Label htmlFor="occasion" className="font-body font-medium text-foreground">
                    What is the occasion? *
                  </Label>
                  <Select value={occasion} onValueChange={setOccasion}>
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      {occasions.map((occ) => (
                        <SelectItem key={occ} value={occ} className="font-body">
                          {occ}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe" className="font-body font-medium text-foreground">
                    When do you need the cake? *
                  </Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map((tf) => (
                        <SelectItem key={tf} value={tf} className="font-body">
                          {tf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleContinue}
                disabled={!canContinue}
              >
                Continue to Full Quote
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center font-body text-sm text-foreground/50">
                Takes about 2 minutes to complete
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <QuotationSurvey
        isOpen={isSurveyOpen}
        onClose={handleSurveyClose}
        initialData={{
          cakeType,
          occasion,
          timeframe,
        }}
      />
    </>
  );
}
