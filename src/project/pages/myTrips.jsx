
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/index";
import { TripPlan } from "../entities/tripPlan";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Users, 
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";
import { format } from "date-fns";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
  generated: { label: "Generated", color: "bg-blue-100 text-blue-800", icon: Clock },
  booked: { label: "Booked", color: "bg-green-100 text-green-800", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-purple-100 text-purple-800", icon: CheckCircle }
};

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const fetchedTrips = await TripPlan.list();
        fetchedTrips.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));        
        setTrips(fetchedTrips);
        setFilteredTrips(fetchedTrips);
      } catch (error) {
        console.error("Error loading trips:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadTrips();
  }, []);
  

  useEffect(() => {
    let filtered = trips;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(trip => 
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.source?.toLowerCase().includes(searchTerm.toLowerCase()) // Added source to search
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    setFilteredTrips(filtered);
  }, [trips, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">My Trips</h1>
            <p className="text-slate-600">Manage and view all your travel plans</p>
          </div>
          <Link to={createPageUrl("PlanTrip")}>
            <Button size="lg" className="text-white bg-slate-900 hover:bg-slate-500">
              <Plus className="w-5 h-5 mr-2" />
              Plan New Trip
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search destinations or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="generated">Generated</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-slate-600 flex items-center justify-center md:justify-start">
            {filteredTrips.length} of {trips.length} trips
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {trips.length === 0 ? "No trips planned yet" : "No trips match your search"}
            </h3>
            <p className="text-slate-600 mb-6">
              {trips.length === 0 
                ? "Start planning your dream vacation with our AI-powered trip planner" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            <Link to={createPageUrl("PlanTrip")}>
              <Button size="lg" className="text-white bg-slate-900 hover:bg-slate-500">
                <Plus className="w-5 h-5 mr-2" />
                Plan Your First Trip
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => {
              const statusConfig = STATUS_CONFIG[trip.status] || STATUS_CONFIG.draft;
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={trip.id} className="shadow-lg border-none hover:shadow-xl transition-shadow duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-slate-900 group-hover:text-slate-700 transition-colors">
                          {trip.title || `${trip.destination} Trip`}
                        </CardTitle>
                        <p className="text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {trip.source ? `${trip.source} to ${trip.destination}` : trip.destination}
                        </p>
                      </div>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Trip Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <div className="text-sm">
                          <p className="font-medium">{trip.duration_days} days</p>
                          <p className="text-slate-600 text-xs">
                            {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <div className="text-sm">
                          <p className="font-medium">{trip.travelers} travelers</p>
                          <p className="text-slate-600 text-xs">Total</p>
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-lg">
                          ₹{trip.total_estimated_cost?.toLocaleString() || trip.budget?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        ₹{Math.round((trip.total_estimated_cost || trip.budget) / trip.travelers).toLocaleString()} /person
                      </div>
                    </div>

                    {/* Travel Themes */}
                    {trip.travel_themes && trip.travel_themes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {trip.travel_themes.slice(0, 3).map(theme => (
                          <Badge key={theme} variant="secondary" className="text-xs capitalize">
                            {theme.replace('_', ' ')}
                          </Badge>
                        ))}
                        {trip.travel_themes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{trip.travel_themes.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link to={createPageUrl(`ItineraryView?id=${trip.id}`)} className="block">
                      <Button className="w-full mt-4 group-hover:bg-yellow-800 transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View Itinerary
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
