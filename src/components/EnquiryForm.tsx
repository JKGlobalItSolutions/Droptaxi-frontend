import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiClient, calculateFare } from "@/api";
import emailjs from "@emailjs/browser";

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
    { type: 'economy', rate: 12, fixedPrice: 150 },
    { type: 'premium', rate: 15, fixedPrice: 300 },
    { type: 'suv', rate: 18, fixedPrice: 500 }
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
      const totalPrice = Math.round(vehiclePricing.rate * distanceKm);
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
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData: BookingData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        pickup: formData.pickup.trim(),
        drop: formData.drop.trim(),
        vehicleType: formData.vehicleType,
        date: formData.date,
        message: formData.message?.trim() || "",
      };

      if (distance) bookingData.distance = distance;
      if (calculatedPrice) bookingData.calculatedPrice = calculatedPrice;

      const response = await submitBooking(bookingData);

      if (!response?.success) {
        throw new Error(response?.message || "Booking failed");
      }

      toast({
        title: "Booking Submitted!",
        description: response.message || "We'll contact you shortly to confirm your booking.",
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
      console.error("Booking submission error:", error?.response?.data || error);

      toast({
        title: "Submission Failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Server error. Please try again later.",
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
                placeholder="+91 98765 43210"
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
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {displayPricings?.map((pricing: Pricing) => (
                  <SelectItem key={pricing.type} value={pricing.type}>
                    {pricing.type.charAt(0).toUpperCase() + pricing.type.slice(1)} - ₹{pricing.rate}/km
                  </SelectItem>
                ))}
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

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryForm;
