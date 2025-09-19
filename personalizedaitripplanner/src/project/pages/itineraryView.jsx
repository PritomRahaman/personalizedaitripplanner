import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/index";
import { TripPlan } from "../entities/tripPlan";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { db, ref, get, child } from "../../firebase";
import { Separator } from "../components/ui/separator";
import {
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  Clock,
  Bed,
  Car,
  Utensils,
  Camera,
  Share2,
  Download,
  CreditCard,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  PlaneTakeoff,
  PlaneLanding,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import AgenticEditor from "../components/itinerary/agenticEditor";
import MapView from "../components/itinerary/MapView";

const ACTIVITY_ICONS = {
  accommodation: Bed,
  transport: Car,
  activity: Camera,
  meal: Utensils,
  shopping: "🛍️",
};

export default function ItineraryView() {
  const navigate = useNavigate();
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadTripPlan = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tripId = urlParams.get("id");
      console.log("🔍 Loading trip with ID:", tripId);

      if (!tripId) {
        console.warn("❌ No trip ID in URL");
        setLoading(false);
        return;
      }

      try {
        const trip = await TripPlan.getById(tripId);

        if (trip) {
          console.log("✅ Trip data loaded:", trip);
          setTripPlan(trip); // already contains `id`
        } else {
          console.warn("❌ No trip found at ID:", tripId);
        }
      } catch (err) {
        console.error("🔥 Firebase error:", err);
      }

      setLoading(false);
    };

    loadTripPlan();
  }, []);

  // useEffect(() => {
  //   const debugAllTrips = async () => {
  //     const allSnap = await get(child(ref(db), 'tripPlans'));
  //     const allData = allSnap.val();
  //     console.log("🗂️ All tripPlans:", allData);
  //   };
  //   debugAllTrips();
  // }, []);

  const handleItineraryUpdate = async (updatedItineraryData) => {
    setTripPlan((prev) => ({ ...prev, ...updatedItineraryData }));
    await TripPlan.update(tripPlan.id, updatedItineraryData);
  };

  const shareItinerary = async () => {
    if (!tripPlan) return; // Ensure tripPlan exists before attempting to share

    const shareData = {
      title: tripPlan.title,
      text: `Check out my ${tripPlan.destination} trip itinerary!`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported and available
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      console.log("Web Share API failed, falling back to clipboard:", error);
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Trip link copied to clipboard! Share it with your friends.");
    } catch (clipboardError) {
      console.error("Clipboard API failed:", clipboardError);
      // Final fallback: Create a temporary input element
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Trip link copied to clipboard! Share it with your friends.");
      } catch (execError) {
        console.error("All copy methods failed:", execError);
        alert(`Please copy this link manually: ${window.location.href}`);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const exportItinerary = () => {
    const itineraryText = `
${tripPlan.title}
Destination: ${tripPlan.destination}
Duration: ${tripPlan.duration_days} days
Budget: ₹${tripPlan.total_estimated_cost}
Travelers: ${tripPlan.travelers}

ITINERARY:
${tripPlan.itinerary
  ?.map(
    (day) => `
Day ${day.day} - ${day.date}
Location: ${day.location}
${day.activities
  ?.map(
    (activity) =>
      `• ${activity.time}: ${activity.activity} at ${activity.location} (₹${activity.cost})`
  )
  .join("\n")}
Accommodation: ${day.accommodation?.name} (₹${day.accommodation?.cost})
`
  )
  .join("\n")}

AI Recommendations:
${tripPlan.ai_recommendations}
    `.trim();

    const blob = new Blob([itineraryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tripPlan.destination}_itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const proceedToBooking = () => {
    navigate(createPageUrl(`Booking?id=${tripPlan.id}`));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (!tripPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">Trip plan not found</p>
          <Button onClick={() => navigate(createPageUrl("PlanTrip"))}>
            Plan a New Trip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      {isEditing && (
        <AgenticEditor
          tripPlan={tripPlan}
          onClose={() => setIsEditing(false)}
          onItineraryUpdate={handleItineraryUpdate}
        />
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("MyTrips"))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {tripPlan.title}
              </h1>
              <p className="text-slate-600 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {tripPlan.source} to {tripPlan.destination} •{" "}
                {tripPlan.duration_days} days • {tripPlan.travelers} travelers
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Modify with AI
            </Button>
            <Button variant="outline" onClick={shareItinerary}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={exportItinerary}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {tripPlan.status !== "booked" && (
              <Button
                onClick={proceedToBooking}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Book Trip (₹{tripPlan.total_estimated_cost})
              </Button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {tripPlan.status === "booked" && (
          <div className="mb-6">
            <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Booked & Confirmed
            </Badge>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Itinerary */}
          <div className="lg:col-span-3 space-y-6">
            {/* Flight Details */}
            {tripPlan.flights && (
              <Card className="shadow-lg border-none">
                <CardHeader className="gradient-bg text-white">
                  <CardTitle className="flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5" />
                    Flight Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {tripPlan.flights.departure_flight && (
                    <div className="p-4 rounded-lg bg-slate-50">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
                        <PlaneTakeoff className="w-4 h-4" /> Departure:{" "}
                        {tripPlan.flights.departure_flight.departure_airport} to{" "}
                        {tripPlan.flights.departure_flight.arrival_airport}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <p>
                          <strong>Airline:</strong>{" "}
                          {tripPlan.flights.departure_flight.airline}
                        </p>
                        <p>
                          <strong>Flight:</strong>{" "}
                          {tripPlan.flights.departure_flight.flight_number}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {tripPlan.flights.departure_flight.departure_time} -{" "}
                          {tripPlan.flights.departure_flight.arrival_time}
                        </p>
                        <p>
                          <strong>Cost:</strong> ₹
                          {tripPlan.flights.departure_flight.cost}
                        </p>
                      </div>
                    </div>
                  )}
                  {tripPlan.flights.return_flight && (
                    <div className="p-4 rounded-lg bg-slate-50">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
                        <PlaneLanding className="w-4 h-4" /> Return:{" "}
                        {tripPlan.flights.return_flight.departure_airport} to{" "}
                        {tripPlan.flights.return_flight.arrival_airport}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <p>
                          <strong>Airline:</strong>{" "}
                          {tripPlan.flights.return_flight.airline}
                        </p>
                        <p>
                          <strong>Flight:</strong>{" "}
                          {tripPlan.flights.return_flight.flight_number}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {tripPlan.flights.return_flight.departure_time} -{" "}
                          {tripPlan.flights.return_flight.arrival_time}
                        </p>
                        <p>
                          <strong>Cost:</strong> ₹
                          {tripPlan.flights.return_flight.cost}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t flex justify-between items-center font-bold">
                    <span>Total Flight Cost</span>
                    <span>₹{tripPlan.flights.total_flight_cost}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {tripPlan.itinerary?.map((day, dayIndex) => (
              <Card key={dayIndex} className="shadow-lg border-none">
                <CardHeader className="gradient-bg text-white">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Day {day.day} -{" "}
                      {format(new Date(day.date), "EEEE, MMMM d")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {day.location}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Hotel: {day.accommodation?.name}</p>
                  <div style={{ width: "100%", height: "300px" }}>
                    <MapView
                      hotelLocation={{ lat: 12.9716, lng: 77.5946 }}
                      activities={[
                        {
                          name: "Activity 1",
                          coords: { lat: 12.975, lng: 77.59 },
                        },
                        {
                          name: "Activity 2",
                          coords: { lat: 12.968, lng: 77.6 },
                        },
                      ]}
                    />
                  </div>
                </CardContent>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {day.activities?.map((activity, activityIndex) => {
                      const IconComponent =
                        ACTIVITY_ICONS[activity.type] || Camera;
                      return (
                        <div
                          key={activityIndex}
                          className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                            {typeof IconComponent === "string" ? (
                              <span className="text-lg">{IconComponent}</span>
                            ) : (
                              <IconComponent className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-slate-900">
                                {activity.activity}
                              </h4>
                              <Badge variant="secondary" className="ml-2">
                                ₹{activity.cost}
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-sm mb-1">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {activity.time} • {activity.duration}
                            </p>
                            <p className="text-slate-600 text-sm">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {activity.location}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {day.accommodation && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bed className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {day.accommodation.name}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {day.accommodation.type} •{" "}
                              {day.accommodation.location}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          ₹{day.accommodation.cost}
                        </Badge>
                      </div>
                    </>
                  )}

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-sm text-slate-600">Day Total</span>
                    <span className="font-bold text-lg">₹{day.total_cost}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Summary */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Trip Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">
                      {tripPlan.duration_days}
                    </p>
                    <p className="text-sm text-slate-600">Days</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">
                      {tripPlan.travelers}
                    </p>
                    <p className="text-sm text-slate-600">Travelers</p>
                  </div>
                </div>

                <Separator />

                {tripPlan.cost_breakdown && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Cost Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Accommodation</span>
                        <span>₹{tripPlan.cost_breakdown.accommodation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport</span>
                        <span>₹{tripPlan.cost_breakdown.transport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Activities</span>
                        <span>₹{tripPlan.cost_breakdown.activities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Meals</span>
                        <span>₹{tripPlan.cost_breakdown.meals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Miscellaneous</span>
                        <span>₹{tripPlan.cost_breakdown.miscellaneous}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{tripPlan.total_estimated_cost}</span>
                    </div>

                    <div className="text-sm text-slate-600 text-center">
                      ₹
                      {Math.round(
                        tripPlan.total_estimated_cost / tripPlan.travelers
                      )}{" "}
                      per person
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Travel Themes */}
            {tripPlan.travel_themes && tripPlan.travel_themes.length > 0 && (
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Travel Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tripPlan.travel_themes.map((theme) => (
                      <Badge
                        key={theme}
                        variant="secondary"
                        className="capitalize"
                      >
                        {theme.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Recommendations */}
            {tripPlan.ai_recommendations && (
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Travel Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {tripPlan.ai_recommendations}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
