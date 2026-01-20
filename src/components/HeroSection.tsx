import { MapPin, Calendar, Phone, User, PhoneCall, Info } from "lucide-react";
import ImportantNotes from "./ImportantNotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bgGif from "../assets/gif.gif";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getPricing, PricingData } from "@/api";
import { CarCategory, carPricingConfig } from "@/Config/pricing";
import { POPULAR_CITIES, AVAILABLE_CITIES, calculateRealDistance, estimateDistanceFromNames, geocodeLocation } from "../lib/distance";
import { calculateSurge, getSurgeLabel } from "../lib/pricing";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import emailjs from "@emailjs/browser";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://droptaxi-backend-1.onrender.com/api";

/* ---------------- Date & Time Picker ---------------- */
const DateTimePicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
  const [time, setTime] = useState<string>(value ? value.split("T")[1]?.substring(0, 5) || "09:00" : "09:00");
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && time) {
      onChange(`${format(selectedDate, "yyyy-MM-dd")}T${time}:00`);
    }
  };

  const handleTimeChange = (selectedTime: string) => {
    setTime(selectedTime);
    if (date) {
      onChange(`${format(date, "yyyy-MM-dd")}T${selectedTime}:00`);
    }
    setIsOpen(false); // Close after selecting time
  };

  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    const hh = h.toString().padStart(2, '0');
    const period = h < 12 ? 'AM' : 'PM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const timeValue = `${hh}:00`;
    const timeLabel = `${displayH}:00 ${period}`;
    timeOptions.push({ value: timeValue, label: timeLabel });

    const timeValueHalf = `${hh}:30`;
    const timeLabelHalf = `${displayH}:30 ${period}`;
    timeOptions.push({ value: timeValueHalf, label: timeLabelHalf });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start h-12 border-primary/20 hover:border-primary/50 transition-colors">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          {value ? format(new Date(value), "PPP p") : <span className="text-muted-foreground">Pick date & time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[1001]" align="start">
        <div className="flex flex-col items-center space-y-4 p-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
          <div className="w-full pt-4 border-t flex items-center justify-between">
            <span className="text-sm font-medium">Select Time:</span>
            <Select value={time} onValueChange={handleTimeChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[1002] max-h-[300px]">
                {timeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ---------------- AUTO FIT MAP BOUNDS ---------------- */
const FitBounds = ({ pickupCoords, dropCoords }: any) => {
  const map = useMap();

  useEffect(() => {
    if (pickupCoords && dropCoords) {
      const bounds = L.latLngBounds(
        [pickupCoords[1], pickupCoords[0]],
        [dropCoords[1], dropCoords[0]]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickupCoords, dropCoords, map]);

  return null;
};

/* ---------------- HERO SECTION ---------------- */
const HeroSection = ({ onFormSubmit }: any) => {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [tripType, setTripType] = useState("One Way");

  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<any[]>([]);

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSelectingCityRef = useRef(false);

  const fallbackPricings = [
    { type: "Sedan", rate: 14, fixedPrice: 17 },
    { type: "Premium Sedan", rate: 15, fixedPrice: 19 },
    { type: "SUV", rate: 19, fixedPrice: 23 },
    { type: "Premium SUV", rate: 21, fixedPrice: 26 },
  ];

  const { data: pricings = fallbackPricings } = useQuery({
    queryKey: ["pricings"],
    queryFn: getPricing,
    staleTime: 0, // Ensure we always fetch fresh data
  });

  const displayPricings = fallbackPricings.map(fallback => {
    const apiPricing = (pricings || []).find(p => p.type?.toLowerCase() === fallback.type.toLowerCase());
    return apiPricing ? { ...fallback, ...apiPricing } : fallback;
  });

  // Manually ensure the order requested: Sedan, Premium Sedan, SUV, Premium SUV
  // Using case-insensitive search to ensure they show up even if API case differs
  const orderedPricings = [
    displayPricings.find(p => p.type?.toLowerCase() === "sedan"),
    displayPricings.find(p => p.type?.toLowerCase() === "premium sedan"),
    displayPricings.find(p => p.type?.toLowerCase() === "suv"),
    displayPricings.find(p => p.type?.toLowerCase() === "premium suv"),
  ].filter(Boolean);

  const calculateSurgeValue = () => {
    return calculateSurge(dateTime);
  };

  const fetchCities = async (text: string) => {
    if (text.length < 3) return [];
    try {
      const apiKey = import.meta.env.VITE_ORS_API_KEY;
      if (!apiKey) return [];
      const res = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(text)}&boundary.country=IN&size=10`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.features || [];
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    if (pickupLocation.length >= 3 && !isSelectingCityRef.current) {
      fetchCities(pickupLocation).then(setPickupSuggestions).catch(() => setPickupSuggestions([]));
    } else if (pickupLocation.length < 3) {
      setPickupSuggestions([]);
    }
  }, [pickupLocation]);

  useEffect(() => {
    if (dropLocation.length >= 3 && !isSelectingCityRef.current) {
      fetchCities(dropLocation).then(setDropSuggestions).catch(() => setDropSuggestions([]));
    } else if (dropLocation.length < 3) {
      setDropSuggestions([]);
    }
  }, [dropLocation]);

  const getDistanceAndRoute = async () => {
    if (!pickupLocation || !dropLocation || !vehicleType) return;
    try {
      setLoadingDistance(true);
      const km = await calculateRealDistance(pickupLocation, dropLocation);
      setDistance(km);
      setEta("Distance calculated");

      const surge = calculateSurgeValue();
      setSurgeMultiplier(surge);

      const selectedVehicle = displayPricings.find((p: any) => p.type === vehicleType);
      if (!selectedVehicle) throw new Error("Vehicle pricing not found");

      const rate = tripType === "Round Trip" ? selectedVehicle.fixedPrice : selectedVehicle.rate;
      if (!rate || rate <= 0) throw new Error("Invalid vehicle pricing");

      const basePrice = tripType === "Round Trip"
        ? Math.round(km * 2 * rate)
        : Math.round(km * rate);
      const finalPrice = Math.round(basePrice * surge);
      setCalculatedPrice(finalPrice);
    } catch (e) {
      setDistance(null);
      setCalculatedPrice(null);
      setEta(null);
    } finally {
      setLoadingDistance(false);
    }
  };

  useEffect(() => {
    if (pickupCoords && dropCoords && vehicleType) {
      const timer = setTimeout(() => {
        getDistanceAndRoute();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pickupCoords, dropCoords, vehicleType, tripType]);

  const handleCheckout = async () => {
    if (!userName || !userPhone || !pickupLocation || !dropLocation || !vehicleType || !dateTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const templateParams = {
        name: userName,
        phone: userPhone,
        pickup: pickupLocation,
        drop: dropLocation,
        vehicleType: vehicleType,
        dateTime: format(new Date(dateTime), "PPP p"),
        tripType: tripType,
        distance: distance ? `${distance.toFixed(1)} km` : "N/A",
        price: calculatedPrice ? `₹${calculatedPrice}` : "N/A",
        to_email: 'selvendhiradroptaxi@gmail.com'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast({
        title: "Booking Request Sent!",
        description: "We have received your request and will contact you shortly.",
      });

      // Also call the original prop if provided
      onFormSubmit?.({
        name: userName,
        phone: userPhone,
        pickup: pickupLocation,
        drop: dropLocation,
        vehicleType,
        dateTime,
        distance,
        eta,
        surgeMultiplier,
        calculatedPrice,
        tripType,
      });

    } catch (error) {
      console.error("Checkout Error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error sending your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 px-4 pb-16"
      style={{
        backgroundImage: `url(${bgGif})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="container mx-auto relative z-10 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Premium <span className="text-gradient px-1">Drop Taxi</span>
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/90">
            <a href="tel:+919043508313" className="flex items-center gap-3 text-xl md:text-2xl font-semibold hover:text-primary transition-colors">
              <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" /> (+91) 9043508313
            </a>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <p className="text-lg md:text-xl font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Serving Tamil Nadu & Beyond
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="p-6 md:p-8 backdrop-blur-md bg-white/95 shadow-2xl rounded-3xl border-0 overflow-hidden">
            <div className="flex justify-center p-1 bg-muted/50 rounded-2xl mb-8 w-fit mx-auto border border-primary/10 flex-wrap gap-2">
              {["One Way", "Round Trip"].map(t => (
                <Button
                  key={t}
                  onClick={() => setTripType(t)}
                  variant={tripType === t ? "default" : "ghost"}
                  className={`rounded-xl px-8 py-6 transition-all duration-300 ${tripType === t ? 'shadow-lg' : ''}`}
                >
                  {t}
                </Button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <Input
                    className="pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-xl"
                    placeholder="Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <Input
                    className="pl-10 h-12 bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-xl"
                    placeholder="Contact Number"
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50" />
                  <Input
                    className="pl-10 h-12 bg-white/50 border-primary/20 rounded-xl"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Pickup location"
                  />
                  {pickupSuggestions.length > 0 && (
                    <Card className="absolute bg-white w-full border mt-1 rounded-xl z-[50] shadow-xl overflow-hidden border-primary/10">
                      {pickupSuggestions.map((c, i) => (
                        <div key={i} className="p-3 hover:bg-primary/5 cursor-pointer flex items-center gap-2 border-b last:border-0 border-primary/5"
                          onClick={() => {
                            isSelectingCityRef.current = true;
                            setPickupLocation(c.properties.label);
                            setPickupCoords(c.geometry.coordinates);
                            setPickupSuggestions([]);
                            setTimeout(() => isSelectingCityRef.current = false, 0);
                          }}>
                          <MapPin className="h-4 w-4 text-primary/40" />
                          <span className="text-sm truncate">{c.properties.label}</span>
                        </div>
                      ))}
                    </Card>
                  )}
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-50" />
                  <Input
                    className="pl-10 h-12 bg-white/50 border-primary/20 rounded-xl"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    placeholder="Drop location"
                  />
                  {dropSuggestions.length > 0 && (
                    <Card className="absolute bg-white w-full border mt-1 rounded-xl z-[50] shadow-xl overflow-hidden border-primary/10">
                      {dropSuggestions.map((c, i) => (
                        <div key={i} className="p-3 hover:bg-primary/5 cursor-pointer flex items-center gap-2 border-b last:border-0 border-primary/5"
                          onClick={() => {
                            isSelectingCityRef.current = true;
                            setDropLocation(c.properties.label);
                            setDropCoords(c.geometry.coordinates);
                            setDropSuggestions([]);
                            setTimeout(() => isSelectingCityRef.current = false, 0);
                          }}>
                          <MapPin className="h-4 w-4 text-primary/40" />
                          <span className="text-sm truncate">{c.properties.label}</span>
                        </div>
                      ))}
                    </Card>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <DateTimePicker value={dateTime} onChange={setDateTime} />
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="h-12 border-primary/20 rounded-xl transition-all">
                    <SelectValue placeholder="Select Vehicle" />
                  </SelectTrigger>
                  <SelectContent className="z-[1001] rounded-xl">
                    {orderedPricings.map((p: any) => {
                      const rate = tripType === "One Way" ? p.rate : (p.fixedPrice || p.rate);
                      return (
                        <SelectItem key={p.type} value={p.type} className="py-3 cursor-pointer">
                          <div className="flex flex-col">
                            <span className="font-semibold">{p.type}</span>
                            <span className="text-xs text-muted-foreground">₹{rate}/km ({tripType})</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <ImportantNotes />

              {loadingDistance && (
                <div className="flex items-center justify-center py-4 gap-3 text-primary font-semibold">
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Calculating fare...
                </div>
              )}

              {!loadingDistance && distance !== null && calculatedPrice !== null && (
                <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 space-y-3 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-medium">Distance Estimate:</span>
                    <span className="font-bold text-primary">
                      {tripType === "Round Trip" ? (distance * 2).toFixed(1) : distance.toFixed(1)} km
                    </span>
                  </div>
                  <div className="border-t border-primary/10 pt-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-sm text-muted-foreground font-medium block">Total Estimate:</span>
                        {surgeMultiplier > 1 && (
                          <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                            {getSurgeLabel(surgeMultiplier)}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-black text-primary drop-shadow-sm">₹{calculatedPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl transition-all active:scale-[0.98]"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Book & Checkout Now"}
              </Button>
            </div>
          </Card>

          <div className="h-full block">
            {pickupCoords && dropCoords ? (
              <div className="h-[350px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative group">
                <MapContainer
                  // @ts-ignore - Leaflet types sometimes mismatch with MapContainerProps in certain versions
                  center={[pickupCoords[1], pickupCoords[0]] as [number, number]}
                  zoom={7}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[pickupCoords[1], pickupCoords[0]]} />
                  <Marker position={[dropCoords[1], dropCoords[0]]} />
                  {routeLine.length > 0 && <Polyline positions={routeLine} pathOptions={{ color: 'blue', weight: 4 }} />}
                  <FitBounds pickupCoords={pickupCoords} dropCoords={dropCoords} />
                </MapContainer>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-lg border border-primary/10">
                  Live Route Tracking
                </div>
              </div>
            ) : (
              <div className="h-[300px] lg:h-[550px] rounded-3xl bg-white/10 backdrop-blur-md border-2 border-dashed border-white/30 flex items-center justify-center p-8 lg:p-12 text-center">
                <div className="space-y-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-white">
                    <MapPin className="h-6 w-6 lg:h-8 lg:h-8" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white">Route Visualization</h3>
                  <p className="text-white/60 text-sm lg:text-base">Enter your pickup and drop locations to see your trip on the map and get an instant fare estimate.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
