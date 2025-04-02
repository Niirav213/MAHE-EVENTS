
import { Ticket, Music, Award, Palette, Users, Newspaper, Book, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Academic",
    icon: <Book className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "Lectures, workshops & seminars",
    link: "/events?category=academic"
  },
  {
    name: "Cultural",
    icon: <Palette className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "Art, music & dance performances",
    link: "/events?category=cultural"
  },
  {
    name: "Sports",
    icon: <Trophy className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "Sports competitions & matches",
    link: "/events?category=sports"
  },
  {
    name: "Conferences",
    icon: <Users className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "Student & professional conferences",
    link: "/events?category=conferences"
  },
  {
    name: "Festivals",
    icon: <Award className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "College festivals & celebrations",
    link: "/events?category=festivals"
  },
  {
    name: "Workshops",
    icon: <Ticket className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "Skill-building sessions",
    link: "/events?category=workshops"
  },
  {
    name: "Competitions",
    icon: <Trophy className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "Contest & competitions",
    link: "/events?category=competitions"
  },
  {
    name: "Social",
    icon: <Users className="h-6 w-6 mb-3 text-eventPurple" />,
    description: "Social gatherings & meetups",
    link: "/events?category=social"
  },
];

const CategorySection = () => {
  return (
    <section className="py-12 md:py-16 bg-eventGray">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Explore Campus Events</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link to={category.link} key={index} className="bg-white rounded-lg p-4 md:p-6 text-center hover:shadow-md transition-shadow group">
              <div className="flex justify-center">{category.icon}</div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-eventPurple transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
