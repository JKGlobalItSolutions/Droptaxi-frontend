import { MapPin, Calendar, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CarCategory, carPricingConfig } from "@/config/pricing";
import { format } from "date-fns";

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

type PricingData = {
  type: string;
  rate: number;
  fixedPrice: number;
};

interface HeroSectionProps {
  onFormSubmit?: (formData: any) => void;
}

// DateTimePicker Component for Hero Section
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
          className={`bg-background border-border w-full justify-start text-left font-normal h-10 px-3 py-2 ${
            !value && "text-muted-foreground"
          }`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP p") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
        <div className="p-4">
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Select Time</label>
              <Select onValueChange={handleTimeChange} value={time}>
                <SelectTrigger className="w-32 bg-background">
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

const HeroSection = ({ onFormSubmit }: HeroSectionProps) => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [tripType, setTripType] = useState("One Way");
  const [dateTime, setDateTime] = useState("");

  // Fallback/mock pricing data for vehicle types - updated to new categories
  const fallbackPricings: PricingData[] = [
    { type: 'Sedan', rate: 14, fixedPrice: 150 },
    { type: 'Premium Sedan', rate: 15, fixedPrice: 300 },
    { type: 'SUV', rate: 19, fixedPrice: 500 },
    { type: 'Premium SUV', rate: 21, fixedPrice: 600 }
  ];

  // Fetch pricing data from backend with fallback
  const { data: pricings = [], isError } = useQuery<PricingData[]>({
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
  const displayPricings: PricingData[] = (isError || !pricings?.length) ? fallbackPricings : pricings;

  // -------------------- FETCH DISTANCE USING OPENROUTESERVICE API --------------------
  const calculateRealDistance = async () => {
    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_ORS_API_KEY_HERE') {
      console.warn("OpenRouteService API key not set, using fallback calculation");
      return Math.floor(Math.random() * 50) + 10;
    }

    try {
      // Step 1: Geocode pickup location
      const pickupGeocode = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(pickupLocation.trim())}&format=json&limit=1`
      );

      if (!pickupGeocode.ok) {
        console.warn("ORS geocoding failed for pickup, using fallback");
        return Math.floor(Math.random() * 50) + 10;
      }

      const pickupData = await pickupGeocode.json();
      if (!pickupData.features || pickupData.features.length === 0) {
        console.warn("No geocode results for pickup, using fallback");
        return Math.floor(Math.random() * 50) + 10;
      }

      const pickupCoords = pickupData.features[0].geometry.coordinates;

      // Step 2: Geocode drop location
      const dropGeocode = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(dropLocation.trim())}&format=json&limit=1`
      );

      if (!dropGeocode.ok) {
        console.warn("ORS geocoding failed for drop, using fallback");
        return Math.floor(Math.random() * 50) + 10;
      }

      const dropData = await dropGeocode.json();
      if (!dropData.features || dropData.features.length === 0) {
        console.warn("No geocode results for drop, using fallback");
        return Math.floor(Math.random() * 50) + 10;
      }

      const dropCoords = dropData.features[0].geometry.coordinates;

      // Step 3: Calculate driving distance
      const distanceResponse = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupCoords[0]},${pickupCoords[1]}&end=${dropCoords[0]},${dropCoords[1]}`
      );

      if (!distanceResponse.ok) {
        console.warn("ORS distance calculation failed, using fallback");
        return Math.floor(Math.random() * 50) + 10;
      }

      const distanceData = await distanceResponse.json();

      if (distanceData.features && distanceData.features.length > 0) {
        const distance = distanceData.features[0].properties.segments[0].distance / 1000; // Convert meters to km
        return Math.round(distance * 10) / 10; // Round to 1 decimal
      }

      console.warn("ORS returned no distance results, using fallback");
      return Math.floor(Math.random() * 50) + 10;
    } catch (error) {
      console.error("OpenRouteService API Error:", error);
      return Math.floor(Math.random() * 50) + 10;
    }
  };

  // -------------------- USE EFFECT FOR PRICE CALCULATION --------------------
  useEffect(() => {
    const fetchDistanceAndCalculate = async () => {
      if (pickupLocation && dropLocation && vehicleType) {
        const distanceKm = await calculateRealDistance();

        if (distanceKm && carPricingConfig[vehicleType as CarCategory]) {
          setDistance(distanceKm);
          const rateKey = tripType === "One Way" ? "oneWay" : "roundTrip";
          const rate = carPricingConfig[vehicleType as CarCategory][rateKey];
          const estimatedPrice = Math.round(distanceKm * rate);
          setCalculatedPrice(estimatedPrice);
        }
      } else {
        setCalculatedPrice(null);
        setDistance(null);
      }
    };

    fetchDistanceAndCalculate();
  }, [pickupLocation, dropLocation, vehicleType, tripType]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 relative z-30">
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
                  {displayPricings.map((pricing: PricingData) => (
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
              <DateTimePicker value={dateTime} onChange={setDateTime} />
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

          <Button
            className="w-full mt-6 bg-primary hover:bg-primary/90 animate-glow"
            onClick={() => {
              if (onFormSubmit) {
                const formData = {
                  pickup: pickupLocation,
                  drop: dropLocation,
                  vehicleType,
                  dateTime,
                  distance,
                  calculatedPrice,
                };
                onFormSubmit(formData);
              }
            }}
          >
            Book Your Ride
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
