import { MapPin, CreditCard, Car } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Choose Destination",
    description: "First, select your preferred destination and proceed further",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Make Payment",
    description: "We pay attention to every quality in the service we provide to you",
  },
  {
    number: "03",
    icon: Car,
    title: "Ready For Travelling",
    description: "We pay attention to every quality in the service we provide to you",
  },
];

const BookingStepsSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-accent/5 to-primary/5 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            3 Easy Steps for <span className="text-gradient">Book Your Next Trip</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-white p-8 shadow-card border-2 rounded-2xl hover:shadow-primary transition-all duration-300 hover:scale-105 text-center relative"
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {step.number}
              </div>
              
              <div className="bg-primary/10 p-6 rounded-full w-fit mx-auto mb-6">
                <step.icon className="w-12 h-12 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Special Offer Badge */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-[hsl(var(--cta-orange))] to-[hsl(var(--cta-yellow))] text-white px-8 py-4 rounded-full shadow-lg">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium">Get Special Offer</p>
                <p className="text-4xl font-bold">48% Off</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingStepsSection;