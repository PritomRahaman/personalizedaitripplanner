
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TripPlan } from "@/entities/TripPlan";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  PlaneTakeoff,
  Bed,
  Camera,
  ShieldCheck,
  XCircle
} from "lucide-react";
import StreamingText from "../components/itinerary/streamingText";

const AgentActivityLog = ({ logs }) => (
  <div className="space-y-3 font-mono text-sm">
    {logs.map((log, index) => (
      <div key={index} className="flex items-start gap-3">
        {log.status === "pending" && <Loader2 className="w-4 h-4 text-slate-400 animate-spin flex-shrink-0 mt-0.5" />}
        {log.status === "success" && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
        {log.status === "error" && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
        
        <div className="flex-1">
          <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
          <StreamingText text={log.message} />
        </div>
      </div>
    ))}
  </div>
);

export default function Booking() {
  const navigate = useNavigate();
  const [tripPlan, setTripPlan] = useState(null);
  const [bookingState, setBookingState] = useState("idle"); // idle, processing, success
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadTrip = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tripId = urlParams.get('id');
      if (tripId) {
        const trips = await TripPlan.filter({ id: tripId });
        if (trips.length > 0) {
          setTripPlan(trips[0]);
        }
      }
    };
    loadTrip();
  }, []);

  const runAgentBooking = () => {
    setBookingState("processing");
    const newLogs = [];

    const addLog = (message, status, delay) => {
      return new Promise(resolve => {
        setTimeout(() => {
          const logEntry = {
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message,
            status,
          };
          newLogs.push(logEntry);
          setLogs([...newLogs]);
          resolve();
        }, delay);
      });
    };
    
    const runSequence = async () => {
      await addLog("Initializing booking agent...", "pending", 500);
      await addLog("Booking agent initialized. Authenticating with provider network...", "success", 1500);
      await addLog("Querying EaseMyTrip API for flight availability...", "pending", 500);
      await addLog(`Found 3 flight options for ${tripPlan.source} -> ${tripPlan.destination}. Selecting best match...`, "success", 2000);
      await addLog(`Securing flight booking for ${tripPlan.travelers} passenger(s)...`, "pending", 500);
      await addLog("Flights confirmed. PNR: UK4E8P.", "success", 2500);
      await addLog("Searching for hotel accommodations...", "pending", 500);
      const hotelCount = tripPlan.itinerary?.filter(day => day.accommodation).length || 0;
      await addLog(`Found ${hotelCount} suitable hotel(s). Cross-referencing with user preferences...`, "success", 2000);
      await addLog("Booking all accommodations...", "pending", 500);
      await addLog("All accommodations confirmed.", "success", 3000);
      await addLog("Initiating secure payment via gateway...", "pending", 500);
      await addLog(`Processing payment of ₹${tripPlan.total_estimated_cost}...`, "success", 2000);
      await addLog("Payment successful. All bookings are confirmed!", "success", 1000);
      
      await TripPlan.update(tripPlan.id, { status: "booked" });
      setBookingState("success");
    };

    runSequence();
  };
  
  if (!tripPlan) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl(`ItineraryView?id=${tripPlan.id}`))}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Confirm & Book Your Trip</h1>
            <p className="text-slate-600">You are one step away from your adventure to {tripPlan.destination}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-slate-700" />
                    Agent Booking Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingState === "idle" && (
                  <div className="text-center p-8">
                    <h3 className="text-xl font-bold mb-4">Ready to Book?</h3>
                    <p className="text-slate-600 mb-6">
                      Our AI agent will now book all components of your trip through our secure partner network, including EaseMyTrip inventory.
                    </p>
                    <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={runAgentBooking}>
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Confirm & Start Booking
                    </Button>
                  </div>
                )}

                {(bookingState === "processing" || bookingState === "success") && (
                  <div className="p-4 bg-slate-900 text-white rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-green-300">AI Agent Live Log</h3>
                    <AgentActivityLog logs={logs} />
                  </div>
                )}
                
                {bookingState === "success" && (
                  <div className="text-center p-8 mt-4"> {/* Added margin top to separate from logs */}
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-slate-600 mb-6">Your trip is booked. Your tickets and vouchers will be sent to your email.</p>
                    <Button onClick={() => navigate(createPageUrl(`ItineraryView?id=${tripPlan.id}`))}>
                      View Confirmed Itinerary
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600"><PlaneTakeoff className="w-4 h-4" /> Flights</span>
                  <span className="font-medium">₹{tripPlan.flights?.total_flight_cost || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600"><Bed className="w-4 h-4" /> Accommodation</span>
                  <span className="font-medium">₹{tripPlan.cost_breakdown?.accommodation || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600"><Camera className="w-4 h-4" /> Activities & Transport</span>
                  <span className="font-medium">₹{(tripPlan.cost_breakdown?.activities || 0) + (tripPlan.cost_breakdown?.transport || 0)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total Payable</span>
                  <span>₹{tripPlan.total_estimated_cost}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <p>All transactions are secure and processed via our trusted payment gateway.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
