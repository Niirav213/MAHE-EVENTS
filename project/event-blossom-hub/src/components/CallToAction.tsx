
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-20 bg-eventGray">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-eventPurple-dark mb-4">
              Ready to Host Your Own Event?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Whether it's a workshop, concert, exhibition or a conference, CollegeEventHub makes it easy to create, promote, and manage your events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-eventPurple hover:bg-eventPurple-dark text-white px-8 py-3 text-lg h-14">
                <Link to="/create-event">Create an Event</Link>
              </Button>
              <Button asChild variant="outline" className="border-eventPurple text-eventPurple hover:bg-eventPurple hover:text-white px-8 py-3 text-lg h-14">
                <Link to="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
