import { useState, useRef } from "react";
import { Phone, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PopularRoutesSection from "@/components/PopularRoutesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import EnquiryForm from "@/components/EnquiryForm";
import FloatingContact from "@/components/FloatingContact";
import BookingStepsSection from "@/components/BookingStepsSection";
import BookNowBanner from "@/components/BookNowBanner";
import { AnimatedSection } from "@/components/ui/animated-section";


const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth" });
};

const Index = () => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
    price: string;
  } | null>(null);
  const [prefilledData, setPrefilledData] = useState(null);
  const [highlightedVehicle, setHighlightedVehicle] = useState<string | null>(null);

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
    console.log('HeroSection checkout data:', formData);
    setPrefilledData(formData);
    // Scroll to services section; ServicesSection opens overlay and prefills the form
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* <Admin1 /> */}
      <HeroSection onFormSubmit={handleHomeFormSubmit} />
      <div ref={servicesRef}>
        <AnimatedSection animation="fade-up" delay={100}>
          <ServicesSection
            onServiceSelect={handleServiceSelect}
            prefilledData={prefilledData}
            onResetPrefilledData={() => setPrefilledData(null)}
            highlightedVehicle={highlightedVehicle}
            onVehicleSelect={(vehicleType) => setHighlightedVehicle(vehicleType)}
            onBookNow={handleBookNow}
          />
        </AnimatedSection>
      </div>
      <AnimatedSection animation="slide-up" delay={200}>
        <WhyChooseUsSection />
      </AnimatedSection>
      <AnimatedSection animation="fade-in" delay={300}>
        <BookingStepsSection />
      </AnimatedSection>
      <AnimatedSection animation="scale-in" delay={200}>
        <BookNowBanner />
      </AnimatedSection>
      <AnimatedSection animation="slide-right" delay={150}>
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection animation="fade-up" delay={250}>
        <ContactSection />
      </AnimatedSection>

      <EnquiryForm
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        routeFrom={selectedRoute?.from}
        routeTo={selectedRoute?.to}
        routePrice={selectedRoute?.price}
      />

      <FloatingContact />

      <footer className="bg-gradient-to-br from-primary to-primary/80 py-12 px-4 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Selvendhira Drop Taxi</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Trusted One Way Taxi and Drop Taxi service provider based in Tiruvannamalai. We specialize in safe, comfortable, and affordable outstation taxi services across Tamil Nadu, Bangalore, Pondicherry, and Kerala.
              </p>
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+919043508313" className="hover:text-accent">9043508313</a>
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+917200096968" className="hover:text-accent">7200096968</a>
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:selvendhiradroptaxi@gmail.com" className="hover:text-accent">selvendhiradroptaxi@gmail.com</a>
                </p>
                <div className="text-xs text-white/80 mt-2">
                  <p>723, Thiruvalluvar Nagar Rd, Mathiyazhagan, Tiruvannamalai, Tamil Nadu 606601, India</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li><button onClick={() => scrollToSection("home")} className="hover:text-accent">Home</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-accent">Services</button></li>
                <li><button onClick={() => scrollToSection("routes")} className="hover:text-accent">Routes</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-accent">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>One Way Taxi</li>
                <li>Round Trip Taxi</li>
                <li>Outstation Taxi</li>
                <li>Airport Transfer</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Popular Destinations</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>Chennai</li>
                <li>Bangalore</li>
                <li>Pondicherry</li>
                <li>Coimbatore</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center text-sm text-white/80">
            <p>&copy; 2025 Selvendhira Drop Taxi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
