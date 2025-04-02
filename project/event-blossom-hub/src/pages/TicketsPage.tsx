
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Ticket, Calendar, Clock, MapPin, Download, Loader2 } from "lucide-react";
import { ticketsService } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface UserTicket {
  id: number;
  event_id: number;
  ticket_code: string;
  status: "purchased" | "used" | "cancelled";
  purchase_date: string;
  event_title: string;
  date: string;
  time_start: string;
  location: string;
  image_url: string;
}

const TicketsPage = () => {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const data = await ticketsService.getUserTickets();
        setTickets(data);
      } catch (error) {
        toast.error("Failed to load your tickets");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-eventPurple text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Tickets</h1>
            <p className="text-lg">Manage your event tickets here</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-eventPurple" />
            </div>
          ) : tickets.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-6">{tickets.length} Ticket(s) Found</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div className="flex flex-col md:flex-row">
                      <div 
                        className="md:w-1/3 bg-cover bg-center h-40 md:h-auto" 
                        style={{ 
                          backgroundImage: `url(${ticket.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'})` 
                        }}
                      ></div>
                      
                      <div className="p-4 md:p-6 md:w-2/3">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Link 
                              to={`/events/${ticket.event_id}`} 
                              className="text-xl font-semibold text-gray-900 hover:text-eventPurple transition-colors"
                            >
                              {ticket.event_title}
                            </Link>
                            <div className="flex items-center mt-1">
                              <span className={`
                                px-2 py-1 text-xs font-medium rounded-full 
                                ${ticket.status === 'purchased' ? 'bg-green-100 text-green-800' : 
                                  ticket.status === 'used' ? 'bg-gray-100 text-gray-800' : 
                                  'bg-red-100 text-red-800'}
                              `}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-500 hover:text-eventPurple"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(ticket.date)}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {ticket.time_start}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {ticket.location}
                          </div>
                        </div>
                        
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Purchased on {new Date(ticket.purchase_date).toLocaleDateString()}
                            </span>
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {ticket.ticket_code}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button 
                            className="w-full bg-eventPurple hover:bg-eventPurple-dark"
                            onClick={() => {
                              // In a real app, this would show the ticket QR code or ticket details
                              toast.info(`Viewing ticket: ${ticket.ticket_code}`);
                            }}
                          >
                            <Ticket className="h-4 w-4 mr-2" />
                            View Ticket
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                <Ticket className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Tickets Found</h2>
              <p className="text-gray-500 mb-6">You haven't purchased any tickets yet</p>
              <Button 
                className="bg-eventPurple hover:bg-eventPurple-dark"
                onClick={() => window.location.href = '/events'}
              >
                Browse Events
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TicketsPage;
