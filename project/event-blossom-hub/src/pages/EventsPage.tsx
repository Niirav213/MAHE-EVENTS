
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MapPin, Filter, ChevronDown } from "lucide-react";
import { eventsService } from "@/services/api";
import { toast } from "sonner";

interface Event {
  id: number;
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  location: string;
  image_url: string;
  category: string;
  price: number;
  available_tickets: number;
}

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  const initialCategory = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  const categories = [
    'All Categories',
    'academic',
    'cultural',
    'sports',
    'conferences',
    'festivals',
    'workshops',
    'competitions',
    'social'
  ];
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const categoryParam = selectedCategory === 'All Categories' ? '' : selectedCategory;
        const data = await eventsService.getAllEvents(categoryParam);
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load events");
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [selectedCategory]);
  
  const handleSearch = () => {
    // Filter events based on search query and location
    // This is client-side filtering for demo purposes
    // In a real application, you'd send these filters to your API
    if (!searchQuery && !locationQuery) return;
    
    toast.info(`Searching for "${searchQuery}" in ${locationQuery || "all locations"}`);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    
    // Update URL with category param
    if (category && category !== 'All Categories') {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };
  
  // Format event data for EventCard component
  const formatEventForCard = (event: Event) => ({
    id: event.id.toString(),
    title: event.title,
    date: new Date(event.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: `${event.time_start} - ${event.time_end}`,
    location: event.location,
    image: event.image_url,
    category: event.category,
    price: event.price > 0 ? `$${event.price}` : "Free"
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-eventPurple text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover College Events</h1>
            <p className="text-lg">Find the perfect events for you and your friends on campus.</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-3 rounded-md border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-eventPurple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="pl-10 pr-4 py-3 rounded-md border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-eventPurple"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Button 
                  className="bg-eventPurple hover:bg-eventPurple-dark text-white"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline"
                className="flex items-center gap-2 text-gray-600 border-gray-300"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                Filter Options
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {isFilterOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full rounded-md border border-gray-200 py-2 px-3"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat === 'All Categories' ? '' : cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <select className="w-full rounded-md border border-gray-200 py-2 px-3">
                      <option>Any date</option>
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This weekend</option>
                      <option>This week</option>
                      <option>Next week</option>
                      <option>This month</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <select className="w-full rounded-md border border-gray-200 py-2 px-3">
                      <option>Any price</option>
                      <option>Free</option>
                      <option>Paid</option>
                      <option>Under $25</option>
                      <option>$25 - $50</option>
                      <option>$50 - $100</option>
                      <option>$100+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select className="w-full rounded-md border border-gray-200 py-2 px-3">
                      <option>Date (Soonest)</option>
                      <option>Date (Latest)</option>
                      <option>Price (Low to High)</option>
                      <option>Price (High to Low)</option>
                      <option>Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              {isLoading ? 'Loading events...' : `${events.length} events found`}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventPurple"></div>
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} {...formatEventForCard(event)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
          
          {events.length > 9 && (
            <div className="text-center py-8">
              <Button className="bg-eventPurple hover:bg-eventPurple-dark">
                Load More Events
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventsPage;
