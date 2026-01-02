import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Frown, Phone, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Step data definitions
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
  "R850 – R1,500",
  "R1,500 – R2,500",
  "R2,500 – R5,000",
  "R5,000+ (premium/wedding cakes)",
];

const deliveryOptions = [
  "Yes — please include delivery",
  "No — I'll pick up from Vaal",
];

const tierOptions = [
  "Single tier",
  "2 tiers",
  "3 tiers",
  "4+ tiers",
  "Not sure — please advise",
];

const shapeOptions = [
  "Round",
  "Square",
  "Rectangle",
  "Heart",
  "Custom shape",
  "No preference",
];

const flavourOptions = [
  "Vanilla",
  "Chocolate",
  "Red Velvet",
  "Carrot",
  "Lemon",
  "Marble",
  "Other",
];

const fillingOptions = [
  "Buttercream",
  "Cream cheese",
  "Ganache",
  "Fresh cream",
  "Fruit filling",
  "No filling / plain",
  "Not sure — please advise",
];

const finishOptions = [
  "Buttercream (textured or smooth)",
  "Fondant",
  "Naked / semi-naked",
  "Ganache drip",
  "Not sure — please advise",
];

const topperOptions = [
  "Yes — I'll provide them",
  "Yes — please include (describe below)",
  "No decorations needed",
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

const TOTAL_STEPS = 6;

interface QuotationSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    cakeType: string;
    occasion: string;
    timeframe: string;
  };
}

export function QuotationSurvey({ isOpen, onClose, initialData }: QuotationSurveyProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // From intro
    cakeType: initialData.cakeType,
    occasion: initialData.occasion,
    timeframe: initialData.timeframe,
    // Step 1: Order basics
    servingSize: "",
    budget: "",
    delivery: "",
    deliveryLocation: "",
    // Step 2: Size & shape
    tiers: "",
    shape: "",
    customShape: "",
    // Step 3: Flavour & filling
    flavour: "",
    otherFlavour: "",
    filling: "",
    // Step 4: Design
    finish: "",
    toppers: "",
    topperDetails: "",
    referenceLink: "",
    colorTheme: "",
    // Step 5: Confirmations
    confirmations: {} as Record<string, string>,
    // Step 6: Contact
    name: "",
    contact: "",
    email: "",
    notes: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateConfirmation = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      confirmations: { ...prev.confirmations, [id]: value }
    }));
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Trigger confetti when reaching step 6 (congratulations step)
  useEffect(() => {
    if (currentStep === 6 && !isDisqualified && !isSubmitted) {
      // Brand colors: Primary Purple, Secondary Green, Muted Gold, Accent Aqua
      const brandColors = ['#8259F0', '#429E69', '#E3D081', '#78E0DC'];
      
      // Fire confetti from both sides
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: brandColors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: brandColors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [currentStep, isDisqualified, isSubmitted]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Don't allow proceeding if budget is under R500
        return formData.servingSize && formData.budget && formData.delivery &&
          formData.budget !== "Under R500" &&
          (!formData.delivery.includes("Yes") || formData.deliveryLocation);
      case 2:
        return formData.tiers && formData.shape &&
          (formData.shape !== "Custom shape" || formData.customShape);
      case 3:
        return formData.flavour && formData.filling &&
          (formData.flavour !== "Other" || formData.otherFlavour);
      case 4:
        return formData.finish && formData.toppers;
      case 5:
        return confirmationQuestions.every(q => formData.confirmations[q.id]);
      case 6:
        return formData.name && formData.contact && formData.email;
      default:
        return true;
    }
  };

  // Check if user passed the terms confirmation
  const hasPassedTerms = () => {
    // Check that all confirmation questions have a "Yes" answer (starts with "Yes")
    return confirmationQuestions.every(q => 
      formData.confirmations[q.id]?.startsWith("Yes")
    );
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      // After step 5 (terms), check if they qualified
      if (currentStep === 5) {
        if (!hasPassedTerms()) {
          setIsDisqualified(true);
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const confirmationNotes = confirmationQuestions
      .map((q) => `${q.id}: ${formData.confirmations[q.id] || "Not answered"}`)
      .join("; ");

    const designDetails = [
      `Tiers: ${formData.tiers}`,
      `Shape: ${formData.shape}${formData.customShape ? ` (${formData.customShape})` : ""}`,
      `Flavour: ${formData.flavour}${formData.otherFlavour ? ` (${formData.otherFlavour})` : ""}`,
      `Filling: ${formData.filling}`,
      `Finish: ${formData.finish}`,
      `Toppers: ${formData.toppers}${formData.topperDetails ? ` - ${formData.topperDetails}` : ""}`,
      formData.referenceLink ? `Reference: ${formData.referenceLink}` : null,
      formData.colorTheme ? `Color/Theme: ${formData.colorTheme}` : null,
    ].filter(Boolean).join("\n");

    const combinedNotes = [
      `Budget: ${formData.budget}`,
      `Serving Size: ${formData.servingSize}`,
      `Timeframe: ${formData.timeframe}`,
      "",
      "=== Design Details ===",
      designDetails,
      "",
      `Confirmations: ${confirmationNotes}`,
      "",
      formData.notes ? `Additional Notes: ${formData.notes}` : null,
    ].filter(Boolean).join("\n");

    const needsDelivery = formData.delivery.includes("Yes");

    const inquiryData = {
      name: formData.name,
      contact: formData.contact,
      cake_type: formData.cakeType,
      event_type: formData.occasion,
      delivery_option: needsDelivery ? "delivery" : "pickup",
      delivery_location: needsDelivery ? formData.deliveryLocation : null,
      date_needed: new Date().toISOString().split('T')[0],
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

  const handleClose = () => {
    setCurrentStep(1);
    setIsSubmitted(false);
    setIsDisqualified(false);
    setFormData({
      cakeType: "",
      occasion: "",
      timeframe: "",
      servingSize: "",
      budget: "",
      delivery: "",
      deliveryLocation: "",
      tiers: "",
      shape: "",
      customShape: "",
      flavour: "",
      otherFlavour: "",
      filling: "",
      finish: "",
      toppers: "",
      topperDetails: "",
      referenceLink: "",
      colorTheme: "",
      confirmations: {},
      name: "",
      contact: "",
      email: "",
      notes: "",
    });
    onClose();
  };

  // Check if budget is too low
  const isBudgetTooLow = formData.budget === "Under R500";

  const stepTitles = [
    "Order Basics",
    "Size & Shape",
    "Flavour & Filling",
    "Design & Decoration",
    "Confirm Terms",
    "Contact Details",
  ];

  const renderStepContent = () => {
    // Disqualification screen
    if (isDisqualified) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <Frown className="w-10 h-10 text-destructive" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            We're Not the Right Fit Right Now
          </h3>
          <p className="font-body text-foreground/70 mb-4">
            Thank you for your interest in Melody's Cakes! Unfortunately, based on your responses, 
            we may not be the best match for your current needs.
          </p>
          <p className="font-body text-foreground/70 mb-6">
            Our custom cakes require a mutual understanding of our crafting process, including deposits, 
            lead times, and the artisan nature of our work. If you'd like to reconsider and agree to 
            our terms, we'd love to work with you in the future.
          </p>
          <p className="font-body text-sm text-foreground/50 mb-6">
            Have questions? Give Melody a call to discuss your needs.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDisqualified(false);
                setFormData(prev => ({ ...prev, confirmations: {} }));
              }}
            >
              Go Back & Reconsider
            </Button>
            <Button 
              variant="hero" 
              asChild
            >
              <a href="tel:+27820738247">
                <Phone className="w-4 h-4 mr-2" />
                Call Melody
              </a>
            </Button>
            <Button variant="ghost" onClick={handleClose} className="text-foreground/60">
              Close
            </Button>
          </div>
        </motion.div>
      );
    }

    if (isSubmitted) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Thank You!
          </h3>
          <p className="font-body text-foreground/70 mb-6">
            Your inquiry has been submitted successfully. We'll review your request and send you a quotation within 24 hours.
          </p>
          <Button variant="hero" onClick={handleClose}>
            Close
          </Button>
        </motion.div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Step 1: Order Basics */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  How many people should the cake serve? *
                </Label>
                <Select value={formData.servingSize} onValueChange={(v) => updateFormData("servingSize", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select serving size" />
                  </SelectTrigger>
                  <SelectContent>
                    {servingSizes.map((size) => (
                      <SelectItem key={size} value={size} className="font-body">{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  What is your budget range? *
                </Label>
                <Select value={formData.budget} onValueChange={(v) => updateFormData("budget", v)}>
                  <SelectTrigger className={`h-12 font-body ${isBudgetTooLow ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((budget) => (
                      <SelectItem key={budget} value={budget} className="font-body">{budget}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isBudgetTooLow && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2"
                  >
                    <p className="text-destructive text-sm font-body font-medium">
                      ⚠️ Unfortunately, we don't currently offer custom cakes under R500. Our artisan cakes 
                      start at R500 due to the quality ingredients and craftsmanship involved. Please select 
                      a higher budget range to continue, or feel free to reach out if you have questions!
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Will you need delivery? *
                </Label>
                <Select value={formData.delivery} onValueChange={(v) => updateFormData("delivery", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select delivery option" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryOptions.map((option) => (
                      <SelectItem key={option} value={option} className="font-body">{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.delivery.includes("Yes") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label className="font-body font-medium text-foreground">
                    Delivery Location *
                  </Label>
                  <Input
                    value={formData.deliveryLocation}
                    onChange={(e) => updateFormData("deliveryLocation", e.target.value)}
                    placeholder="Enter your delivery address"
                    className="h-12 font-body"
                  />
                </motion.div>
              )}
            </>
          )}

          {/* Step 2: Size & Shape */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  How many tiers do you need? *
                </Label>
                <Select value={formData.tiers} onValueChange={(v) => updateFormData("tiers", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select number of tiers" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map((tier) => (
                      <SelectItem key={tier} value={tier} className="font-body">{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  What shape do you prefer? *
                </Label>
                <Select value={formData.shape} onValueChange={(v) => updateFormData("shape", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select cake shape" />
                  </SelectTrigger>
                  <SelectContent>
                    {shapeOptions.map((shape) => (
                      <SelectItem key={shape} value={shape} className="font-body">{shape}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.shape === "Custom shape" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label className="font-body font-medium text-foreground">
                    Describe your custom shape *
                  </Label>
                  <Input
                    value={formData.customShape}
                    onChange={(e) => updateFormData("customShape", e.target.value)}
                    placeholder="e.g. Number 5, Car shape, etc."
                    className="h-12 font-body"
                  />
                </motion.div>
              )}
            </>
          )}

          {/* Step 3: Flavour & Filling */}
          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  What cake flavour do you want? *
                </Label>
                <Select value={formData.flavour} onValueChange={(v) => updateFormData("flavour", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select cake flavour" />
                  </SelectTrigger>
                  <SelectContent>
                    {flavourOptions.map((flavour) => (
                      <SelectItem key={flavour} value={flavour} className="font-body">{flavour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.flavour === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label className="font-body font-medium text-foreground">
                    Specify your flavour *
                  </Label>
                  <Input
                    value={formData.otherFlavour}
                    onChange={(e) => updateFormData("otherFlavour", e.target.value)}
                    placeholder="e.g. Strawberry, Coffee, etc."
                    className="h-12 font-body"
                  />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  What filling would you like? *
                </Label>
                <Select value={formData.filling} onValueChange={(v) => updateFormData("filling", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select filling type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fillingOptions.map((filling) => (
                      <SelectItem key={filling} value={filling} className="font-body">{filling}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 4: Design & Decoration */}
          {currentStep === 4 && (
            <>
              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  What type of finish do you want? *
                </Label>
                <Select value={formData.finish} onValueChange={(v) => updateFormData("finish", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select cake finish" />
                  </SelectTrigger>
                  <SelectContent>
                    {finishOptions.map((finish) => (
                      <SelectItem key={finish} value={finish} className="font-body">{finish}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Do you need any cake toppers or decorations? *
                </Label>
                <Select value={formData.toppers} onValueChange={(v) => updateFormData("toppers", v)}>
                  <SelectTrigger className="h-12 font-body">
                    <SelectValue placeholder="Select topper option" />
                  </SelectTrigger>
                  <SelectContent>
                    {topperOptions.map((topper) => (
                      <SelectItem key={topper} value={topper} className="font-body">{topper}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.toppers.includes("please include") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label className="font-body font-medium text-foreground">
                    Describe the decorations you'd like
                  </Label>
                  <Input
                    value={formData.topperDetails}
                    onChange={(e) => updateFormData("topperDetails", e.target.value)}
                    placeholder="e.g. Edible flowers, sugar figurines, etc."
                    className="h-12 font-body"
                  />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Reference image or design inspiration (link)
                </Label>
                <Input
                  value={formData.referenceLink}
                  onChange={(e) => updateFormData("referenceLink", e.target.value)}
                  placeholder="Paste a Pinterest, Instagram, or other link"
                  className="h-12 font-body"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Colour scheme or theme
                </Label>
                <Input
                  value={formData.colorTheme}
                  onChange={(e) => updateFormData("colorTheme", e.target.value)}
                  placeholder="e.g. Pink and gold, floral theme"
                  className="h-12 font-body"
                />
              </div>
            </>
          )}

          {/* Step 5: Confirmations */}
          {currentStep === 5 && (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {confirmationQuestions.map((q) => (
                <div key={q.id} className="space-y-3 p-4 bg-muted/20 rounded-xl">
                  <Label className="font-body font-medium text-foreground leading-relaxed block text-sm">
                    {q.question} *
                  </Label>
                  <RadioGroup
                    value={formData.confirmations[q.id] || ""}
                    onValueChange={(value) => updateConfirmation(q.id, value)}
                    className="flex flex-col sm:flex-row gap-3"
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
                          className="font-body text-sm text-foreground/80 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}

          {/* Step 6: Contact Details */}
          {currentStep === 6 && (
            <>
              {/* Congratulations banner */}
              <div className="mb-6 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <PartyPopper className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground">You Qualify! 🎉</h4>
                    <p className="font-body text-sm text-foreground/70">
                      Just share your details below to receive your complete quotation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Your Full Name *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 font-body"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Phone Number / WhatsApp *
                </Label>
                <Input
                  value={formData.contact}
                  onChange={(e) => updateFormData("contact", e.target.value)}
                  type="tel"
                  placeholder="Enter your phone number"
                  className="h-12 font-body"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Email Address *
                </Label>
                <Input
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  type="email"
                  placeholder="Enter your email address"
                  className="h-12 font-body"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-body font-medium text-foreground">
                  Any additional details?
                </Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  placeholder="Anything else you'd like us to know..."
                  className="min-h-[100px] font-body"
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-4">
          <DialogTitle className="font-display text-xl text-foreground">
            {isSubmitted ? "Success!" : stepTitles[currentStep - 1]}
          </DialogTitle>
          
          {!isSubmitted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-body text-foreground/60">
                <span>Step {currentStep} of {TOTAL_STEPS}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {renderStepContent()}
        </div>

        {!isSubmitted && (
          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="font-body"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!canProceed()}
                className="font-body"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="font-body"
              >
                {isSubmitting ? "Submitting..." : (
                  <>
                    Get A Quotation
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
