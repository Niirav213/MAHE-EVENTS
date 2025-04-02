
import { useState } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Attendee",
    text: "EventBlossom made discovering local events so simple. I found an amazing cooking workshop and met wonderful people. The platform is user-friendly and has become my go-to for weekend plans!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    name: "Michael Chen",
    role: "Event Organizer",
    text: "As an event organizer, EventBlossom has been instrumental in reaching our target audience. The platform is powerful yet easy to use. Our ticket sales have increased by 40% since we started using it!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    name: "Priya Patel",
    role: "Community Manager",
    text: "We've been using EventBlossom for all our community gatherings and the response has been phenomenal. The analytics tools help us understand our audience better with each event.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
];

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-eventPurple-light to-eventPurple">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-10 text-center">
          What People Are Saying
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
            <div className="relative">
              <div className="flex justify-center mb-6">
                <img 
                  src={testimonials[activeTestimonial].avatar} 
                  alt={testimonials[activeTestimonial].name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-eventPurple"
                />
              </div>
              
              <div className="text-center">
                <p className="text-lg md:text-xl italic text-gray-700 mb-6">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="mb-4">
                  <p className="font-semibold text-eventPurple">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-3 mt-6">
                {testimonials.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${index === activeTestimonial ? 'bg-eventPurple' : 'bg-gray-300'}`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-6">
                <button 
                  onClick={prevTestimonial}
                  className="bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-4 h-4 text-eventPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-6">
                <button 
                  onClick={nextTestimonial}
                  className="bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg className="w-4 h-4 text-eventPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
