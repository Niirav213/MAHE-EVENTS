
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Tag, Users, Ticket, DollarSign, User } from "lucide-react";
import { eventsService, ticketsService } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface EventDetail {
  id: number;
  title: string;
  description: string;
  date: string;
  time_start: string;
  time_end: string;
  location: string;
  category: string;
  price: number;
  total_tickets: number;
  available_tickets: number;
  image_url: string;
  organizer_name: string;
}

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await eventsService.getEventById(id);
        setEvent(data);
      } catch (error) {
        toast.error("Failed to load event details");
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handlePurchaseTicket = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase tickets");
      navigate("/sign-in");
      return;
    }

    if (!event) return;

    if (event.available_tickets <= 0) {
      toast.error("Sorry, this event is sold out");
      return;
    }

    try {
      setIsPurchasing(true);
      await ticketsService.purchaseTicket(event.id.toString());
      toast.success("Ticket purchased successfully!");
      // Update available tickets count
      setEvent({
        ...event,
        available_tickets: event.available_tickets - 1
      });
      
      // Redirect to tickets page
      setTimeout(() => {
        navigate("/tickets");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to purchase ticket");
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventPurple"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">Event Not Found</h2>
            <p className="text-gray-500 mt-2">The event you're looking for doesn't exist or has been removed.</p>
            <Button 
              className="mt-4 bg-eventPurple hover:bg-eventPurple-dark"
              onClick={() => navigate("/events")}
            >
              Browse Events
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section with image and overlay */}
        <div className="relative h-80 lg:h-96">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="container mx-auto px-4 relative h-full flex items-end pb-8">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center gap-2 text-gray-200">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event details */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main content */}
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">About This Event</h2>
                <p className="whitespace-pre-line text-gray-700">
                  {event.description}
                </p>
              </div>
              
              {isAdmin && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-amber-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Admin Actions
                  </h3>
                  <div className="mt-2 flex gap-3">
                    <Button 
                      variant="outline" 
                      className="border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
                      onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                    >
                      Edit Event
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this event?")) {
                          eventsService.deleteEvent(event.id.toString())
                            .then(() => {
                              toast.success("Event deleted successfully");
                              navigate("/admin");
                            })
                            .catch(() => {
                              toast.error("Failed to delete event");
                            });
                        }
                      }}
                    >
                      Delete Event
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700">Date</h4>
                      <p>{formatDate(event.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700">Time</h4>
                      <p>{event.time_start} - {event.time_end}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700">Location</h4>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700">Category</h4>
                      <p className="capitalize">{event.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700">Organizer</h4>
                      <p>{event.organizer_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Ticket className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700">Available Tickets</h4>
                      <p>{event.available_tickets} / {event.total_tickets}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="md:w-80">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <DollarSign className="h-6 w-6 mr-1" />
                    {event.price > 0 ? `$${event.price.toFixed(2)}` : "Free"}
                  </h3>
                  
                  {event.available_tickets > 0 ? (
                    <span className="text-green-600 text-sm font-medium">
                      {event.available_tickets} tickets left
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm font-medium">
                      Sold Out
                    </span>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-eventPurple hover:bg-eventPurple-dark mb-4"
                  disabled={event.available_tickets <= 0 || isPurchasing}
                  onClick={handlePurchaseTicket}
                >
                  {isPurchasing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Ticket className="h-4 w-4 mr-2" />
                      {event.price > 0 ? 'Purchase Ticket' : 'Register for Event'}
                    </span>
                  )}
                </Button>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Date:</strong> {formatDate(event.date)}
                  </p>
                  <p className="mb-2">
                    <strong>Time:</strong> {event.time_start} - {event.time_end}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetailPage;
