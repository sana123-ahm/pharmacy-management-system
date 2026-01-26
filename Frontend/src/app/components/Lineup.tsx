import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock } from "lucide-react";

const lineupData = {
  friday: [
    { time: "8:00 PM - 10:00 PM", artist: "The Electric Waves", stage: "Main Stage", genre: "Electronic" },
    { time: "6:00 PM - 7:30 PM", artist: "Sunset Riders", stage: "Main Stage", genre: "Rock" },
    { time: "4:00 PM - 5:30 PM", artist: "Nova Sound", stage: "Beach Stage", genre: "Indie" },
    { time: "2:00 PM - 3:30 PM", artist: "DJ Luna", stage: "Beach Stage", genre: "House" },
  ],
  saturday: [
    { time: "9:00 PM - 11:00 PM", artist: "Cosmic Dreams", stage: "Main Stage", genre: "Pop" },
    { time: "7:00 PM - 8:30 PM", artist: "The Resonators", stage: "Main Stage", genre: "Alternative" },
    { time: "5:00 PM - 6:30 PM", artist: "Neon Nights", stage: "Beach Stage", genre: "Electronic" },
    { time: "3:00 PM - 4:30 PM", artist: "Wildfire", stage: "Beach Stage", genre: "Rock" },
    { time: "1:00 PM - 2:30 PM", artist: "Acoustic Soul", stage: "Sunset Lounge", genre: "Acoustic" },
  ],
  sunday: [
    { time: "8:00 PM - 10:00 PM", artist: "Starlight Symphony", stage: "Main Stage", genre: "Orchestra" },
    { time: "6:00 PM - 7:30 PM", artist: "Urban Pulse", stage: "Main Stage", genre: "Hip Hop" },
    { time: "4:00 PM - 5:30 PM", artist: "The Harmony Project", stage: "Beach Stage", genre: "Folk" },
    { time: "2:00 PM - 3:30 PM", artist: "Bass Frontier", stage: "Beach Stage", genre: "EDM" },
  ],
};

export function Lineup() {
  return (
    <section id="lineup" className="bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Lineup</h2>
          <p className="text-xl text-gray-400">Three days of incredible music</p>
        </div>
        
        <Tabs defaultValue="friday" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-gray-900">
            <TabsTrigger value="friday" className="data-[state=active]:bg-purple-600">
              Friday
            </TabsTrigger>
            <TabsTrigger value="saturday" className="data-[state=active]:bg-purple-600">
              Saturday
            </TabsTrigger>
            <TabsTrigger value="sunday" className="data-[state=active]:bg-purple-600">
              Sunday
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(lineupData).map(([day, artists]) => (
            <TabsContent key={day} value={day} className="space-y-4">
              {artists.map((artist, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{artist.artist}</h3>
                      <div className="flex items-center gap-4 text-gray-400">
                        <span className="text-sm bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">
                          {artist.genre}
                        </span>
                        <span className="text-sm">{artist.stage}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{artist.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
