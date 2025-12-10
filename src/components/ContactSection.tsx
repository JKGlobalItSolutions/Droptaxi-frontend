import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

const ContactSection = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fromLocation: "",
    toLocation: "",
    vehicleType: "",
    passengers: "",
    luggage: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create email data object with all current form values
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        from_location: formData.fromLocation,
        to_location: formData.toLocation,
        vehicle_type: formData.vehicleType,
        passengers: formData.passengers,
        luggage: formData.luggage,
        message: formData.message,
        to_email: 'selvendhiradroptaxi@gmail.com'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
      });

      // Reset the form using formRef to clear all inputs including hidden ones
      if (formRef.current) {
        formRef.current.reset();
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        fromLocation: "",
        toLocation: "",
        vehicleType: "",
        passengers: "",
        luggage: "",
        message: "",
      });

    } catch (error) {
      console.error("EmailJS Contact Error:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-secondary/30 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display mb-4">
            Get In <span className="text-gradient font-display">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          <Card className="bg-white p-6 md:p-8 shadow-card border-2 rounded-2xl">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="to_email" value="selvendhiradroptaxi@gmail.com" />
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Location</label>
                  <Input
                    name="from_location"
                    value={formData.fromLocation}
                    onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                    placeholder="Pickup location"
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To Location</label>
                  <Input
                    name="to_location"
                    value={formData.toLocation}
                    onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                    placeholder="Drop location"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type</label>
                <div>
                  <input type="hidden" name="vehicle_type" value={formData.vehicleType} />
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="premium-sedan">Premium Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="premium-suv">Premium SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Passengers</label>
                  <div>
                    <input type="hidden" name="passengers" value={formData.passengers} />
                    <Select
                      value={formData.passengers}
                      onValueChange={(value) => setFormData({ ...formData, passengers: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="No. of passengers" />
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Luggage</label>
                  <div>
                    <input type="hidden" name="luggage" value={formData.luggage} />
                    <Select
                      value={formData.luggage}
                      onValueChange={(value) => setFormData({ ...formData, luggage: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Luggage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light (Hand luggage)</SelectItem>
                        <SelectItem value="medium">Medium (1-2 bags)</SelectItem>
                        <SelectItem value="heavy">Heavy (3+ bags)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message..."
                  className="bg-background border-border min-h-[120px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full btn-cta hover:opacity-90 rounded-full py-6" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          <div className="space-y-4 md:space-y-6">
            <Card className="bg-white p-4 md:p-6 shadow-card border-2 rounded-2xl hover:shadow-primary transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+919043508313" className="text-muted-foreground hover:text-primary">+91 90435 08313</a>
                  <a href="tel:+917200096968" className="block text-muted-foreground hover:text-primary">+91 72000 96968</a>
                  <a href="https://wa.me/919043508313" target="_blank" className="block text-green-600 hover:text-green-800 mt-2">
                    WhatsApp: +91 90435 08313
                  </a>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4 md:p-6 shadow-card border-2 rounded-2xl hover:shadow-primary transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:selvendhiradroptaxi@gmail.com" className="text-muted-foreground hover:text-primary">selvendhiradroptaxi@gmail.com</a>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4 md:p-6 shadow-card border-2 rounded-2xl hover:shadow-primary transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground">
                    723, Thiruvalluvar Nagar Rd<br />
                    Mathiyazhagan, Tiruvannamalai<br />
                    Tamil Nadu 606601, India
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
