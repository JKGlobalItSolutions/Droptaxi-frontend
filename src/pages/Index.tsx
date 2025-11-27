import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PopularRoutesSection from "@/components/PopularRoutesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import EnquiryForm from "@/components/EnquiryForm";
import FloatingContact from "@/components/FloatingContact";


const Index = () => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
    price: string;
  } | null>(null);
  const [prefilledData, setPrefilledData] = useState(null);

  const servicesRef = useRef(null);

  const handleBookNow = (route: { from: string; to: string; price: string }) => {
    setSelectedRoute(route);
    setEnquiryOpen(true);
  };

  const handleServiceSelect = () => {
    setSelectedRoute(null);
    setEnquiryOpen(true);
  };

  const handleHomeFormSubmit = (formData) => {
    setPrefilledData(formData);
    // Scroll to services section
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* <Admin1 /> */}
      <HeroSection onFormSubmit={handleHomeFormSubmit} />
      <div ref={servicesRef}>
        <ServicesSection onServiceSelect={handleServiceSelect} prefilledData={prefilledData} />
      </div>
      <PopularRoutesSection onBookNow={handleBookNow} />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <ContactSection />

      <EnquiryForm
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        routeFrom={selectedRoute?.from}
        routeTo={selectedRoute?.to}
        routePrice={selectedRoute?.price}
      />

      <FloatingContact />

      <footer className="bg-secondary/30 py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 DropTaxi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
