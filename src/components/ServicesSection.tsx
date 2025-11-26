import { Car, Users, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import suzuki1 from "../assets/suzuki(1).webp";
import suzuki2 from "../assets/suzuki(2).webp";
import aura1 from "../assets/aura(1).webp";
import aura2 from "../assets/aura(2).webp";
import ertiga1 from "../assets/ertiga(1).webp";
import ertiga2 from "../assets/ertiga(2).webp";
import ertiga3 from "../assets/ertiga(3).webp";
import ertiga4 from "../assets/ertiga(4).webp";
import innova1 from "../assets/Innova(1).webp";
import innova2 from "../assets/Innova(2).webp";
import innova3 from "../assets/Innova(3).webp";
import innova4 from "../assets/Innova(4).webp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

type Pricing = {
  type: string;
  rate: number;
  fixedPrice: number;
};

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

// Service configurations based on vehicle type
const serviceConfig = {
  economy: {
    icon: Car,
    name: "Sedan",
    images: [
      suzuki1,
      suzuki2,
      aura1,
      aura2,
    ],
    description: "Comfortable rides for daily commutes",
    features: ["AC Sedan", "Professional Driver", "Sanitized Daily"],
  },
  premium: {
    icon: Users,
    name: "Premium Sedan",
    images: [
      ertiga1,
      ertiga2,
      ertiga3,
      ertiga4,
    ],
    description: "Luxury experience for special occasions",
    features: ["Premium Sedan", "Extra Comfort", "Complimentary Water"],
  },
  suv: {
    icon: Truck,
    name: "SUV",
    images: [
      innova1,
      innova2,
      innova3, 
      innova4,
    ],
    description: "Spacious rides for groups and families",
    features: ["7-Seater SUV", "Extra Luggage Space", "Family Friendly"],
  },
};

interface ServicesSectionProps {
  onServiceSelect: () => void;
}

const ServicesSection = ({ onServiceSelect }: ServicesSectionProps) => {
  // Fallback/mock pricing data
  const fallbackPricings = [
    { type: "economy", rate: 12, fixedPrice: 150 },
    { type: "premium", rate: 15, fixedPrice: 300 },
    { type: "suv", rate: 18, fixedPrice: 500 },
  ];

  const { data: pricings = [], isError } = useQuery({
    queryKey: ["pricings"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/pricing`);
        if (!res.ok) throw new Error("API response failed");
        return res.json();
      } catch (error) {
        console.warn("API not available, using fallback data");
        return fallbackPricings;
      }
    },
  });

  // Use fallback if API fails or returns no data
  const displayPricings = isError || !pricings.length ? fallbackPricings : pricings;

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of vehicles to match your needs and budget
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayPricings.map((pricing: Pricing) => {
            const config = serviceConfig[pricing.type as keyof typeof serviceConfig];
            if (!config) return null;

            const IconComponent = config.icon;

            // Create a fresh Autoplay instance per carousel (important!)
            const autoplay = useRef(
              Autoplay({
                delay: 3000,
                stopOnInteraction: false, // This keeps autoplay alive after swipe
              })
            );

            return (
              <Card
                key={pricing.type}
                className="glass-card p-8 hover:scale-105 transition-transform duration-300 overflow-hidden"
              >
                <div className="relative mb-6">
                  <Carousel
                    plugins={[autoplay.current]}
                    opts={{ loop: true }}
                    className="w-full rounded-lg"
                    // Pause on hover (desktop)
                    onMouseEnter={() => autoplay.current.stop()}
                    onMouseLeave={() => autoplay.current.reset()}
                    // Pause on touch (mobile/tablet)
                    onTouchStart={() => autoplay.current.stop()}
                    onTouchEnd={() => autoplay.current.reset()}
                  >
                    <CarouselContent>
                      {config.images.map((image, idx) => (
                        <CarouselItem key={idx}>
                          <img
                            src={image}
                            alt={`${config.name} ${idx + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg w-fit mb-6">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{config.name}</h3>
                <p className="text-muted-foreground mb-4">{config.description}</p>

                <div className="text-3xl font-bold text-primary mb-6">
                  ₹{pricing.rate}
                  <span className="text-sm text-muted-foreground">/km</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {config.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onServiceSelect}
                  className="w-full bg-secondary hover:bg-secondary/90"
                >
                  Select {config.name}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;