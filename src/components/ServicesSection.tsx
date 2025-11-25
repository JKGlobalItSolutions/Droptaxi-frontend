import { Car, Users, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

// Service configurations based on vehicle type
const serviceConfig = {
  economy: {
    icon: Car,
    name: "Economy",
    description: "Comfortable rides for daily commutes",
    features: ["AC Sedan", "Professional Driver", "Sanitized Daily"],
  },
  premium: {
    icon: Users,
    name: "Premium",
    description: "Luxury experience for special occasions",
    features: ["Premium Sedan", "Extra Comfort", "Complimentary Water"],
  },
  suv: {
    icon: Truck,
    name: "SUV",
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
    { type: 'economy', rate: 12, fixedPrice: 150 },
    { type: 'premium', rate: 15, fixedPrice: 300 },
    { type: 'suv', rate: 18, fixedPrice: 500 }
  ];

  const { data: pricings = [], error, isError } = useQuery({
    queryKey: ["pricings"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/pricing`);
        if (!res.ok) throw new Error('API response failed');
        return res.json();
      } catch (error) {
        console.warn('API not available, using fallback data');
        return fallbackPricings; // Return mock data on error
      }
    },
  });

  // Use fallback data if API fails or returns empty array
  const displayPricings = (isError || !pricings.length) ? fallbackPricings : pricings;

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
          {displayPricings.map((pricing: any) => {
            const config = serviceConfig[pricing.type as keyof typeof serviceConfig];
            if (!config) return null;
            
            const IconComponent = config.icon;
            
            return (
              <Card
                key={pricing.type}
                className="glass-card p-8 hover:scale-105 transition-transform duration-300"
              >
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
