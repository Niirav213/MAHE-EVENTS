
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Sample event data
const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "Summer Music Festival",
    date: "Jul 15, 2024",
    time: "4:00 PM - 11:00 PM",
    location: "Central Park, New York",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "Concerts",
    price: "From $49"
  },
  {
    id: "2",
    title: "Tech Innovation Summit",
    date: "Aug 5, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Convention Center, San Francisco",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "Technology",
    price: "$199"
  },
  {
    id: "3",
    title: "Food & Wine Festival",
    date: "Sep 10, 2024",
    time: "12:00 PM - 8:00 PM",
    location: "Waterfront Plaza, Chicago",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "Food & Drink",
    price: "$75"
  },
  {
    id: "4",
    title: "Wellness & Yoga Retreat",
    date: "Oct 8, 2024",
    time: "8:00 AM - 6:00 PM",
    location: "Harmony Resort, Colorado",
    image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "Workshops",
    price: "$120"
  },
  {
    id: "5",
    title: "Art Exhibition - Modern Perspectives",
    date: "Nov 20, 2024",
    time: "10:00 AM - 7:00 PM",
    location: "Gallery 33, Boston",
    image: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "Exhibitions",
    price: "$15"
  },
  {
    id: "6",
    title: "Business Networking Mixer",
    date: "Dec 5, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Downtown Hilton, Seattle",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "Networking",
    price: "$30"
  }
];

const FeaturedEvents = () => {
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title mb-0">Featured Events</h2>
          <Link to="/events" className="hidden md:flex items-center text-eventPurple hover:text-eventPurple-dark transition-colors">
            <span className="mr-1">View all events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 6).map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
        
        <div className="text-center mt-8 md:hidden">
          <Button asChild variant="outline" className="border-eventPurple text-eventPurple hover:bg-eventPurple hover:text-white">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
