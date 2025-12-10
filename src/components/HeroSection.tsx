import { MapPin, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bgGif from "../assets/gif.gif";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CarCategory, carPricingConfig } from "@/config/pricing";
import { format } from "date-fns";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "https://droptaxi-backend-1.onrender.com"}/api`;

/* ---------------- Date & Time Picker ---------------- */
const DateTimePicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
  const [time, setTime] = useState<string>(value ? value.split("T")[1]?.substring(0, 5) || "09:00" : "09:00");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && time) onChange(`${format(selectedDate, "yyyy-MM-dd")}T${time}:00`);
  };

  const handleTimeChange = (selectedTime: string) => {
    setTime(selectedTime);
    if (date) onChange(`${format(date, "yyyy-MM-dd")}T${selectedTime}:00`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP p") : "Pick date & time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col items-center space-y-4 p-2">
          <CalendarComponent mode="single" selected={date} onSelect={handleDateSelect} />
          <Select value={time} onValueChange={handleTimeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"].map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [tripType, setTripType] = useState("One Way");

  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<any[]>([]);

  // ✅ Always [lng, lat]
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);


  /* ---------------- Pricing API ---------------- */
  const fallbackPricings = [
    { type: "Sedan", rate: 14, fixedPrice: 17 },
    { type: "Premium Sedan", rate: 15, fixedPrice: 19 },
    { type: "SUV", rate: 19, fixedPrice: 23 },
    { type: "Premium SUV", rate: 21, fixedPrice: 26 },
  ];

  const { data: pricings = fallbackPricings, isError } = useQuery({
    queryKey: ["pricings"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/pricing/`);
        if (!res.ok) throw new Error("fail");
        return res.json();
      } catch {
        return fallbackPricings;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Use live API data when available, fallback to static data
  const displayPricings = pricings.length > 0 ? pricings : fallbackPricings;

  /* ---------------- SURGE LOGIC ---------------- */
  const calculateSurge = () => {
    const now = new Date();
    const hour = now.getHours();

    if ((hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 21)) return 1.25; // Peak hours
    if (hour >= 22 || hour <= 5) return 1.15; // Night
    return 1; // Normal
  };

  /* ---------------- ORS AUTOCOMPLETE ---------------- */
  const fetchCities = async (text: string) => {
    if (text.length < 3) return [];
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${import.meta.env.VITE_ORS_API_KEY}&text=${text}`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.features || [];
    } catch (error) {
      console.warn('Error fetching cities:', error);
      return [];
    }
  };

  useEffect(() => {
    if (pickupLocation.length >= 3) {
      fetchCities(pickupLocation).then(setPickupSuggestions).catch(() => setPickupSuggestions([]));
    } else {
      setPickupSuggestions([]);
    }
  }, [pickupLocation]);

  useEffect(() => {
    if (dropLocation.length >= 3) {
      fetchCities(dropLocation).then(setDropSuggestions).catch(() => setDropSuggestions([]));
    } else {
      setDropSuggestions([]);
    }
  }, [dropLocation]);

  /* ---------------- DISTANCE + ETA + ROUTE ---------------- */
  const getDistanceAndRoute = async () => {
    if (!pickupCoords || !dropCoords || !vehicleType) return;

    try {
      setLoadingDistance(true);

      const res = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          method: "POST",
          headers: {
            Authorization: import.meta.env.VITE_ORS_API_KEY || "",
            "Content-Type": "application/json",
            Accept: "application/json", // ✅ THIS FIXES YOUR 400 ERROR
          },
          body: JSON.stringify({
            coordinates: [
              pickupCoords, // ✅ [lng, lat]
              dropCoords,   // ✅ [lng, lat]
            ],
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error("ORS API failed:", res.status, errText);
        throw new Error("ORS API Failed");
      }

      const data = await res.json();

      if (!data?.routes?.[0]?.summary) {
        console.error("Invalid ORS response:", data);
        throw new Error("Invalid ORS data");
      }

      const meters = data.routes[0].summary.distance;
      const seconds = data.routes[0].summary.duration;

      const km = +(meters / 1000).toFixed(1);
      const minutes = Math.round(seconds / 60);

      setDistance(km);
      setEta(`${Math.floor(minutes / 60)}h ${minutes % 60}m`);

      const surge = calculateSurge();
      setSurgeMultiplier(surge);

      // Find the selected vehicle from live pricing data
      const selectedVehicle = pricings.find((p: any) => p.type === vehicleType);

      if (!selectedVehicle) {
        console.error("Vehicle not found in pricing data:", vehicleType);
        throw new Error("Vehicle pricing not found");
      }

      // Use live pricing data: rate for one-way, fixedPrice for round-trip
      const rate = tripType === "Round Trip" ? selectedVehicle.fixedPrice : selectedVehicle.rate;

      if (!rate || rate <= 0) {
        console.error("Invalid rate for vehicle:", vehicleType, rate);
        throw new Error("Invalid vehicle pricing");
      }

      const basePrice = tripType === "Round Trip"
        ? Math.round(km * 2 * rate)  // Charge for full round trip distance (both directions)
        : Math.round(km * rate);     // One way
      const finalPrice = Math.round(basePrice * surge);
      setCalculatedPrice(finalPrice);

      // ✅ SAFE ROUTE LINE
      if (data.routes[0]?.geometry?.coordinates?.length) {
        const geoCoords = data.routes[0].geometry.coordinates;
        const latLngLine = geoCoords.map((c: [number, number]) => [c[1], c[0]]);
        setRouteLine(latLngLine);
      } else {
        setRouteLine([]);
      }

    } catch (e) {
      console.error("Distance calculation error:", e);
      setDistance(null);
      setCalculatedPrice(null);
      setEta(null);
      setRouteLine([]);
    } finally {
      setLoadingDistance(false);
    }
  };


  useEffect(() => {
    if (pickupCoords && dropCoords && vehicleType) {
      getDistanceAndRoute();
    }
  }, [pickupCoords, dropCoords, vehicleType, tripType]);

  /* ---------------- UI ---------------- */
  const hasFormData = pickupCoords && dropCoords && distance !== null && calculatedPrice !== null;

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center justify-center pt-28 px-4 ${hasFormData ? 'pb-16' : 'pb-10'}`}
      style={{ backgroundImage: `url(${bgGif})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">Drop Taxi Service</h1>
          <a href="tel:+919043508313" className="text-xl font-bold text-white inline-flex gap-2">
            <Phone /> (+91) 9043508313
          </a>
        </div>

        <Card className="max-w-5xl mx-auto p-6">

          <div className="flex justify-center gap-3 mb-6">
            {["One Way", "Round Trip"].map(t => (
              <Button key={t} onClick={() => setTripType(t)} variant={tripType === t ? "default" : "outline"}>
                {t}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Pickup location"
              />
              {pickupSuggestions.length > 0 && (
                <div className="absolute bg-white w-full border rounded z-50">
                  {pickupSuggestions.map((c, i) => (
                    <div key={i} className="p-2 hover:bg-primary/10 cursor-pointer"
                      onClick={() => {
                        setPickupLocation(c.properties.label);
                        setPickupCoords(c.geometry.coordinates);
                        setPickupSuggestions([]);
                      }}>
                      {c.properties.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                placeholder="Drop location"
              />
              {dropSuggestions.length > 0 && (
                <div className="absolute bg-white w-full border rounded z-50">
                  {dropSuggestions.map((c, i) => (
                    <div key={i} className="p-2 hover:bg-primary/10 cursor-pointer"
                      onClick={() => {
                        setDropLocation(c.properties.label);
                        setDropCoords(c.geometry.coordinates);
                        setDropSuggestions([]);
                      }}>
                      {c.properties.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DateTimePicker value={dateTime} onChange={setDateTime} />
          </div>

          <div className="mt-4">
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Vehicle" />
              </SelectTrigger>
              <SelectContent>
                {displayPricings.map((p: any) => {
                  // Use live pricing data from API - rate for one-way, fixedPrice for round-trip
                  const rate = tripType === "One Way" ? p.rate : (p.fixedPrice || p.rate);
                  return (
                    <SelectItem key={p.type} value={p.type}>
                      {p.type} - ₹{rate}/km ({tripType})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {loadingDistance && (
            <div className="mt-4 text-center text-primary font-semibold animate-pulse">
              Calculating distance, ETA & fare...
            </div>
          )}

          {!loadingDistance && distance!==null && calculatedPrice!==null && (
            <div className="mt-6 p-4 border rounded space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Distance:</span>
                <span className="font-medium">
                  {tripType === "Round Trip"
                    ? `${(distance * 2).toFixed(1)} km (Round Trip - both directions)`
                    : `${distance.toFixed(1)} km (One Way)`
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ETA:</span>
                <span className="font-medium">{eta}</span>
              </div>
              {surgeMultiplier > 1 && (
                <div className="text-orange-600 font-semibold">
                  Surge Applied: {surgeMultiplier}x
                </div>
              )}
              <div className="border-t border-primary/20 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-3xl font-bold text-primary">₹{calculatedPrice}</span>
                </div>
              </div>
            </div>
          )}

          {pickupCoords && dropCoords && (
            <div className="mt-6 h-[320px] rounded overflow-hidden">
              <MapContainer
                center={[pickupCoords[1], pickupCoords[0]] as [number, number]}
                zoom={7}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[pickupCoords[1], pickupCoords[0]]} />
                <Marker position={[dropCoords[1], dropCoords[0]]} />

                {routeLine.length > 0 && (
                  <Polyline positions={routeLine} />
                )}

                <FitBounds pickupCoords={pickupCoords} dropCoords={dropCoords} />
              </MapContainer>
            </div>
          )}

          <Button
            className="w-full mt-6"
            onClick={() =>
              onFormSubmit?.({
                pickup: pickupLocation,
                drop: dropLocation,
                vehicleType,
                dateTime,
                distance,
                eta,
                surgeMultiplier,
                calculatedPrice,
              })
            }
          >
            Checkout
          </Button>

        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
