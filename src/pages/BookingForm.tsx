import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import apiClient from "@/api/apiClient";

const BookingForm = () => {
  const { vehicleType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const prefill = (location.state as any) || {};

  const [formData, setFormData] = useState({
    name: prefill.name || "",
    email: prefill.email || "",
    phone: prefill.phone || "",
    pickup: prefill.pickup || "",
    drop: prefill.drop || "",
    dateTime: prefill.dateTime || "",
    passengers: prefill.passengers || "",
    tripType: prefill.tripType || "oneWay",
    luggage: prefill.luggage || "",
    specialRequirements: prefill.specialRequirements || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If no vehicleType provided, redirect home
    if (!vehicleType) {
      navigate("/", { replace: true });
    }
  }, [vehicleType, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.pickup || !formData.drop) {
      toast({ title: "Missing Information", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const templateParams = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      pickup: formData.pickup.trim(),
      drop: formData.drop.trim(),
      vehicleType: vehicleType || "",
      dateTime: formData.dateTime || "Not specified",
      passengers: formData.passengers || "Not specified",
      tripType: formData.tripType || "Not specified",
      luggage: formData.luggage || "Not specified",
      specialRequirements: formData.specialRequirements || "None",
    } as any;

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { ...templateParams, to_email: "selvendhiradroptaxi@gmail.com" },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      try {
        await apiClient.post("/api/booking", templateParams);
      } catch (err) {
        // backend optional
      }

      toast({ title: "Booking Submitted", description: "We'll contact you soon to confirm." });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast({ title: "Submit Failed", description: "Unable to send booking.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Book Your {vehicleType}</h2>
        <p className="text-sm text-muted-foreground mb-6">Fill the form below to complete booking for {vehicleType}.</p>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div>
              <Label>Passengers</Label>
              <Select value={formData.passengers} onValueChange={(v) => setFormData({ ...formData, passengers: v })}>
                <SelectTrigger><SelectValue placeholder="Select passengers"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pickup</Label>
              <Input value={formData.pickup} onChange={(e) => setFormData({ ...formData, pickup: e.target.value })} required />
            </div>
            <div>
              <Label>Drop</Label>
              <Input value={formData.drop} onChange={(e) => setFormData({ ...formData, drop: e.target.value })} required />
            </div>
            <div>
              <Label>Date & Time</Label>
              <Input value={formData.dateTime} onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} placeholder="YYYY-MM-DDThh:mm:ss" />
            </div>
            <div>
              <Label>Trip Type</Label>
              <Select value={formData.tripType} onValueChange={(v) => setFormData({ ...formData, tripType: v })}>
                <SelectTrigger><SelectValue placeholder="Select trip type"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="oneWay">One Way</SelectItem>
                  <SelectItem value="roundTrip">Round Trip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Luggage</Label>
              <Select value={formData.luggage} onValueChange={(v) => setFormData({ ...formData, luggage: v })}>
                <SelectTrigger><SelectValue placeholder="Select luggage"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label>Special Requirements</Label>
            <Textarea value={formData.specialRequirements} onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })} />
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : `Book ${vehicleType}`}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
