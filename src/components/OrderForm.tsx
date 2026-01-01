import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const servingSizes = [
  "10–20 guests",
  "20–50 guests",
  "50–100 guests",
  "100+ guests",
];

const timeframes = [
  "Within 5 days (rush order)",
  "1–2 weeks",
  "3–4 weeks",
  "More than a month away",
];

const budgetRanges = [
  "Under R500",
  "R500 – R1,000",
  "R1,000 – R2,500",
  "R2,500 – R5,000",
  "R5,000+ (premium/wedding cakes)",
];

const deliveryOptions = [
  "Yes — please include delivery",
  "No — I'll pick up from Vaal",
];

const confirmationQuestions = [
  {
    id: "deposit",
    question: "Do you understand that custom cakes require a 50% non-refundable deposit to secure your order?",
    options: ["Yes, I understand", "No"],
  },
  {
    id: "rushFees",
    question: "Do you understand that orders requested within 5 days of the event will incur rush fees?",
    options: ["Yes, I understand", "No"],
  },
  {
    id: "pricingBasis",
    question: "Are you aware that cake designs are quoted based on complexity, size, and detail — not just flavour?",
    options: ["Yes, I understand", "No"],
  },
  {
    id: "designVariation",
    question: "Do you agree that final cake designs may vary slightly from reference images due to the handcrafted nature of artisan cakes?",
    options: ["Yes, I understand", "No"],
  },
  {
    id: "deliveryFees",
    question: "Are you prepared to pay delivery fees separately, based on your location distance from Vaal?",
    options: ["Yes, I understand", "No, I'll arrange pickup instead"],
  },
  {
    id: "cancellation",
    question: "Do you understand that cancellations made less than 7 days before the event are non-refundable?",
    options: ["Yes, I understand", "No"],
  },
];

export function OrderForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<string>("");
  const [confirmations, setConfirmations] = useState<Record<string, string>>({});

  const needsDelivery = deliveryOption === "Yes — please include delivery";

  const handleConfirmationChange = (questionId: string, value: string) => {
    setConfirmations((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Build confirmation notes
    const confirmationNotes = confirmationQuestions
      .map((q) => `${q.id}: ${confirmations[q.id] || "Not answered"}`)
      .join("; ");
    
    const additionalNotes = formData.get("notes") as string;
    const combinedNotes = `Budget: ${formData.get("budget")}\nServing Size: ${formData.get("servingSize")}\nTimeframe: ${formData.get("timeframe")}\n\nConfirmations: ${confirmationNotes}\n\n${additionalNotes || ""}`;

    const inquiryData = {
      name: formData.get("name") as string,
      contact: formData.get("contact") as string,
      cake_type: formData.get("cakeType") as string,
      event_type: formData.get("occasion") as string,
      delivery_option: needsDelivery ? "delivery" : "pickup",
      delivery_location: needsDelivery ? (formData.get("deliveryLocation") as string) : null,
      date_needed: new Date().toISOString().split('T')[0], // Default to today, actual date is in timeframe
      additional_notes: combinedNotes,
    };

    const { error } = await supabase
      .from("order_inquiries")
      .insert([inquiryData]);

    if (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or call us directly.",
        variant: "destructive",
      });
    } else {
      setIsSubmitted(true);
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you! We'll send you a quotation within 24 hours.",
      });
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <section id="order" className="py-20 md:py-32 bg-gold-gradient" ref={ref}>
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-12 shadow-elegant"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Thank You!
            </h2>
            <p className="font-body text-lg text-foreground/70 mb-6">
              Your inquiry has been submitted successfully. We'll review your request and send you a quotation within 24 hours.
            </p>
            <Button
              variant="hero"
              onClick={() => {
                setIsSubmitted(false);
                setConfirmations({});
                setDeliveryOption("");
              }}
            >
              Submit Another Inquiry
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 md:py-32 bg-gold-gradient" ref={ref}>
      <div className="container max-w-3xl mx-auto">
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
            Fill in the details below and we'll send you a quotation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 md:p-10 shadow-elegant space-y-10">
            
            {/* Section 1: Order Details */}
            <div className="space-y-6">
              <h3 className="font-display text-xl font-semibold text-foreground border-b border-border pb-3">
                Order Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="cakeType" className="font-body font-medium text-foreground">
                  What type of cake are you looking for? *
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
                <Label htmlFor="occasion" className="font-body font-medium text-foreground">
                  What is the occasion? *
                </Label>
                <Select name="occasion" required>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasions.map((occasion) => (
                      <SelectItem key={occasion} value={occasion} className="font-body">
                        {occasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servingSize" className="font-body font-medium text-foreground">
                  How many people should the cake serve? *
                </Label>
                <Select name="servingSize" required>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select serving size" />
                  </SelectTrigger>
                  <SelectContent>
                    {servingSizes.map((size) => (
                      <SelectItem key={size} value={size} className="font-body">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe" className="font-body font-medium text-foreground">
                  When do you need the cake? *
                </Label>
                <Select name="timeframe" required>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((timeframe) => (
                      <SelectItem key={timeframe} value={timeframe} className="font-body">
                        {timeframe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="font-body font-medium text-foreground">
                  What is your budget range? *
                </Label>
                <Select name="budget" required>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((budget) => (
                      <SelectItem key={budget} value={budget} className="font-body">
                        {budget}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery" className="font-body font-medium text-foreground">
                  Will you need delivery? *
                </Label>
                <Select 
                  name="delivery" 
                  required 
                  value={deliveryOption}
                  onValueChange={setDeliveryOption}
                >
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select delivery option" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryOptions.map((option) => (
                      <SelectItem key={option} value={option} className="font-body">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 2: Confirmation Questions */}
            <div className="space-y-6">
              <h3 className="font-display text-xl font-semibold text-foreground border-b border-border pb-3">
                Please Confirm the Following
              </h3>

              {confirmationQuestions.map((q) => (
                <div key={q.id} className="space-y-3 p-4 bg-muted/20 rounded-xl">
                  <Label className="font-body font-medium text-foreground leading-relaxed block">
                    {q.question} *
                  </Label>
                  <RadioGroup
                    required
                    value={confirmations[q.id] || ""}
                    onValueChange={(value) => handleConfirmationChange(q.id, value)}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    {q.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option} 
                          id={`${q.id}-${option}`}
                          className="border-primary text-primary"
                        />
                        <Label 
                          htmlFor={`${q.id}-${option}`} 
                          className="font-body text-foreground/80 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            {/* Section 3: Contact Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground border-b border-border pb-3">
                  Contact Details
                </h3>
                <p className="font-body text-foreground/60 mt-2">
                  Great! Please provide your contact details and we'll send you a quotation.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="font-body font-medium text-foreground">
                  Your Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="h-12 font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="font-body font-medium text-foreground">
                  Phone Number / WhatsApp *
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  className="h-12 font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-body font-medium text-foreground">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="h-12 font-body"
                />
              </div>

              {needsDelivery && (
                <div className="space-y-2">
                  <Label htmlFor="deliveryLocation" className="font-body font-medium text-foreground">
                    Delivery Location *
                  </Label>
                  <Input
                    id="deliveryLocation"
                    name="deliveryLocation"
                    required={needsDelivery}
                    placeholder="Enter your delivery address"
                    className="h-12 font-body"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes" className="font-body font-medium text-foreground">
                  Any additional details or design inspiration?
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Tell us about your vision, share links to reference images, colors, themes, etc."
                  className="min-h-[120px] font-body"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
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
      </div>
    </section>
  );
}