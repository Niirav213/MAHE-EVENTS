
import { useState } from 'react';
import { Search, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  
  const categories = [
    'All Categories',
    'Concerts',
    'Workshops',
    'Festivals',
    'Sports',
    'Exhibitions',
    'Networking',
    'Theater',
    'Technology'
  ];

  return (
    <section className="relative bg-gradient-to-br from-eventPurple to-eventPurple-dark text-white py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-eventPurple-dark to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Discover Amazing Local Events Near You
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8">
            Find and attend events that match your interests, connect with like-minded people, and create unforgettable memories.
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Link to="/events">
              <Button className="bg-eventTeal hover:bg-eventTeal-dark text-black px-6 py-2 h-12 text-lg font-medium">
                Browse Events
              </Button>
            </Link>
            <Link to="/create-event">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white px-6 py-2 h-12 text-lg">
                Host an Event
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-3 rounded-md border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-eventPurple text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="pl-10 pr-4 py-3 rounded-md border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-eventPurple text-gray-800"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 pr-4 py-3 rounded-md border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-eventPurple appearance-none bg-white text-gray-800"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button className="bg-eventPurple hover:bg-eventPurple-dark text-white px-8 py-3 h-12">
              Find Events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
