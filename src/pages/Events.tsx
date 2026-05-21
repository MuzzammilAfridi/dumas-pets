import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "Pet Nutrition Workshop",
    description: "Join us for an interactive workshop on understanding your pet's nutritional needs and learning to prepare healthy meals at home.",
    date: "February 15, 2024",
    time: "10:00 AM - 1:00 PM",
    location: "Whitefield Community Center, Bengaluru",
    type: "Workshop"
  },
  {
    id: 2,
    title: "Adoption Drive & Pet Fair",
    description: "A special event combining pet adoption opportunities with fun activities, treats sampling, and expert consultations.",
    date: "February 28, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Phoenix Marketcity, Bengaluru",
    type: "Community Event"
  },
  {
    id: 3,
    title: "Healthy Treats Baking Class",
    description: "Learn to bake delicious and nutritious treats for your furry friends with our expert bakers.",
    date: "March 10, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "DumasBakesnMeals Kitchen, Whitefield",
    type: "Class"
  },
  {
    id: 4,
    title: "Annual Pet Health Camp",
    description: "Free health checkups, vaccination drives, and nutrition consultations for all pets. Open to the community.",
    date: "March 25, 2024",
    time: "8:00 AM - 4:00 PM",
    location: "Whitefield Park, Bengaluru",
    type: "Health Camp"
  }
];

const Events = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Events & Activities
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join our community events, workshops, and welfare activities
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Upcoming Events
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex flex-col items-center justify-center text-primary-foreground">
                      <span className="text-2xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                      <span className="text-sm">{event.date.split(' ')[0].substring(0, 3)}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-2">
                      {event.type}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                      <Link to={`/events/${event.id}`}>Register Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default Events;
