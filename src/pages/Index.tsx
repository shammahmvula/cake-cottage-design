import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { CakesSection } from "@/components/CakesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { OrderForm } from "@/components/OrderForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <CakesSection />
      <TestimonialsSection />
      <OrderForm />
      <Footer />
    </main>
  );
};

export default Index;
