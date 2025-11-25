import { Shield, Clock, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All our drivers are verified and vehicles are regularly inspected for your safety.",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Book rides anytime, anywhere. We're always ready to serve you.",
  },
  {
    icon: DollarSign,
    title: "Affordable Rates",
    description: "Transparent pricing with no hidden charges. Get the best value for your money.",
  },
  {
    icon: Users,
    title: "Professional Drivers",
    description: "Experienced and courteous drivers committed to your comfort and satisfaction.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">DropTaxi</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best taxi service experience in India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
