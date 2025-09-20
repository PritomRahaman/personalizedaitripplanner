
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X, Sparkles, User, Send, Loader2 } from "lucide-react";
import { InvokeLLM } from "../../integrations/core";

const thinkingSteps = [
  "Analyzing your request...",
  "Accessing travel database...",
  "Evaluating alternatives and costs...",
  "Recalculating budget and schedule...",
  "Finalizing new itinerary..."
];

export default function AgenticEditor({ tripPlan, onClose, onItineraryUpdate }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm your AI travel assistant. How can I modify your itinerary today? For example, you can say 'find cheaper flights' or 'add a relaxing activity on day 3'."
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, thinkingStep]);
  
  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setThinkingStep(prev => (prev + 1) % thinkingSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);


  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsProcessing(true);
    setThinkingStep(0);

    try {
      const prompt = `You are an expert travel agent AI. Your task is to modify a given travel itinerary based on a user's request.

      Here is the current itinerary in JSON format:
      ${JSON.stringify(tripPlan, null, 2)}

      Here is the user's request:
      "${userInput}"

      Your task is to:
      1. Understand the user's request and modify the JSON itinerary to fulfill it. Update costs, totals, and schedules as needed.
      2. Provide a brief, friendly confirmation message explaining the change you made.
      3. Return ONLY a JSON object with two keys: 'updatedItinerary' (the complete, modified itinerary object conforming to the original schema) and 'confirmationMessage' (a string). Ensure the 'updatedItinerary' is a valid JSON object.`;

      const aiResponse = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            updatedItinerary: { type: "object" },
            confirmationMessage: { type: "string" }
          }
        }
      });
      
      if (aiResponse && aiResponse.updatedItinerary && aiResponse.confirmationMessage) {
        onItineraryUpdate(aiResponse.updatedItinerary);
        setMessages([...newMessages, { sender: 'ai', text: aiResponse.confirmationMessage }]);
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (error) {
      console.error("Error modifying itinerary:", error);
      setMessages([...newMessages, { sender: 'ai', text: "I'm sorry, I encountered an error trying to modify your plan. Please try a different request." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-700" />
            AI Itinerary Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-md p-3 rounded-lg bg-slate-100 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm">{thinkingSteps[thinkingStep]}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="e.g., 'Change my hotel on day 1 to a luxury one...'"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isProcessing}
              className="h-12"
            />
            <Button onClick={handleSendMessage} disabled={isProcessing} size="icon" className="h-12 w-12 flex-shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
