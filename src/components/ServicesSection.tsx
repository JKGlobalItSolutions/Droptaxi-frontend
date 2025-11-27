import { Car, X, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import React from "react";
import { CarCategory, carPricingConfig } from "../config/pricing";
import emailjs from "@emailjs/browser";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/api/apiClient";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import suzuki1 from "../assets/suzuki(1).webp";
import suzuki2 from "../assets/suzuki(2).webp";
import aura1 from "../assets/aura(1).webp";
import aura2 from "../assets/aura(2).webp";
import etios1 from "../assets/etios(1).jpeg";
import etios2 from "../assets/etios(2).jpeg";
import etios3 from "../assets/etios(3).jpeg";
import etios4 from "../assets/etios(4).jpeg";
import ertiga1 from "../assets/ertiga(1).webp";
import ertiga2 from "../assets/ertiga(2).webp";
import ertiga3 from "../assets/ertiga(3).webp";
import ertiga4 from "../assets/ertiga(4).webp";
import innova1 from "../assets/Innova(1).webp";
import innova2 from "../assets/Innova(2).webp";
import innova3 from "../assets/Innova(3).webp";
import innova4 from "../assets/Innova(4).webp";

interface ServicesSectionProps {
  onServiceSelect: () => void;
  prefilledData?: any;
}

// Service configurations based on vehicle type
const serviceConfig = {
  "Sedan": {
    icon: Car,
    iconSize: "w-16 h-16",
    name: "Sedan",
    description: "Comfortable rides for daily commutes",
    features: ["AC Sedan", "Professional Driver", "Sanitized Daily"],
    images: [suzuki1, suzuki2, aura1, aura2],
  },
  "Premium Sedan": {
    icon: Car,
    iconSize: "w-20 h-20",
    name: "Premium Sedan",
    description: "Luxury experience for special occasions",
    features: ["Premium Sedan", "Extra Comfort", "Complimentary Water"],
    images: [etios1, etios2, etios3, etios4],
  },
  "SUV": {
    icon: Car,
    iconSize: "w-20 h-20",
    name: "SUV",
    description: "Spacious rides for groups and families",
    features: ["7-Seater SUV", "Extra Luggage Space", "Family Friendly"],
    images: [ertiga1, ertiga2, ertiga3, ertiga4],
  },
  "Premium SUV": {
    icon: Car,
    iconSize: "w-24 h-24",
    name: "Premium SUV",
    description: "Premium SUVs for ultimate comfort and luxury",
    features: ["Luxury SUV", "Premium Interior", "VIP Service"],
    images: [innova1, innova2, innova3, innova4],
  },
};

// DateTimePicker Component
const DateTimePicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
  const [time, setTime] = useState<string>(value ? value.split('T')[1]?.substring(0, 5) || "09:00" : "09:00");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && time) {
      const dateTimeString = `${format(selectedDate, 'yyyy-MM-dd')}T${time}:00`;
      onChange(dateTimeString);
    }
  };

  const handleTimeChange = (selectedTime: string) => {
    setTime(selectedTime);
    if (date && selectedTime) {
      const dateTimeString = `${format(date, 'yyyy-MM-dd')}T${selectedTime}:00`;
      onChange(dateTimeString);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`
            w-full justify-start text-left font-normal h-10 px-3 py-2
            ${!value && "text-muted-foreground"}
          `}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP p") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Time</Label>
              <Select onValueChange={handleTimeChange} value={time}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00">6:00 AM</SelectItem>
                  <SelectItem value="06:30">6:30 AM</SelectItem>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="07:30">7:30 AM</SelectItem>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="08:30">8:30 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="09:30">9:30 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="10:30">10:30 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="11:30">11:30 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="12:30">12:30 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="13:30">1:30 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="14:30">2:30 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="15:30">3:30 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="16:30">4:30 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                  <SelectItem value="17:30">5:30 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="18:30">6:30 PM</SelectItem>
                  <SelectItem value="19:00">7:00 PM</SelectItem>
                  <SelectItem value="19:30">7:30 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                  <SelectItem value="20:30">8:30 PM</SelectItem>
                  <SelectItem value="21:00">9:00 PM</SelectItem>
                  <SelectItem value="21:30">9:30 PM</SelectItem>
                  <SelectItem value="22:00">10:00 PM</SelectItem>
                  <SelectItem value="22:30">10:30 PM</SelectItem>
                  <SelectItem value="23:00">11:00 PM</SelectItem>
                  <SelectItem value="23:30">11:30 PM</SelectItem>
                  <SelectItem value="00:00">12:00 AM</SelectItem>
                  <SelectItem value="00:30">12:30 AM</SelectItem>
                  <SelectItem value="01:00">1:00 AM</SelectItem>
                  <SelectItem value="01:30">1:30 AM</SelectItem>
                  <SelectItem value="02:00">2:00 AM</SelectItem>
                  <SelectItem value="02:30">2:30 AM</SelectItem>
                  <SelectItem value="03:00">3:00 AM</SelectItem>
                  <SelectItem value="03:30">3:30 AM</SelectItem>
                  <SelectItem value="04:00">4:00 AM</SelectItem>
                  <SelectItem value="04:30">4:30 AM</SelectItem>
                  <SelectItem value="05:00">5:00 AM</SelectItem>
                  <SelectItem value="05:30">5:30 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Simple Carousel Component
const Carousel = ({ category, images }: { category: string; images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-play carousel
  React.useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentIndex]}
        alt={`${category} car ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            ❯
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ServicesSection = ({ onServiceSelect, prefilledData }: ServicesSectionProps) => {
  const { toast } = useToast();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<CarCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = Object.keys(carPricingConfig) as CarCategory[];

  // Form state for booking
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    drop: "",
    dateTime: "",
    passengers: "",
    tripType: "",
    luggage: "",
    specialRequirements: "",
  });

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.pickup || !formData.drop) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        pickup: formData.pickup.trim(),
        drop: formData.drop.trim(),
        vehicleType: selectedCategory || '',
        dateTime: formData.dateTime || 'Not specified',
        passengers: formData.passengers || 'Not specified',
        tripType: formData.tripType || 'Not specified',
        luggage: formData.luggage || 'Not specified',
        specialRequirements: formData.specialRequirements || 'None',
      };

      // Send email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Optional backend call
      try {
        await apiClient.post("/api/booking", templateParams);
      } catch (backendError) {
        console.log("Backend call failed, but email sent successfully");
      }

      toast({
        title: "Booking Submitted Successfully!",
        description: "We'll contact you soon to confirm your booking.",
      });

      // Reset form and close
      setFormData({
        name: "",
        email: "",
        phone: "",
        pickup: "",
        drop: "",
        dateTime: "",
        passengers: "",
        tripType: "",
        luggage: "",
        specialRequirements: "",
      });
      handleCloseOverlay();

    } catch (error) {
      console.error("Booking submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to send booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill form data when user fills home form and selects vehicle
  useEffect(() => {
    if (prefilledData && showBookingForm) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        pickup: prefilledData.pickup || "",
        drop: prefilledData.drop || "",
        dateTime: prefilledData.dateTime || "",
        passengers: "",
        tripType: "",
        luggage: "",
        specialRequirements: "",
      });
    }
  }, [prefilledData, showBookingForm]);

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
                <Car className={config.iconSize || "w-16 h-16 text-primary mb-3"} />
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
                          {/* Car Images Carousel */}
                          <div className="w-full mb-6 rounded-xl overflow-hidden shadow-lg relative">
                            <div className="relative h-64 overflow-hidden">
                              <Carousel category={preselectedCategory!} images={serviceConfig[preselectedCategory!].images} />
                            </div>
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

                          {/* WhatsApp and Call Buttons */}
                          <div className="flex gap-3 mt-4">
                            <Button
                              variant="outline"
                              className="flex-1 flex items-center justify-center gap-2"
                              onClick={() => window.open(`https://wa.me/919585052446`, '_blank')}
                            >
                              <MessageCircle className="w-5 h-5" />
                              WhatsApp
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 flex items-center justify-center gap-2"
                              onClick={() => window.open(`tel:+919585052446`, '_blank')}
                            >
                              <Phone className="w-5 h-5" />
                              Call
                            </Button>
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

                      <form onSubmit={handleFormSubmit} className="w-full">
                        <CardContent className="p-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <Input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email Address</Label>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                              />
                            </div>

                            {/* Travel Details */}
                            <div className="space-y-2">
                              <Label>Pickup Location</Label>
                              <Input
                                placeholder="Enter pickup location"
                                value={formData.pickup}
                                onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Drop Location</Label>
                              <Input
                                placeholder="Enter drop location"
                                value={formData.drop}
                                onChange={(e) => setFormData({...formData, drop: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Date & Time</Label>
                              <DateTimePicker
                                value={formData.dateTime}
                                onChange={(value) => setFormData({...formData, dateTime: value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Number of Passengers</Label>
                              <Select onValueChange={(value) => setFormData({...formData, passengers: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select passengers" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 Passenger</SelectItem>
                                  <SelectItem value="2">2 Passengers</SelectItem>
                                  <SelectItem value="3">3 Passengers</SelectItem>
                                  <SelectItem value="4">4 Passengers</SelectItem>
                                  <SelectItem value="5">5 Passengers</SelectItem>
                                  <SelectItem value="6">6 Passengers</SelectItem>
                                  <SelectItem value="7">7 Passengers</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Trip Type</Label>
                              <Select onValueChange={(value) => setFormData({...formData, tripType: value})}>
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
                              <Label>Luggage</Label>
                              <Select onValueChange={(value) => setFormData({...formData, luggage: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select luggage type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">Light (Hand luggage only)</SelectItem>
                                  <SelectItem value="medium">Medium (1-2 bags)</SelectItem>
                                  <SelectItem value="heavy">Heavy (3+ bags)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Additional Requirements */}
                          <div className="mt-6 space-y-2">
                            <Label>Special Requirements (Optional)</Label>
                            <Textarea
                              placeholder="Any special requests, pet travel, baby seat requirements, etc."
                              value={formData.specialRequirements}
                              onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                              className="min-h-[100px]"
                            />
                          </div>

                          {/* WhatsApp and Call Buttons */}
                          <div className="flex gap-3 mt-6">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 flex items-center justify-center gap-2"
                              onClick={() => window.open(`https://wa.me/919585052446`, '_blank')}
                            >
                              <MessageCircle className="w-5 h-5" />
                              WhatsApp Support
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 flex items-center justify-center gap-2"
                              onClick={() => window.open(`tel:+919585052446`, '_blank')}
                            >
                              <Phone className="w-5 h-5" />
                              Call Support
                            </Button>
                          </div>

                          <Button
                            type="submit"
                            className="w-full mt-6 bg-primary hover:bg-primary/90 text-lg py-4"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : `Book Your ${serviceConfig[selectedCategory].name}`}
                          </Button>
                        </CardContent>
                      </form>
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
