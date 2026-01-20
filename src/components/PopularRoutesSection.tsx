import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

interface Route {
  from: string;
  to: string;
  price: number;
  time: string;
}

interface PopularRoutesSectionProps {
  onBookNow: (route: { from: string; to: string; price: string }) => void;
}

const PopularRoutesSection = ({ onBookNow }: PopularRoutesSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // FETCH ROUTES FROM BACKEND
  const { data: routes = [] } = useQuery<Route[]>({
    queryKey: ["routes"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/routes`, { cache: "no-cache" });

        if (!res.ok) {
          console.error("Routes API failed:", res.status);
          return [];
        }

        return await res.json();
      } catch (err) {
        console.error("Routes API error:", err);
        return [];
      }
    },
  });

  const [isPaused, setIsPaused] = useState(false);

  // Handle manual scroll
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    setIsPaused(true); // Pause auto-scroll on manual navigation
    const scrollAmount = 350 + 16; // card width + gap
    const target = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: target,
      behavior: 'smooth'
    });

    // Resume auto-scroll after a delay
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Handle user interaction to pause/resume auto-scroll
  const handlePointerDown = () => setIsPaused(true);
  const handlePointerUp = () => setIsPaused(false);

  // AUTO SCROLL EFFECT
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    const interval = setInterval(() => {
      if (!scrollContainer || isPaused) return;

      const cardWidth = 364; // min-w-[350px] + gap-4
      const currentScroll = scrollContainer.scrollLeft;
      const maxScroll = cardWidth * routes.length;

      // Smooth scroll by 1px
      scrollContainer.scrollBy({ left: 1, behavior: "smooth" });

      // When reaching end, smoothly reset to beginning
      if (currentScroll >= maxScroll - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft = 0;
      }
    }, 20);

    return () => clearInterval(interval);
  }, [routes.length, isPaused]);

  return (
    <section id="routes" className="py-20 px-4 overflow-hidden bg-gradient-to-b from-white to-secondary/30">
      <div className="container mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-display mb-4">
            Top Drop Taxi <span className="text-gradient font-display">Destination</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Explore the most popular routes and destinations with <strong>Selvendhira Drop Taxi</strong>. We provide safe, affordable, and comfortable One Way Taxi and Drop Taxi services from Tiruvannamalai to all major cities across Tamil Nadu, Pondicherry, Bangalore, and Kerala.
          </p>
        </div>
      </div>

      {/* SCROLLABLE AUTO-MOVING CARDS */}
      <div className="relative group">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg border border-primary/20 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center -ml-4"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg border border-primary/20 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center -mr-4"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto scroll-smooth py-4 no-scrollbar"
        >
          {/* Hide scrollbar styles */}
          <style>
            {`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}
          </style>

          {[...routes, ...routes].map((route: Route, index: number) => (
            <Card
              key={`${route.from}-${route.to}-${index}`}
              className="bg-white p-4 md:p-6 min-w-[280px] md:min-w-[350px] flex-shrink-0 shadow-card hover:shadow-primary transition-all duration-300 border-2 hover:border-primary/30 rounded-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg">{route.from}</span>
                  </div>

                  <div className="h-8 w-0.5 bg-border ml-2" />

                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg">{route.to}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ₹{route.price?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    {route.time}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Starting from</span>
                  <div className="flex items-center gap-1 font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    <span>{route.price?.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    onBookNow({
                      from: route.from,
                      to: route.to,
                      price: `₹${route.price?.toLocaleString()}`,
                    })
                  }
                  className="w-full btn-cta hover:opacity-90 rounded-full"
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutesSection;
