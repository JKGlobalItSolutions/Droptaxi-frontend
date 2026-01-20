import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import ImportantNotes from "./ImportantNotes";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { calculateFare } from "@/api";
import emailjs from "@emailjs/browser";
import { calculateSurge, getSurgeLabel } from "../lib/pricing";

type Pricing = {
  type: string;
  rate: number;
  fixedPrice: number;
};

interface EnquiryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeFrom?: string;
  routeTo?: string;
  routePrice?: string;
}

const EnquiryForm = ({
  open,
  onOpenChange,
  routeFrom = "",
  routeTo = "",
  routePrice = "",
}: EnquiryFormProps) => {
  const { toast } = useToast();

  // Fallback/mock pricing data for vehicle types
  const fallbackPricings = [
    { type: 'Sedan', rate: 14, fixedPrice: 17 },
    { type: 'Premium Sedan', rate: 15, fixedPrice: 19 },
    { type: 'SUV', rate: 19, fixedPrice: 23 },
    { type: 'Premium SUV', rate: 21, fixedPrice: 26 }
  ];

  const { data: pricings, isError } = useQuery({
    queryKey: ["pricings"],
    queryFn: async () => {
      try {
        const res = await fetch("https://droptaxi-backend-1.onrender.com/api/pricing");
        if (!res.ok) throw new Error('API response failed');
        return res.json();
      } catch (error) {
        console.warn('API not available, using fallback data');
        return fallbackPricings; // Return mock data on error
      }
    },
  });

  // Use fallback data if API fails or returns empty array
  const displayPricings = (isError || !pricings?.length) ? fallbackPricings : pricings;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: routeFrom,
    drop: routeTo,
    vehicleType: "",
    date: "",
    message: "",
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to calculate distance and price
  const calculatePrice = async (pickup: string, drop: string, vehicleType: string) => {
    if (!pickup || !drop || !vehicleType) {
      setCalculatedPrice(null);
      setDistance(null);
      return;
    }

    try {
      const response = await calculateFare({
        from: pickup,
        to: drop,
        category: vehicleType as any, // CarCategory
        tripType: 'oneWay'  // Default to one-way since no trip type in form
      });

      setDistance(response.distanceKm);
      setCalculatedPrice(response.fare);

    } catch (error) {
      console.warn("Fare calculation failed, using fallback");
      // If API fails, use fallback calculation (mock distance)
      const mockDistance = Math.floor(Math.random() * 50) + 10; // Mock 10-60 km
      calculatePriceFromDistance(mockDistance, vehicleType);
    }
  };

  // Update pickup & drop if route changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pickup: routeFrom,
      drop: routeTo,
    }));
    // Recalculate price when routes change
    if (routeFrom && routeTo && formData.vehicleType) {
      calculatePrice(routeFrom, routeTo, formData.vehicleType);
    }
  }, [routeFrom, routeTo, formData.vehicleType]);

  const calculatePriceFromDistance = (distanceKm: number, vehicleType: string) => {
    const vehiclePricing = displayPricings?.find((p: Pricing) => p.type === vehicleType);
    if (vehiclePricing && distanceKm) {
      const surge = calculateSurge(formData.date);
      const basePrice = Math.round(vehiclePricing.rate * distanceKm);
      const totalPrice = Math.round(basePrice * surge);
      setCalculatedPrice(totalPrice);
    } else {
      setCalculatedPrice(null);
    }
  };

  // Recalculate when vehicle type or locations change
  useEffect(() => {
    if (formData.pickup && formData.drop && formData.vehicleType) {
      calculatePrice(formData.pickup, formData.drop, formData.vehicleType);
    } else {
      setCalculatedPrice(null);
      setDistance(null);
    }
  }, [formData.vehicleType, formData.pickup, formData.drop]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.pickup ||
      !formData.drop ||
      !formData.vehicleType ||
      !formData.date
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickup: formData.pickup,
        drop: formData.drop,
        vehicleType: formData.vehicleType,
        date: formData.date,
        message: formData.message || "N/A",
        distance: distance ?? "N/A",
        price: calculatedPrice ?? "N/A",
      };

      const templateParamsWithEmail = {
        ...templateParams,
        to_email: 'selvendhiradroptaxi@gmail.com'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParamsWithEmail,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      await apiClient.post("/api/booking", templateParams).catch(() => { });

      toast({
        title: "Enquiry Sent!",
        description: "Your enquiry has been sent successfully.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        pickup: "",
        drop: "",
        vehicleType: "",
        date: "",
        message: "",
      });

      setCalculatedPrice(null);
      setDistance(null);
      onOpenChange(false);

    } catch (error) {
      console.error("EmailJS Enquiry Error:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to send enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-[500px] 
          bg-background 
          border-border 
          max-h-[90vh] 
          overflow-y-auto 
          p-6
          rounded-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Book Your Ride
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in your details and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup">Pickup Location</Label>
            <Input
              id="pickup"
              placeholder="Pickup location"
              value={formData.pickup}
              onChange={(e) =>
                setFormData({ ...formData, pickup: e.target.value })
              }
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drop">Drop Location</Label>
            <Input
              id="drop"
              placeholder="Drop location"
              value={formData.drop}
              onChange={(e) =>
                setFormData({ ...formData, drop: e.target.value })
              }
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={formData.vehicleType}
              onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="Premium Sedan">Premium Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Premium SUV">Premium SUV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Requirements (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any special requests..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="bg-background border-border min-h-[80px]"
            />
          </div>

          {calculatedPrice && distance && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Distance:</span>
                <span className="font-medium">{distance.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vehicle Type:</span>
                <span className="font-medium capitalize">{formData.vehicleType}</span>
              </div>
              <div className="border-t border-primary/20 pt-2">
                {calculateSurge(formData.date) > 1 && (
                  <div className="text-right mb-1">
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                      {getSurgeLabel(calculateSurge(formData.date))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold text-primary">₹{calculatedPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {routePrice && !calculatedPrice && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">Estimated Price</p>
              <p className="text-2xl font-bold text-primary">{routePrice}</p>
            </div>
          )}
          <ImportantNotes variant="compact" />

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryForm;
