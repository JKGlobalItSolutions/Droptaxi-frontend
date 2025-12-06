import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookNowBanner = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-[hsl(var(--cta-orange))] to-[hsl(var(--cta-yellow))] relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-900 drop-shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Book Now!</h2>
            <p className="text-xl md:text-2xl font-medium">Still looking for drop taxi service?</p>
          </div>
          
          <Button
            onClick={() => window.open('tel:+919043508313', '_blank')}
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-3"
          >
            <Phone className="w-6 h-6" />
            (+91) 9043508313
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BookNowBanner;
