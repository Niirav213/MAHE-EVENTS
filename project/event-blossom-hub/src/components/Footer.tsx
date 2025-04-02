
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-eventTeal" />
              <span className="text-xl font-bold">EventBlossom</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your premier platform for discovering and managing local events that matter to you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-eventTeal transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eventTeal transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eventTeal transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-eventTeal transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-eventTeal transition-colors">Browse Events</Link>
              </li>
              <li>
                <Link to="/venues" className="text-gray-400 hover:text-eventTeal transition-colors">Venues</Link>
              </li>
              <li>
                <Link to="/organizers" className="text-gray-400 hover:text-eventTeal transition-colors">Event Organizers</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-eventTeal transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-eventTeal transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-eventTeal transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-eventTeal transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-eventTeal transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-eventTeal mt-0.5" />
                <span className="text-gray-400">123 Event Street, City Center, 10001</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-eventTeal mt-0.5" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-eventTeal mt-0.5" />
                <span className="text-gray-400">info@eventblossom.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} EventBlossom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
