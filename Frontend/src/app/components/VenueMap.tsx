import { MapPin, Info } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface VenueMapProps {
  mapImage: string;
}

export function VenueMap({ mapImage }: VenueMapProps) {
  const mapLocations = [
    { name: "Main Stage", color: "bg-purple-500" },
    { name: "Beach Stage", color: "bg-blue-500" },
    { name: "Sunset Lounge", color: "bg-orange-500" },
    { name: "Food Court", color: "bg-green-500" },
    { name: "VIP Area", color: "bg-yellow-500" },
    { name: "Parking", color: "bg-gray-500" },
  ];

  return (
    <section id="venue" className="bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Venue</h2>
          <p className="text-xl text-gray-400">Find your way around</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="rounded-2xl overflow-hidden border-2 border-purple-600 shadow-2xl">
              <ImageWithFallback
                src={mapImage}
                alt="Festival venue map"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-6">Location Guide</h3>
              <div className="space-y-4">
                {mapLocations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-900 rounded-lg p-4 border border-gray-800"
                  >
                    <div className={`h-4 w-4 rounded-full ${location.color}`} />
                    <span className="text-lg">{location.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 mt-1 text-purple-400" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Address</h4>
                  <p className="text-gray-400">
                    123 Festival Drive<br />
                    Sunset Valley, CA 90210
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 mt-1 text-purple-400" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Getting There</h4>
                  <p className="text-gray-400">
                    Free shuttle service available from downtown. 
                    Parking passes required for on-site parking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
