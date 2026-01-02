import { motion } from "framer-motion";
import { useRef, useMemo, useState } from "react";
import { useInView } from "framer-motion";
import { Lightbox } from "./Lightbox";

// User uploaded cupcakes
import colorfulCupcakes from "@/assets/colorful-cupcakes.jpg";
import frozenCupcakes from "@/assets/frozen-cupcakes.jpg";
import daisyCupcakes from "@/assets/daisy-cupcakes.jpg";
import pawPatrolCupcakes from "@/assets/paw-patrol-cupcakes.jpg";
import butterflyCupcakes from "@/assets/butterfly-cupcakes.jpg";
import superheroCupcakes from "@/assets/superhero-cupcakes.jpg";
import superheroBoxedCupcakes from "@/assets/superhero-boxed-cupcakes.jpg";
import blueyCupcakes from "@/assets/bluey-cupcakes.jpg";
import sonicCupcakes from "@/assets/sonic-cupcakes.jpg";
import roseCupcakes from "@/assets/rose-cupcakes.jpg";
import blackGoldCupcakeSet from "@/assets/black-gold-cupcake-set.jpg";

// User uploaded cakes
import popItCake from "@/assets/pop-it-cake.jpg";
import lollipopCake from "@/assets/lollipop-cake.jpg";
import balloonGirlCake from "@/assets/balloon-girl-cake.jpg";
import sofiaPrincessCake from "@/assets/sofia-princess-cake.jpg";
import butterflyPrincessCake from "@/assets/butterfly-princess-cake.jpg";
import starryBirthdayCake from "@/assets/starry-birthday-cake.jpg";
import policeUniformCake from "@/assets/police-uniform-cake.jpg";
import graduationCapCake from "@/assets/graduation-cap-cake.jpg";
import blackGoldGraduationCake from "@/assets/black-gold-graduation-cake.jpg";
import pencilGraduationCake from "@/assets/pencil-graduation-cake.jpg";
import crownBirthdayCake from "@/assets/crown-birthday-cake.jpg";
import kindergartenCake from "@/assets/kindergarten-cake.jpg";
import goldCrownCake from "@/assets/gold-crown-cake.jpg";
import firstGradeCake from "@/assets/first-grade-cake.jpg";
import blueOmbreCake from "@/assets/blue-ombre-birthday-cake.jpg";
import goldWhiteDadCake from "@/assets/gold-white-dad-cake.jpg";
import vintageDripCake from "@/assets/vintage-drip-cake.jpg";
import greenCreamCake from "@/assets/green-cream-birthday-cake.jpg";
import blackGoldElegantCake from "@/assets/black-gold-elegant-cake.jpg";
import tuxedoDadCake from "@/assets/tuxedo-dad-cake.jpg";
import blueGroomCake from "@/assets/blue-groom-cake.jpg";
import goldenJubileeCake from "@/assets/golden-jubilee-cake.jpg";
import threeTierBlueCake from "@/assets/three-tier-blue-cake.jpg";
import cheers50Cake from "@/assets/cheers-50-number-cake.jpg";
import tiAmoHeartCake from "@/assets/ti-amo-heart-cake.jpg";

// All images with category tags for smart shuffling
const allImages = [
  // Cakes
  { src: popItCake, title: "Pop It Butterfly Cake", category: "cake" },
  { src: lollipopCake, title: "Lollipop Dreams Cake", category: "cake" },
  { src: balloonGirlCake, title: "Balloon Princess Cake", category: "cake" },
  { src: sofiaPrincessCake, title: "Sofia Princess Cake", category: "cake" },
  { src: butterflyPrincessCake, title: "Butterfly Princess Cake", category: "cake" },
  { src: starryBirthdayCake, title: "Starry Birthday Cake", category: "cake" },
  { src: policeUniformCake, title: "Police Uniform Cake", category: "cake" },
  { src: graduationCapCake, title: "Graduation Cap Cake", category: "cake" },
  { src: blackGoldGraduationCake, title: "Black & Gold Graduation", category: "cake" },
  { src: pencilGraduationCake, title: "Colorful Pencil Cake", category: "cake" },
  { src: crownBirthdayCake, title: "Royal Crown Cake", category: "cake" },
  { src: kindergartenCake, title: "Kindergarten Grad Cake", category: "cake" },
  { src: goldCrownCake, title: "Gold Crown Birthday", category: "cake" },
  { src: firstGradeCake, title: "First Grade Cake", category: "cake" },
  { src: blueOmbreCake, title: "Blue Ombré Birthday Cake", category: "cake" },
  { src: goldWhiteDadCake, title: "Gold & White Dad Cake", category: "cake" },
  { src: vintageDripCake, title: "Vintage Drip Cake", category: "cake" },
  { src: greenCreamCake, title: "Mint Green Birthday Cake", category: "cake" },
  { src: blackGoldElegantCake, title: "Elegant Black & Gold Cake", category: "cake" },
  { src: tuxedoDadCake, title: "Tuxedo Father's Day Cake", category: "cake" },
  { src: blueGroomCake, title: "Groom To Be Cake", category: "cake" },
  { src: goldenJubileeCake, title: "Golden Jubilee Cake", category: "cake" },
  { src: threeTierBlueCake, title: "Three Tier Blue Cake", category: "cake" },
  { src: cheers50Cake, title: "Cheers to 50 Number Cake", category: "cake" },
  { src: tiAmoHeartCake, title: "Ti Amo Heart Cake", category: "cake" },
  // Cupcakes
  { src: colorfulCupcakes, title: "Rainbow Swirl Cupcakes", category: "cupcake" },
  { src: frozenCupcakes, title: "Frozen Theme Cupcakes", category: "cupcake" },
  { src: daisyCupcakes, title: "Spring Daisy Cupcakes", category: "cupcake" },
  { src: pawPatrolCupcakes, title: "Paw Patrol Cupcakes", category: "cupcake" },
  { src: butterflyCupcakes, title: "Butterfly Garden Cupcakes", category: "cupcake" },
  { src: superheroCupcakes, title: "Superhero Cupcakes", category: "cupcake" },
  { src: superheroBoxedCupcakes, title: "Superhero Gift Box", category: "cupcake" },
  { src: blueyCupcakes, title: "Bluey Cupcakes", category: "cupcake" },
  { src: sonicCupcakes, title: "Sonic Cupcakes", category: "cupcake" },
  { src: roseCupcakes, title: "Rose Swirl Cupcakes", category: "cupcake" },
  { src: blackGoldCupcakeSet, title: "Black & Gold Cupcake Set", category: "cupcake" },
];

// Fisher-Yates shuffle with constraint: no same category adjacent
function shuffleWithConstraint(arr: typeof allImages): typeof allImages {
  const shuffled = [...arr];
  
  // First, do a basic shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Then, fix adjacent same-category items
  for (let i = 0; i < shuffled.length - 1; i++) {
    if (shuffled[i].category === shuffled[i + 1].category) {
      // Find a different category item to swap with
      for (let j = i + 2; j < shuffled.length; j++) {
        if (shuffled[j].category !== shuffled[i].category) {
          [shuffled[i + 1], shuffled[j]] = [shuffled[j], shuffled[i + 1]];
          break;
        }
      }
    }
  }
  
  return shuffled;
}

export function WorkShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Shuffle images once on component mount with memoization
  const shuffledImages = useMemo(() => shuffleWithConstraint(allImages), []);
  
  // Split into two rows
  const midpoint = Math.ceil(shuffledImages.length / 2);
  const row1Images = shuffledImages.slice(0, midpoint);
  const row2Images = shuffledImages.slice(midpoint);
  
  // Duplicate for seamless loop
  const duplicatedRow1 = [...row1Images, ...row1Images];
  const duplicatedRow2 = [...row2Images, ...row2Images];

  const handleImageClick = (image: typeof shuffledImages[0]) => {
    const index = shuffledImages.findIndex(img => img.src === image.src);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
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
              x: [0, -50 * row1Images.length * 16],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {duplicatedRow1.map((cake, index) => (
              <button
                key={`row1-${index}`}
                onClick={() => handleImageClick(cake)}
                className="flex-shrink-0 w-64 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={cake.src}
                  alt={cake.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </button>
            ))}
          </motion.div>
        </div>

        {/* Second row - scrolls right */}
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [-50 * row2Images.length * 16, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 45,
                ease: "linear",
              },
            }}
          >
            {duplicatedRow2.map((cake, index) => (
              <button
                key={`row2-${index}`}
                onClick={() => handleImageClick(cake)}
                className="flex-shrink-0 w-64 md:w-80 aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={cake.src}
                  alt={cake.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <Lightbox
        images={shuffledImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentImageIndex}
      />
    </>
  );
}
