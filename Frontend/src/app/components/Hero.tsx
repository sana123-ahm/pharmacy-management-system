import { Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface HeroProps {
  heroImage: string;
}

export function Hero({ heroImage }: HeroProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            SUMMER WAVES
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            PharmaGest
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">June 20-22, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">Sunset Valley, CA</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
              Get Tickets
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg">
              View Lineup
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-12 w-6 rounded-full border-2 border-white flex items-start justify-center p-2">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
