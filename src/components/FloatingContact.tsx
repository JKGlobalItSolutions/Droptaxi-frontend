import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingContact = () => {
  return (
    <>
      {/* Floating WhatsApp Button - Left Bottom */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => window.open(`https://wa.me/919043508313`, '_blank')}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Floating Call Button - Right Bottom */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => window.open(`tel:+919043508313`, '_blank')}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
};

export default FloatingContact;
