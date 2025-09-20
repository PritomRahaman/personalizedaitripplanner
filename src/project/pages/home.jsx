import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/index";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { PlaneTakeoff, Sparkles, MapPin, Calendar, Users, IndianRupee, Compass } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Planning",
      description: "Our advanced AI creates personalized itineraries based on your preferences, budget, and travel style."
    },
    {
      icon: MapPin,
      title: "Real-time Recommendations", 
      description: "Get up-to-date suggestions for activities, restaurants, and attractions tailored to your interests."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Optimized day-by-day plans that maximize your time and minimize travel between locations."
    },
    {
      icon: IndianRupee,
      title: "Budget Optimization",
      description: "Stay within budget with transparent cost breakdowns and smart spending recommendations."
    }
  ];

  const destinations = [
    { name: "Rajasthan", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", theme: "Heritage" },
    { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400", theme: "Nature" },
    { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400", theme: "Beach & Nightlife" },
    { name: "Himachal Pradesh", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", theme: "Adventure" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 gradient-bg opacity-95"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Compass className="w-8 h-8 text-yellow-300" />
              <span className="text-yellow-300 font-medium tracking-wide">TripCraft AI</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Perfect Trip,
              <span className="block gold-accent">Crafted by AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-white-100 mb-8 max-w-3xl mx-auto leading-relaxed font-bold italic">
              Experience personalized travel planning with AI that understands your budget, interests, and dreams. 
              From heritage tours to adventure trails - we create your perfect Indian journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("PlanTrip")}>
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <PlaneTakeoff className="w-6 h-6 mr-2" />
                  Start Planning Your Trip 
                </Button>
              </Link>
              <Link to={createPageUrl("MyTrips")}>
                <Button variant="outline" size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Calendar className="w-6 h-6 mr-2" />
                  View My Trips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose TripCraft AI?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We leverage cutting-edge AI to create travel experiences that are uniquely yours
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 gradient-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Discover India's Treasures
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From royal palaces to serene backwaters, let AI craft your perfect Indian adventure
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                    <p className="text-slate-200 text-sm">{destination.theme}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience India Like Never Before?
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TripCraft AI to create their perfect Indian journey. 
            Start planning your personalized adventure today.
          </p>
          <Link to={createPageUrl("PlanTrip")}>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold px-8 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-6 h-6 mr-2" />
              Create My Perfect Trip
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}