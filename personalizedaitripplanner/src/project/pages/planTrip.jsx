
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { MapPin, Calendar, IndianRupee, Users, Sparkles, ArrowRight, Loader2, PlaneTakeoff } from "lucide-react";
import { TripPlan } from "../entities/tripPlan";
import { InvokeLLM } from "../integrations/core"
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/index";

const TRAVEL_THEMES = [
  { id: "heritage", name: "Heritage & Culture", icon: "🏛️" },
  { id: "adventure", name: "Adventure", icon: "🏔️" },
  { id: "nature", name: "Nature & Wildlife", icon: "🌿" },
  { id: "food", name: "Food & Culinary", icon: "🍛" },
  { id: "wellness", name: "Wellness & Spa", icon: "🧘" },
  { id: "nightlife", name: "Nightlife & Entertainment", icon: "🌃" },
  { id: "photography", name: "Photography", icon: "📸" },
  { id: "shopping", name: "Shopping", icon: "🛍️" },
];

const INDIAN_DESTINATIONS = [
  "Select","Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Goa", "Kerala", "Rajasthan", "Himachal Pradesh", "Uttarakhand", "Jammu & Kashmir",
  "Andaman & Nicobar", "Ladakh", "Sikkim", "Meghalaya", "Assam", "Darjeeling",
  "Rishikesh", "Varanasi", "Agra", "Jodhpur", "Udaipur", "Jaisalmer", "Pushkar",
  "Hampi", "Mysore", "Coorg", "Munnar", "Alleppey", "Kovalam", "Varkala"
];
export default function PlanTrip() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: "",
    themes: [],
    accommodationType: "mid-range",
    additionalRequests: ""
  });
  const [errors, setErrors] = useState({});

  const handleThemeToggle = (themeId) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(themeId)
        ? prev.themes.filter(id => id !== themeId)
        : [...prev.themes, themeId]
    }));
  };
  const validateField = (field, value) => {
    const today = new Date().toISOString().split("T")[0];
  let errorMsg = "";
 
  switch (field) {
    case "budget":
      if (!value || parseFloat(value) === 0) errorMsg = "Budget is required.";
      else if (isNaN(value) || parseFloat(value) < 0)
        errorMsg = "Budget must be a positive number.";
      break;
 
    case "startDate":
      if (!value) errorMsg = "Start date is required.";
      else if (value < today) errorMsg = "Start date cannot be in the past.";
      break;
 
    case "endDate":
      if (!value) errorMsg = "End date is required.";
      else if (value < today) errorMsg = "End date cannot be in the past.";
      else if (formData.startDate && value < formData.startDate)
        errorMsg = "End date must be after start date.";
      break;
 
    default:
      break;
  }
 
  setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };
const generateItinerary = async () => {
  if (
    !formData.source ||
    !formData.destination ||
    !formData.startDate ||
    !formData.endDate ||
    !formData.budget ||
    !formData.travelers
  ) {
    alert("Please fill in all required fields");
    return;
  }

  const budget = parseFloat(formData.budget);
  const travelers = parseInt(formData.travelers);

  if (isNaN(budget) || budget <= 0) {
    alert("Budget must be a positive number.");
    return;
  }

  if (isNaN(travelers) || travelers <= 0) {
    alert("Number of travelers must be at least 1.");
    return;
  }

  const budgetPerPerson = budget / travelers;

  setIsGenerating(true);
    
    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      const prompt = `Create a detailed ${durationDays}-day travel itinerary from ${formData.source} to ${formData.destination}, India for ${formData.travelers} travelers. Include flight booking suggestions from source to destination and back.

      Trip Details:
      - Source: ${formData.source}
      - Destination: ${formData.destination}
      - Duration: ${durationDays} days (${formData.startDate} to ${formData.endDate})
      - Budget: ₹${formData.budget} total
      - Travelers: ${formData.travelers}
      - Themes: ${formData.themes.join(", ")}
      - Accommodation: ${formData.accommodationType}
      - Special requests: ${formData.additionalRequests}

      Create a comprehensive itinerary with:
      1. Flight recommendations (including suggested airlines, flight numbers, timings, and estimated costs) from ${formData.source} to ${formData.destination} and back.
      2. Day-by-day detailed schedule with timings
      3. Specific activities, attractions, and experiences
      4. Accommodation recommendations for each night
      5. Transportation between locations (other than flights)
      6. Meal suggestions including local cuisine
      7. Realistic cost estimates for each activity
      8. Travel tips and recommendations
      9. Consider weather, local festivals, and best times to visit

      Focus on ${formData.themes.length > 0 ? formData.themes.join(" and ") + " experiences" : "diverse experiences"}.
      Make it authentic, practical, and within the specified budget.`;
      console.log("Prompt sent to LLM:", prompt);
      const aiResponse = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            flights: {
                "type": "object",
                "description": "Flight details",
                "properties": {
                    "departure_flight": {
                        "type": "object",
                        "properties": {
                            "airline": { "type": "string" }, "flight_number": { "type": "string" }, "departure_airport": { "type": "string" }, "arrival_airport": { "type": "string" }, "departure_time": { "type": "string" }, "arrival_time": { "type": "string" }, "duration": { "type": "string" }, "cost": { type: "number" }
                        }
                    },
                    "return_flight": {
                        "type": "object",
                        "properties": {
                            "airline": { "type": "string" }, "flight_number": { "type": "string" }, "departure_airport": { "type": "string" }, "arrival_airport": { "type": "string" }, "departure_time": { "type": "string" }, "arrival_time": { "type": "string" }, "duration": { "type": "string" }, "cost": { type: "number" }
                        }
                    },
                    "total_flight_cost": { type: "number" }
                }
            },
            itinerary: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  date: { type: "string" },
                  location: { type: "string" },
                  activities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        time: { type: "string" },
                        activity: { type: "string" },
                        location: { type: "string" },
                        cost: { type: "number" },
                        duration: { type: "string" },
                        type: { type: "string" }
                      }
                    }
                  },
                  accommodation: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      type: { type: "string" },
                      cost: { type: "number" },
                      location: { type: "string" }
                    }
                  },
                  total_cost: { type: "number" }
                }
              }
            },
            total_estimated_cost: { type: "number" },
            cost_breakdown: {
              type: "object",
              properties: {
                accommodation: { type: "number" },
                transport: { type: "number" },
                activities: { type: "number" },
                meals: { type: "number" },
                miscellaneous: { type: "number" }
              }
            },
            ai_recommendations: { type: "string" }
          }
        }
      });
    const tripData = {
      title: `Trip from ${formData.source} to ${formData.destination}`,
      source: formData.source,
      destination: formData.destination,
      start_date: formData.startDate,
      end_date: formData.endDate,
      duration_days: durationDays,
      budget: budget,
      budget_per_person: budgetPerPerson,
      travelers: travelers,
      travel_themes: formData.themes,
      accommodation_type: formData.accommodationType,
      transport_preferences: ["flight", "train", "local_transport"],
      flights: aiResponse.flights,
      itinerary: aiResponse.itinerary,
      total_estimated_cost: aiResponse.total_estimated_cost,
      cost_breakdown: aiResponse.cost_breakdown,
      status: "generated",
      ai_recommendations: aiResponse.ai_recommendations
    };

    const savedTrip = await TripPlan.create(tripData);
    console.log(savedTrip.id);
    navigate(createPageUrl(`ItineraryView?id=${savedTrip.id}`));
  } catch (error) {
    console.error("Error generating itinerary:", error);
    alert("Failed to generate itinerary. Please try again.");
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-slate-600">
            Tell us your preferences and let AI craft your personalized itinerary
          </p>
        </div>

        <Card className="shadow-xl border-none">
          <CardHeader className="gradient-bg text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Source & Destination */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-lg font-semibold flex items-center gap-2">
                  <PlaneTakeoff className="w-5 h-5 text-slate-600" />
                  Source *
                </Label>
                <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select your starting city" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_DESTINATIONS.map(dest => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  Destination *
                </Label>
                <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select destination in India" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_DESTINATIONS.map(dest => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Dates & Travelers/Budget */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    Start Date *
                  </Label>
                  <Input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, startDate: value }));
                      validateField("startDate", value);
                    }}                    
                    className="h-12 text-lg"
                  />
                 {errors.startDate && <p className="text-red-600 text-sm">{errors.startDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-lg font-semibold">End Date *</Label>
                  <Input 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, endDate: value }));
                      validateField("endDate", value);
                    }}                   
                  className="h-12 text-lg"
                  />
                {errors.endDate && <p className="text-red-600 text-sm">{errors.endDate}</p>}
                </div>
              </div>
               {/* Travelers & Budget */}
              <div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="travelers" className="text-lg font-semibold flex items-center gap-2">
      <Users className="w-5 h-5 text-slate-600" />
      Travelers *
    </Label>
<Select
  value={formData.travelers?.toString() ?? "1"}
  onValueChange={(value) => {
    setFormData(prev => ({ ...prev, travelers: parseInt(value) }));
  }}
>      <SelectTrigger className="h-12 text-lg">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
          <SelectItem key={num} value={num.toString()}>
            {num} {num === 1 ? 'Traveler' : 'Travelers'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-lg font-semibold flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-slate-600" />
                    Budget (₹) *
                  </Label>
                  <Input 
                    type="number" 
                    placeholder="50000"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="h-12 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Travel Themes */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Travel Themes & Interests</Label>
              <p className="text-slate-600">Select all that interest you (optional)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TRAVEL_THEMES.map(theme => (
                  <div key={theme.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={theme.id}
                      checked={formData.themes.includes(theme.id)}
                      onCheckedChange={() => handleThemeToggle(theme.id)}
                    />
                    <Label htmlFor={theme.id} className="text-sm font-medium cursor-pointer flex items-center gap-1">
                      <span>{theme.icon}</span>
                      {theme.name}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.themes.map(themeId => {
                  const theme = TRAVEL_THEMES.find(t => t.id === themeId);
                  return (
                    <Badge key={themeId} variant="secondary" className="bg-slate-900 text-white">
                      {theme?.icon} {theme?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Accommodation Type */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Accommodation Preference</Label>
              <Select value={formData.accommodationType} onValueChange={(value) => setFormData(prev => ({ ...prev, accommodationType: value }))}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget (₹1,000-3,000/night)</SelectItem>
                  <SelectItem value="mid-range">Mid-range (₹3,000-8,000/night)</SelectItem>
                  <SelectItem value="luxury">Luxury (₹8,000+/night)</SelectItem>
                  <SelectItem value="mixed">Mixed (Budget to Luxury)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Requests */}
            <div className="space-y-2">
              <Label htmlFor="additionalRequests" className="text-lg font-semibold">
            Additional Requests or Special Requirements
          </Label>
        <Textarea
        placeholder="Any specific places you want to visit, dietary restrictions, accessibility needs, or other preferences..."
        value={formData.additionalRequests}
        onChange={(e) =>
        setFormData((prev) => ({ ...prev, additionalRequests: e.target.value }))
         }
        className="h-24 text-lg w-full resize-none"/>
        </div>


            {/* Generate Button */}
            <Button 
              onClick={generateItinerary}
              disabled={isGenerating}
              size="lg"
              className="w-full bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Generating Your Perfect Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-2" />
                  Generate AI Itinerary
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
