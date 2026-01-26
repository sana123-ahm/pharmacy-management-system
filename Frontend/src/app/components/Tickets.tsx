import { Check, Star } from "lucide-react";
import { Button } from "./ui/button";

const ticketOptions = [
  {
    name: "General Admission",
    price: "$299",
    features: [
      "3-Day Festival Access",
      "General Viewing Areas",
      "Access to All Stages",
      "Food & Beverage Vendors",
      "Free Parking",
    ],
    popular: false,
  },
  {
    name: "VIP Pass",
    price: "$599",
    features: [
      "3-Day Festival Access",
      "VIP Viewing Areas",
      "Express Entry Lanes",
      "Exclusive VIP Lounge",
      "Complimentary Drinks",
      "Premium Restrooms",
      "VIP Parking",
    ],
    popular: true,
  },
  {
    name: "Backstage Pass",
    price: "$1,299",
    features: [
      "3-Day Festival Access",
      "All VIP Benefits",
      "Meet & Greet Opportunities",
      "Backstage Tours",
      "Artist Viewing Area",
      "Exclusive Merchandise",
      "Concierge Service",
      "Premium Parking",
    ],
    popular: false,
  },
];

export function Tickets() {
  return (
    <section id="tickets" className="bg-gradient-to-b from-gray-900 to-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">Tickets</h2>
          <p className="text-xl text-gray-400">Choose your experience</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ticketOptions.map((ticket, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                ticket.popular
                  ? "bg-gradient-to-b from-purple-600 to-purple-800 border-2 border-purple-400 scale-105"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              {ticket.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-bold">Most Popular</span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{ticket.name}</h3>
                <div className="text-5xl font-bold mb-4">{ticket.price}</div>
                <p className="text-sm text-gray-300">per person</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {ticket.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full py-6 text-lg ${
                  ticket.popular
                    ? "bg-white text-purple-700 hover:bg-gray-100"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
