import { Music } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold">SUMMER WAVES</span>
            </div>
            <p className="text-gray-400">
              Experience the ultimate summer music festival with world-class artists, 
              amazing food, and unforgettable memories.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#lineup" className="hover:text-white transition-colors">Lineup</a></li>
              <li><a href="#tickets" className="hover:text-white transition-colors">Tickets</a></li>
              <li><a href="#venue" className="hover:text-white transition-colors">Venue</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Summer Waves Festival. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
