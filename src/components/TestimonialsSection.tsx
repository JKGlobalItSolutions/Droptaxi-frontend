import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Chennai",
    rating: 5,
    text: "Excellent service! The driver was punctual and the ride was very comfortable. Highly recommended for long-distance travel.",
  },
  {
    name: "Priya Sharma",
    location: "Bangalore",
    rating: 5,
    text: "I've been using DropTaxi for my weekly trips to Mysore. Always professional and affordable. Great experience every time!",
  },
  {
    name: "Arun Patel",
    location: "Coimbatore",
    rating: 5,
    text: "Best taxi service I've ever used. Clean vehicles, friendly drivers, and reasonable prices. Will definitely book again.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.text}"
              </p>
              
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
