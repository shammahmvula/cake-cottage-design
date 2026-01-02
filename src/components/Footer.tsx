import { motion } from "framer-motion";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/thecakecottage", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/thecakecottage", label: "Facebook" },
];

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Cakes", href: "#cakes" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Order", href: "#order" },
];

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-foreground text-gold-light">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="The Cake Cottage" className="h-16 w-auto mb-4" />
            <p className="font-body text-gold-light/70 mb-6 max-w-md">
              Artisan buttercream cakes handcrafted with love in Vaal, Johannesburg. 
              Every cake tells a story — let us create yours.
            </p>
            <Button 
              variant="gold" 
              size="default"
              onClick={() => window.open("tel:+27662522079")}
            >
              <Phone className="w-4 h-4" />
              Give Us a Call
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-4">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="block font-body text-gold-light/70 hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-4">
              Contact Us
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:hello@thecakecottage.co.za"
                className="flex items-center gap-3 font-body text-gold-light/70 hover:text-gold transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                hello@thecakecottage.co.za
              </a>
              <a
                href="tel:+27662522079"
                className="flex items-center gap-3 font-body text-gold-light/70 hover:text-gold transition-colors"
              >
                <Phone className="w-5 h-5 text-secondary" />
                066 252 2079
              </a>
              <div className="flex items-start gap-3 font-body text-gold-light/70">
                <MapPin className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
                Vaal, Johannesburg, South Africa
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gold-light/10 flex items-center justify-center text-gold-light/70 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-light/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-gold-light/50">
            © {new Date().getFullYear()} The Cake Cottage by Melody Manda. All rights reserved.
          </p>
          <p className="font-display text-sm italic text-gold/60">
            Crafted with love in Johannesburg
          </p>
        </div>
      </div>
    </footer>
  );
}
