import { Car, X, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { CarCategory, carPricingConfig } from "../config/pricing";
import emailjs from "@emailjs/browser";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/api/apiClient";

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

type PricingData = {
  type: string;
  rate: number;
  fixedPrice: number;
};
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
  prefilledData?: {
    pickup?: string;
    drop?: string;
    vehicleType?: string;
    dateTime?: string;
    distance?: number;
    calculatedPrice?: number;
  };
  onResetPrefilledData?: () => void;
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

  // NOTE: internal state is initialized from `value` on mount only

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
      <PopoverContent className="w-auto p-0 z-[10002]" align="start">
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
                <SelectContent className="z-[10003]">
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

// Enhanced Carousel Component with Swipe Support
const Carousel = ({ category, images }: { category: string; images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto-play carousel
  React.useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full h-full"
      ref={carouselRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
                onClick={() => goToSlide(index)}
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

const ServicesSection = ({ onServiceSelect, prefilledData, onResetPrefilledData }: ServicesSectionProps) => {
  const { toast } = useToast();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<CarCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const processedPrefilledRef = useRef<string | null>(null);
  const categories = Object.keys(carPricingConfig) as CarCategory[];

  // Auto-open booking form directly in services section if vehicle type is selected from HeroSection checkout
  useEffect(() => {
    // Prevent re-processing the same prefilledData repeatedly
    const currentDataKey = JSON.stringify(prefilledData);

    if (prefilledData?.vehicleType && processedPrefilledRef.current !== currentDataKey) {
      console.log('🔍 ServicesSection received prefilledData:', prefilledData);
      console.log('📋 Available categories:', categories);
      const vehicleType = prefilledData.vehicleType as CarCategory;
      console.log('🔎 Checking vehicleType:', vehicleType, 'includes:', categories.includes(vehicleType));

      // Try to find a case-insensitive match
      const normalizedVehicleType = categories.find(cat =>
        cat.toLowerCase() === vehicleType.toLowerCase()
      ) || vehicleType;

      console.log('🔄 Normalized vehicleType:', normalizedVehicleType);

      if (normalizedVehicleType) {
        console.log('✅ Opening direct form view for vehicle type:', normalizedVehicleType);
        // For checkout flow: show form directly in services section (no modal)
        setSelectedCategory(normalizedVehicleType as CarCategory);
        setShowBookingForm(true);
        setOverlayOpen(false); // Keep modal closed for direct view

        // Pre-fill form data immediately - make it editable
        setFormData({
          name: "",
          email: "",
          phone: "",
          pickup: prefilledData.pickup || "",
          drop: prefilledData.drop || "",
          dateTime: prefilledData.dateTime || "",
          returnDateTime: "",
          passengers: "",
          tripType: "",
          luggage: "",
          specialRequirements: "",
        });

        processedPrefilledRef.current = currentDataKey;
      } else {
        console.log('❌ Vehicle type not found in categories:', vehicleType);
        console.log('Available options:', categories);
      }
    }
  }, [prefilledData, categories]);

  // Available cities for dropdown with coordinates
  const availableCities = [
    { name: "Tiruvannamalai", coords: [79.0728, 12.2406] },
    { name: "Chennai", coords: [80.2785, 13.0827] },
    { name: "Bangalore", coords: [77.5937, 12.9716] },
    { name: "Pondicherry", coords: [79.8083, 11.9139] },
    { name: "Coimbatore", coords: [76.9558, 11.0168] },
    { name: "Salem", coords: [78.1460, 11.6643] },
    { name: "Vellore", coords: [79.1329, 12.9165] },
    { name: "Trichy", coords: [78.7047, 10.7905] },
    { name: "Madurai", coords: [78.1198, 9.9252] },
    { name: "Kancheepuram", coords: [79.6784, 12.8196] },
    { name: "Villupuram", coords: [79.4914, 11.9397] },
    { name: "Cuddalore", coords: [79.7460, 11.7461] },
    { name: "Arcot", coords: [79.3340, 12.9092] },
    { name: "Walajah", coords: [79.3647, 12.9292] },
    { name: "Arani", coords: [79.2842, 12.6767] },
    { name: "Polur", coords: [79.1333, 12.5167] },
    { name: "Chetput", coords: [79.3177, 12.2391] },
    { name: "Mangalore", coords: [74.8550, 12.9141] },
    { name: "Mysore", coords: [76.6393, 12.2958] },
    { name: "Hosur", coords: [77.8235, 12.7409] }
  ];

  // Form state for booking
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    drop: "",
    dateTime: "",
    returnDateTime: "", // Added return date field
    passengers: "",
    tripType: "",
    luggage: "",
    specialRequirements: "",
  });

  // Pricing and distance states
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Fallback/mock pricing data for vehicle types
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

  // -------------------- CALCULATE DISTANCE USING PREDEFINED COORDINATES --------------------
  // Try to find a city from `availableCities` using flexible matching
  const findCityByName = (input?: string) => {
    if (!input) return null;
    const txt = input.trim().toLowerCase();
    // exact match
    let city = availableCities.find(c => c.name.toLowerCase() === txt);
    if (city) return city;
    // contains or startsWith
    city = availableCities.find(c => txt.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(txt));
    if (city) return city;
    // fallback: partial token match
    const tokens = txt.split(/[,\s]+/).filter(Boolean);
    for (const t of tokens) {
      city = availableCities.find(c => c.name.toLowerCase().includes(t));
      if (city) return city;
    }
    return null;
  };

  const calculateRealDistance = async () => {
    try {
      // Find coordinates for pickup and drop cities (flexible matching)
      const pickupCity = findCityByName(formData.pickup);
      const dropCity = findCityByName(formData.drop);

      if (!pickupCity || !dropCity) {
        console.warn("Cities not found in predefined list, using fallback");
        return Math.floor(Math.random() * 50) + 10;
      }

      const pickupCoords = pickupCity.coords;
      const dropCoords = dropCity.coords;

      // Use OpenRouteService API for driving distance calculation
      const apiKey = import.meta.env.VITE_ORS_API_KEY;
      if (!apiKey || apiKey === 'YOUR_ORS_API_KEY_HERE') {
        console.warn("OpenRouteService API key not set, using fallback haversine distance");
        // Fallback to haversine distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (dropCoords[1] - pickupCoords[1]) * Math.PI / 180;
        const dLon = (dropCoords[0] - pickupCoords[0]) * Math.PI / 180;
        const a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(pickupCoords[1] * Math.PI / 180) * Math.cos(dropCoords[1] * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return Math.round(distance * 10) / 10; // Round to 1 decimal
      }

      // Step 3: Calculate driving distance using API
      const distanceResponse = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupCoords[0]},${pickupCoords[1]}&end=${dropCoords[0]},${dropCoords[1]}`
      );

      if (!distanceResponse.ok) {
        console.warn("ORS distance calculation failed, using haversine fallback");
        // Fallback to haversine distance
        const R = 6371;
        const dLat = (dropCoords[1] - pickupCoords[1]) * Math.PI / 180;
        const dLon = (dropCoords[0] - pickupCoords[0]) * Math.PI / 180;
        const a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(pickupCoords[1] * Math.PI / 180) * Math.cos(dropCoords[1] * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return Math.round(distance * 10) / 10;
      }

      const distanceData = await distanceResponse.json();

      if (distanceData.features && distanceData.features.length > 0) {
        const distance = distanceData.features[0].properties.segments[0].distance / 1000; // Convert meters to km
        return Math.round(distance * 10) / 10; // Round to 1 decimal
      }

      console.warn("ORS returned no distance results, using haversine fallback");
      // Final fallback to haversine
      const R = 6371;
      const dLat = (dropCoords[1] - pickupCoords[1]) * Math.PI / 180;
      const dLon = (dropCoords[0] - pickupCoords[0]) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pickupCoords[1] * Math.PI / 180) * Math.cos(dropCoords[1] * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return Math.round(distance * 10) / 10;

    } catch (error) {
      console.error("Distance calculation error:", error);
      return Math.floor(Math.random() * 50) + 10;
    }
  };

  // -------------------- USE EFFECT FOR PRICE CALCULATION --------------------
  useEffect(() => {
    const fetchDistanceAndCalculate = async () => {
      if (formData.pickup && formData.drop && showBookingForm) {
        const distanceKm = await calculateRealDistance();

        if (distanceKm && selectedCategory) {
          setDistance(distanceKm);

          // Find the selected vehicle from live pricing data
          const selectedVehicle = displayPricings.find(p => p.type === selectedCategory);

          if (selectedVehicle) {
            if (formData.tripType === "roundTrip") {
              // Corporate round trip calculation: distance × 2 × round-trip rate (fixedPrice)
              const roundTripRate = selectedVehicle.fixedPrice || selectedVehicle.rate;
              const estimatedPrice = Math.round(distanceKm * 2 * roundTripRate);
              setCalculatedPrice(estimatedPrice);
            } else {
              // One-way calculation: distance × one-way rate
              const oneWayRate = selectedVehicle.rate;
              const estimatedPrice = Math.round(distanceKm * oneWayRate);
              setCalculatedPrice(estimatedPrice);
            }
          }
        }
      } else {
        setCalculatedPrice(null);
        setDistance(null);
      }
    };

  fetchDistanceAndCalculate();
  }, [formData.pickup, formData.drop, formData.tripType, selectedCategory, showBookingForm, displayPricings]);

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

    // Comprehensive validation
    const requiredFields = [
      { field: 'name', label: 'Full Name' },
      { field: 'email', label: 'Email Address' },
      { field: 'phone', label: 'Phone Number' },
      { field: 'pickup', label: 'Pickup Location' },
      { field: 'drop', label: 'Drop Location' },
      { field: 'dateTime', label: 'Date & Time' },
      { field: 'passengers', label: 'Number of Passengers' },
      { field: 'tripType', label: 'Trip Type' }
    ];

    const missingFields = requiredFields.filter(({ field }) => !formData[field as keyof typeof formData]?.trim());

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (basic validation for Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian phone number.",
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
        returnDateTime: "",
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





  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Shared datalist for city suggestions used by pickup/drop inputs */}
        <datalist id="available-cities">
          {availableCities.map((c) => (
            <option key={c.name} value={c.name} />
          ))}
        </datalist>
        {/* Show booking form directly only when coming from checkout AND overlay is not open */}
        {prefilledData?.vehicleType && showBookingForm && !overlayOpen ? (
          <div className="max-w-4xl mx-auto">
            {selectedCategory && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-display mb-4">
                    Book Your <span className="text-gradient font-display">{serviceConfig[selectedCategory].name}</span>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Complete your booking details below. Your pickup location, destination, and date/time have been pre-filled from your selection.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="w-full">
                  <div className="bg-white rounded-2xl shadow-card border-2 p-8">
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
                        <Select
                          value={formData.pickup}
                          onValueChange={(value) => {
                            console.log('Direct form - Pickup selected:', value);
                            setFormData(prev => ({...prev, pickup: value}));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select pickup city" />
                          </SelectTrigger>
                          <SelectContent className="z-[10001]">
                            {availableCities.map((city) => (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Drop Location</Label>
                        <Select
                          value={formData.drop}
                          onValueChange={(value) => {
                            console.log('Direct form - Drop selected:', value);
                            setFormData(prev => ({...prev, drop: value}));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select drop city" />
                          </SelectTrigger>
                          <SelectContent className="z-[10001]">
                            {availableCities.map((city) => (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{formData.tripType === "roundTrip" ? "Departure Date & Time" : "Date & Time"}</Label>
                        <DateTimePicker
                          value={formData.dateTime}
                          onChange={(value) => setFormData(prev => ({...prev, dateTime: value}))}
                        />
                      </div>

                      {formData.tripType === "roundTrip" && (
                        <div className="space-y-2">
                          <Label>Return Date & Time</Label>
                          <DateTimePicker
                            value={formData.returnDateTime}
                            onChange={(value) => setFormData({...formData, returnDateTime: value})}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Number of Passengers</Label>
                        <Select value={formData.passengers} onValueChange={(value) => setFormData({...formData, passengers: value})}>
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
                        <Select value={formData.tripType} onValueChange={(value) => setFormData({...formData, tripType: value})}>
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
                        <Select value={formData.luggage} onValueChange={(value) => setFormData({...formData, luggage: value})}>
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

                    {/* Price Display */}
                    {calculatedPrice && distance && (
                      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Distance:</span>
                          <span className="font-medium">
                            {formData.tripType === "roundTrip"
                              ? `${(distance * 2).toFixed(1)} km (Round Trip - both directions)`
                              : `${distance.toFixed(1)} km (One Way)`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Vehicle:</span>
                          <span className="font-medium capitalize">{selectedCategory}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Rate:</span>
                          <span className="font-medium">₹{
                            displayPricings.find(p => p.type === selectedCategory)?.[
                              formData.tripType === "roundTrip" ? "fixedPrice" : "rate"
                            ] || (formData.tripType === "roundTrip" ? 17 : 14)
                          }/km</span>
                        </div>
                        {formData.tripType === "roundTrip" && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Trip Type:</span>
                            <span className="font-medium text-blue-600">Round Trip (2 ways)</span>
                          </div>
                        )}
                        <div className="border-t border-primary/20 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Price:</span>
                            <span className="text-3xl font-bold text-primary">₹{calculatedPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp and Call Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => window.open(`https://wa.me/919043508313`, '_blank')}
                      >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp Support
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => window.open(`tel:+919043508313`, '_blank')}
                      >
                        <Phone className="w-5 h-5" />
                        Call Support
                      </Button>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Reset to show services section again
                          onResetPrefilledData?.();
                          setSelectedCategory(null);
                          setShowBookingForm(false);
                        }}
                        className="flex-1"
                      >
                        Back to Services
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary hover:bg-primary/90 text-lg py-4"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : `Book Your ${serviceConfig[selectedCategory].name}`}
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display mb-4">
                We Offer Best <span className="text-gradient font-display">Taxi Services</span>
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                <strong>Selvendhira Drop Taxi</strong> provides reliable and affordable One Way Taxi, Drop Taxi, and Outstation Taxi services from Tiruvannamalai to all major cities across Tamil Nadu, Bangalore, Pondicherry, and Kerala. We focus on comfort, punctuality, and safe travel with professional drivers and clean, well-maintained cars.
              </p>
            </div>

            {/* Clickable Car Symbols */}
            <div className="mb-12 md:mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Select Your Vehicle</h3>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {categories.map((cat) => {
                  const config = serviceConfig[cat];
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleSymbolClick(cat)}
                      className="flex flex-col items-center p-4 md:p-6 rounded-2xl bg-white border-2 border-border hover:border-primary hover:shadow-primary transition-all group min-w-[120px] md:min-w-[140px] touch-manipulation"
                    >
                      <Car className={`${config.iconSize || "w-12 h-12 md:w-16 md:h-16"} text-primary mb-2 md:mb-3 group-hover:scale-110 transition-transform`} />
                      <span className="text-xs md:text-sm font-semibold group-hover:text-primary transition-colors text-center">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Modal Overlay - Rendered via portal to document.body so it sits above entire app */}
        {overlayOpen ? createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/50 flex items-start justify-center pt-16 md:pt-20 pb-4 md:pb-10 overflow-y-auto overflow-x-hidden" onClick={handleCloseOverlay}>
            <div className="bg-background rounded-2xl shadow-2xl max-w-6xl w-full mx-2 md:mx-4 max-h-[85vh] md:max-h-[80vh] overflow-y-auto overflow-x-hidden relative z-[10000]" onClick={(e) => e.stopPropagation()}>
              {/* Header with Close Button */}
              <div className="sticky top-0 z-[10000] bg-background border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseOverlay();
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors bg-white border border-gray-300"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold">Book Your Ride</h1>
                    <p className="text-sm text-muted-foreground">Selvendhira Drop Taxi Services</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://wa.me/919043508313`, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:+919043508313`, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                                <Carousel category={String(preselectedCategory!)} images={serviceConfig[preselectedCategory!].images} />
                              </div>
                            </div>
                            <CardTitle className="text-3xl">{serviceConfig[preselectedCategory].name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Rates Display - Use live pricing data */}
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-lg">
                                <span className="font-medium">One Way:</span>
                                <span className="font-bold text-primary text-lg">₹{
                                  displayPricings.find(p => p.type === preselectedCategory)?.rate || 14
                                }/km</span>
                              </div>
                              <div className="flex justify-between items-center text-lg">
                                <span className="font-medium">Round Trip:</span>
                                <span className="font-bold text-primary text-lg">₹{
                                  displayPricings.find(p => p.type === preselectedCategory)?.fixedPrice || 17
                                }/km</span>
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
                                onClick={() => window.open(`https://wa.me/919043508313`, '_blank')}
                              >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2"
                                onClick={() => window.open(`tel:+919043508313`, '_blank')}
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
                                    <span className="font-semibold">₹{displayPricings.find(p => p.type === cat)?.rate || 14}/km</span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span>Round Trip:</span>
                                    <span className="font-semibold">₹{displayPricings.find(p => p.type === cat)?.fixedPrice || 17}/km</span>
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
                            One Way: ₹{displayPricings.find(p => p.type === selectedCategory)?.rate || 14}/km |
                            Round Trip: ₹{displayPricings.find(p => p.type === selectedCategory)?.fixedPrice || 17}/km
                          </p>
                        </div>

                        <form onSubmit={handleFormSubmit} className="w-full">
                          <div className="bg-white rounded-2xl shadow-card border-2 p-8">
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
                                  list="available-cities"
                                  placeholder="Enter or choose pickup city"
                                  value={formData.pickup}
                                  onChange={(e) => setFormData(prev => ({...prev, pickup: e.target.value}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Drop Location</Label>
                                <Input
                                  list="available-cities"
                                  placeholder="Enter or choose drop city"
                                  value={formData.drop}
                                  onChange={(e) => setFormData(prev => ({...prev, drop: e.target.value}))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{formData.tripType === "roundTrip" ? "Departure Date & Time" : "Date & Time"}</Label>
                                <DateTimePicker
                                  value={formData.dateTime}
                                  onChange={(value) => {
                                    console.log('DateTime changed:', value);
                                    setFormData(prev => ({...prev, dateTime: value}));
                                  }}
                                />
                              </div>
                              {formData.tripType === "roundTrip" && (
                                <div className="space-y-2">
                                  <Label>Return Date & Time</Label>
                                  <DateTimePicker
                                    value={formData.returnDateTime}
                                    onChange={(value) => {
                                      console.log('Return DateTime changed:', value);
                                      setFormData(prev => ({...prev, returnDateTime: value}));
                                    }}
                                  />
                                </div>
                              )}
                              <div className="space-y-2">
                                <Label>Number of Passengers</Label>
                                <Select
                                  value={formData.passengers}
                                  onValueChange={(value) => {
                                    console.log('Passengers selected:', value);
                                    setFormData(prev => ({...prev, passengers: value}));
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select passengers" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[10001]">
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
                                <Select
                                  value={formData.tripType}
                                  onValueChange={(value) => {
                                    console.log('Trip type selected:', value);
                                    setFormData(prev => ({...prev, tripType: value}));
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select trip type" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[10001]">
                                    <SelectItem value="oneWay">One Way</SelectItem>
                                    <SelectItem value="roundTrip">Round Trip</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Luggage</Label>
                                <Select
                                  value={formData.luggage}
                                  onValueChange={(value) => {
                                    console.log('Luggage selected:', value);
                                    setFormData(prev => ({...prev, luggage: value}));
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select luggage type" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[10001]">
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

                            {/* Price Display */}
                            {calculatedPrice && distance && (
                              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Distance:</span>
                                  <span className="font-medium">
                                    {formData.tripType === "roundTrip"
                                      ? `${(distance * 2).toFixed(1)} km (Round Trip - both directions)`
                                      : `${distance.toFixed(1)} km (One Way)`
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Vehicle:</span>
                                  <span className="font-medium capitalize">{selectedCategory}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Rate:</span>
                                  <span className="font-medium">₹{
                                    displayPricings.find(p => p.type === selectedCategory)?.[
                                      formData.tripType === "roundTrip" ? "fixedPrice" : "rate"
                                    ] || (formData.tripType === "roundTrip" ? 17 : 14)
                                  }/km</span>
                                </div>
                                {formData.tripType === "roundTrip" && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Trip Type:</span>
                                    <span className="font-medium text-blue-600">Round Trip (2 ways)</span>
                                  </div>
                                )}
                                <div className="border-t border-primary/20 pt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total Price:</span>
                                    <span className="text-3xl font-bold text-primary">₹{calculatedPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* WhatsApp and Call Buttons */}
                            <div className="flex gap-3 mt-6">
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2"
                                onClick={() => window.open(`https://wa.me/919043508313`, '_blank')}
                              >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Support
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2"
                                onClick={() => window.open(`tel:+919043508313`, '_blank')}
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
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        ) : null}
      </div>
    </section>
  );
};

export default ServicesSection;
