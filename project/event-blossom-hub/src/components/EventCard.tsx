
import { Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  price?: string;
}

const EventCard = ({ id, title, date, time, location, image, category, price }: EventCardProps) => {
  return (
    <Link to={`/events/${id}`} className="event-card block group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 bg-eventPurple text-white px-3 py-1 text-sm font-medium rounded-bl-md">
          {category}
        </div>
        {price && (
          <div className="absolute bottom-0 right-0 bg-eventTeal text-white px-3 py-1 text-sm font-medium rounded-tl-md">
            {price}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-2 group-hover:text-eventPurple transition-colors">
          {title}
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 text-eventPurple mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 text-eventPurple mr-2" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 text-eventPurple mr-2" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
