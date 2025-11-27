import { Car, Users, Truck, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import React from "react";
import { CarCategory, carPricingConfig } from "../config/pricing";

interface ServicesSectionProps {
  onServiceSelect: () => void;
}

// Service configurations based on vehicle type
const serviceConfig = {
  "Sedan": {
    icon: Car,
    name: "Sedan",
    description: "Comfortable rides for daily commutes",
    features: ["AC Sedan", "Professional Driver", "Sanitized Daily"],
    image: "/aura(1).webp",
  },
  "Premium Sedan": {
    icon: Users,
    name: "Premium Sedan",
    description: "Luxury experience for special occasions",
    features: ["Premium Sedan", "Extra Comfort", "Complimentary Water"],
    image: "/suzuki(1).webp",
  },
  "SUV": {
    icon: Truck,
    name: "SUV",
    description: "Spacious rides for groups and families",
    features: ["7-Seater SUV", "Extra Luggage Space", "Family Friendly"],
    image: "/ertiga(1).webp",
  },
  "Premium SUV": {
    icon: Truck,
    name: "Premium SUV",
    description: "Premium SUVs for ultimate comfort and luxury",
    features: ["Luxury SUV", "Premium Interior", "VIP Service"],
    image: "/Innova(1).webp",
  },
};

const ServicesSection = ({ onServiceSelect }: ServicesSectionProps) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<CarCategory | null>(null);
  const categories = Object.keys(carPricingConfig) as CarCategory[];

  const handleSymbolClick = (category: CarCategory) => {
    setPreselectedCategory(category);
    setOverlayOpen(true);
  };

  const handleCarSelect = (category: CarCategory) => {
    setSelectedCategory(category);
    setShowBookingForm(true);
  };

  const handleCloseOverlay = () => {
    setOverlayOpen(false);
    setSelectedCategory(null);
    setShowBookingForm(false);
    setPreselectedCategory(null);
  };

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

        {/* Clickable Car Symbols */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Available Vehicles</h3>
          <div className="flex justify-center space-x-8">
            {categories.map((cat) => {
              const config = serviceConfig[cat];
              const IconComponent = config.icon;
              return (
                <button
                  key={cat}
                  onClick={() => handleSymbolClick(cat)}
                  className="flex flex-col items-center p-6 rounded-lg border-2 border-border hover:border-primary transition-all group"
                >
                  <IconComponent className="w-16 h-16 text-primary mb-3" />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Rectangular Overlay */}
        {overlayOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={handleCloseOverlay}>
            <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleCloseOverlay}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-50"
              >
                <X className="w-6 h-6" />
              </button>

              {!showBookingForm ? (
                // Car Selection View - Show single big card if preselected, or all cards otherwise
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-center mb-8">
                    {preselectedCategory ? `Book Your ${serviceConfig[preselectedCategory].name}` : 'Select Your Vehicle'}
                  </h3>

                  {preselectedCategory ? (
                    // Show single big card for preselected category
                    <div className="flex justify-center">
                      <Card className="glass-card p-8 max-w-2xl w-full hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-6 text-center">
                          {/* Car Image */}
                          <div className="w-full mb-6 rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={serviceConfig[preselectedCategory].image}
                              alt={`${serviceConfig[preselectedCategory].name} car`}
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardTitle className="text-3xl">{serviceConfig[preselectedCategory].name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Rates Display */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-lg">
                              <span className="font-medium">One Way:</span>
                              <span className="font-bold text-primary text-lg">₹{carPricingConfig[preselectedCategory].oneWay}/km</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                              <span className="font-medium">Round Trip:</span>
                              <span className="font-bold text-primary text-lg">₹{carPricingConfig[preselectedCategory].roundTrip}/km</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-muted-foreground">Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {serviceConfig[preselectedCategory].features.map((feature, idx) => (
                                <span key={idx} className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Description */}
                          <div className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                            <div className="mb-2 font-medium">Minimum charges:</div>
                            Minimum: Oneway 130 km with AC<br />
                            Minimum: Roundtrip 250 km with AC<br />
                            <div className="mt-2 font-medium">Additional charges:</div>
                            Toll, parking, Hills charges, state permit, Over Luggage carrier and pet charges if any extra
                          </div>

                          <Button className="w-full py-4 text-lg font-semibold" onClick={() => handleCarSelect(preselectedCategory)}>
                            Select {serviceConfig[preselectedCategory].name}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    // Show all cards grid (fallback if no preselection)
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categories.map((cat) => {
                        const config = serviceConfig[cat];
                        const IconComponent = config.icon;
                        return (
                          <Card
                            key={cat}
                            className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => handleCarSelect(cat)}
                          >
                            <CardHeader className="pb-4">
                              <div className="bg-primary/10 p-4 rounded-lg w-fit mb-4">
                                <IconComponent className="w-12 h-12 text-primary" />
                              </div>
                              <CardTitle className="text-xl">{config.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Rates Display */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span>One Way:</span>
                                  <span className="font-semibold">₹{carPricingConfig[cat].oneWay}/km</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span>Round Trip:</span>
                                  <span className="font-semibold">₹{carPricingConfig[cat].roundTrip}/km</span>
                                </div>
                              </div>

                              {/* Description */}
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Minimum: Oneway 130 km with AC<br />
                                Minimum: Roundtrip 250 km with AC<br />
                                Toll, parking, Hills charges, state permit, Over Luggage carrier and pet charges if any extra
                              </div>

                              <Button className="w-full">Select {config.name}</Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Booking Form View
                <div className="p-8">
                  {selectedCategory && (
                    <>
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold">Book Your {serviceConfig[selectedCategory].name}</h3>
                        <p className="text-muted-foreground mt-2">
                          One Way: ₹{carPricingConfig[selectedCategory].oneWay}/km |
                          Round Trip: ₹{carPricingConfig[selectedCategory].roundTrip}/km
                        </p>
                      </div>

                      <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Booking Form Fields - reusing the same structure */}
                            <div className="space-y-2">
                              <Label>Pickup Location</Label>
                              <Input placeholder="Enter pickup location" />
                            </div>
                            <div className="space-y-2">
                              <Label>Drop Location</Label>
                              <Input placeholder="Enter drop location" />
                            </div>
                            <div className="space-y-2">
                              <Label>Trip Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select trip type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="oneWay">One Way</SelectItem>
                                  <SelectItem value="roundTrip">Round Trip</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Date & Time</Label>
                              <Input type="datetime-local" />
                            </div>
                          </div>

                          <Button className="w-full mt-8 bg-primary hover:bg-primary/90">
                            Book Your {serviceConfig[selectedCategory].name}
                          </Button>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
