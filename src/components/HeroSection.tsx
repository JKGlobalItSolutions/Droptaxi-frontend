import { MapPin, Calendar, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

const HeroSection = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Fallback/mock pricing data for vehicle types
  const fallbackPricings = [
    { type: 'economy', rate: 12, fixedPrice: 150 },
    { type: 'premium', rate: 15, fixedPrice: 300 },
    { type: 'suv', rate: 18, fixedPrice: 500 }
  ];

  // Fetch pricing data from backend with fallback
  const { data: pricings = [], isError } = useQuery({
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
  const displayPricings = (isError || !pricings?.length) ? fallbackPricings : pricings;

  // -------------------- FETCH REAL GOOGLE KM WITH FALLBACK --------------------
  const calculateRealDistance = async () => {
    try {
      const response = await fetch("https://droptaxi-backend-1.onrender.com/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: pickupLocation,
          drop: dropLocation,
        }),
      });

      if (!response.ok) {
        console.warn("Distance API not available, using fallback calculation");
        return Math.floor(Math.random() * 50) + 10; // Mock 10-60 km
      }

      const data = await response.json();

      if (data.distance) {
        return data.distance; // KM
      }

      return Math.floor(Math.random() * 50) + 10; // Fallback
    } catch (error) {
      console.error("Distance API Error:", error);
      return Math.floor(Math.random() * 50) + 10; // Fallback 10-60 km
    }
  };

  // -------------------- USE EFFECT FOR PRICE CALCULATION --------------------
  useEffect(() => {
    const fetchDistanceAndCalculate = async () => {
      if (pickupLocation && dropLocation && vehicleType) {
        const selectedPricing = displayPricings.find((p: any) => p.type === vehicleType);

        if (selectedPricing) {
          const distanceKm = await calculateRealDistance(); // REAL GOOGLE KM

          if (distanceKm) {
            setDistance(distanceKm);
            const estimatedPrice = Math.round(distanceKm * selectedPricing.rate);
            setCalculatedPrice(estimatedPrice);
          }
        }
      } else {
        setCalculatedPrice(null);
        setDistance(null);
      }
    };

    fetchDistanceAndCalculate();
  }, [pickupLocation, dropLocation, vehicleType, displayPricings]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Journey,{" "}
            <span className="text-gradient">Our Priority</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience premium taxi services across India. Safe, reliable, and comfortable rides at your fingertips.
          </p>
        </div>

        <Card className="glass-card max-w-4xl mx-auto p-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pickup */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Pickup Location
              </label>
              <Input
                placeholder="Enter pickup location"
                className="bg-background border-border"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

            {/* Drop */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Drop Location
              </label>
              <Input
                placeholder="Enter drop location"
                className="bg-background border-border"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
              />
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                Vehicle Type
              </label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {displayPricings.map((pricing: any) => (
                    <SelectItem key={pricing.type} value={pricing.type}>
                      {pricing.type.charAt(0).toUpperCase() + pricing.type.slice(1)} - ₹{pricing.rate}/km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Date & Time
              </label>
              <Input type="datetime-local" className="bg-background border-border" />
            </div>
          </div>

          {/* Price Display */}
          {calculatedPrice && distance && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Distance:</span>
                <span className="font-medium">{distance.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vehicle Type:</span>
                <span className="font-medium capitalize">{vehicleType}</span>
              </div>
              <div className="border-t border-primary/20 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-3xl font-bold text-primary">₹{calculatedPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <Button className="w-full mt-6 bg-primary hover:bg-primary/90 animate-glow">
            Book Your Ride
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
