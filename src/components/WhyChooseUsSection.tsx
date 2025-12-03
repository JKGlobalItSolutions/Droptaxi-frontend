import { ShieldCheck, Clock, IndianRupee, Users, Award, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import roundedPic from "../assets/rounded_pic.jpg";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Drop Taxi",
    description: "Reliable and affordable drop taxi service ensuring comfort, safety, and on-time pickup for every ride.",
  },
  {
    icon: Award,
    title: "Mission & Vision",
    description: "To make long-distance travel simple, safe, and affordable through one way taxi and outstation taxi services across South India.",
  },
  {
    icon: Clock,
    title: "24/7 Taxi Support",
    description: "Book rides anytime, anywhere. We're always ready to serve you with round-the-clock availability.",
  },
  {
    icon: IndianRupee,
    title: "Affordable Rates",
    description: "Transparent pricing with no hidden charges. Get the best value for your money.",
  },
];

const stats = [
  {
    icon: MapPin,
    number: "800+",
    label: "Cities Covered",
  },
  {
    icon: Users,
    number: "3500+",
    label: "Happy Customers",
  },
  {
    icon: Award,
    number: "5000+",
    label: "Successful Trips",
  },
  {
    icon: Clock,
    number: "10+",
    label: "Years of Service",
  },
];

const WhyChooseUsSection = () => {
  return (
    <>
      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute top-10 right-10 opacity-10">
          <MapPin className="w-32 h-32 text-primary" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Say Yes! To <span className="text-gradient">Safe Travel</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft hover:shadow-primary transition-shadow duration-300">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white relative">
        {/* Rounded Background Image */}
        <div className="absolute inset-0 flex justify-center items-start pt-16">
          <div className="w-96 h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <img src={roundedPic} alt="Rounded Background Image" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              We Provide <span className="text-gradient">Reliable Taxi Service</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              <strong>Selvendhira Drop Taxi</strong> offers professional One Way Taxi and Drop Taxi services from Tiruvannamalai to more than 800+ destinations across Tamil Nadu, Bangalore, Pondicherry, and Kerala. Enjoy affordable fares, comfortable rides, and experienced drivers dedicated to making your travel smooth and safe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card p-8 hover:shadow-primary transition-all duration-300 border-2 hover:border-primary/30"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-xl flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUsSection;
