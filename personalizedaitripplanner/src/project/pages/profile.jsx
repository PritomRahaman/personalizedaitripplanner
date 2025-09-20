import React, { useState, useEffect } from "react";
import { User, UserPreferences } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { User as UserIcon, Settings, Heart, MapPin, Utensils, Accessibility } from "lucide-react";

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

const ACCOMMODATION_TYPES = [
  { id: "hotel", name: "Hotels" },
  { id: "resort", name: "Resorts" },
  { id: "homestay", name: "Homestays" },
  { id: "hostel", name: "Hostels" },
  { id: "boutique", name: "Boutique Properties" },
  { id: "heritage_property", name: "Heritage Properties" },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        // Load user preferences
        const userPrefs = await UserPreferences.filter({ created_by: currentUser.email });
        if (userPrefs.length > 0) {
          setPreferences(userPrefs[0]);
        } else {
          // Create default preferences
          const defaultPrefs = {
            travel_style: "mid-range",
            preferred_themes: [],
            accommodation_preferences: [],
            dietary_restrictions: [],
            language_preference: "english",
            mobility_requirements: "none",
            group_travel_preference: "couple"
          };
          const createdPrefs = await UserPreferences.create(defaultPrefs);
          setPreferences(createdPrefs);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThemeToggle = (themeId) => {
    setPreferences(prev => ({
      ...prev,
      preferred_themes: prev.preferred_themes.includes(themeId)
        ? prev.preferred_themes.filter(id => id !== themeId)
        : [...prev.preferred_themes, themeId]
    }));
  };

  const handleAccommodationToggle = (accommodationId) => {
    setPreferences(prev => ({
      ...prev,
      accommodation_preferences: prev.accommodation_preferences.includes(accommodationId)
        ? prev.accommodation_preferences.filter(id => id !== accommodationId)
        : [...prev.accommodation_preferences, accommodationId]
    }));
  };

  const handleDietaryToggle = (dietary) => {
    setPreferences(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(dietary)
        ? prev.dietary_restrictions.filter(id => id !== dietary)
        : [...prev.dietary_restrictions, dietary]
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await UserPreferences.update(preferences.id, preferences);
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Travel Profile</h1>
          <p className="text-xl text-slate-600">Customize your travel preferences for better AI recommendations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-none">
              <CardHeader className="gradient-bg text-white">
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{user?.full_name}</h3>
                  <p className="text-slate-600 mb-4">{user?.email}</p>
                  <Badge variant="secondary" className="mb-4">
                    {user?.role === 'admin' ? 'Administrator' : 'Traveler'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Travel Style */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Travel Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Travel Style</Label>
                    <Select 
                      value={preferences?.travel_style} 
                      onValueChange={(value) => handlePreferenceChange('travel_style', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="mid-range">Mid-range</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="backpacker">Backpacker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Group Travel Preference</Label>
                    <Select 
                      value={preferences?.group_travel_preference} 
                      onValueChange={(value) => handlePreferenceChange('group_travel_preference', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo Travel</SelectItem>
                        <SelectItem value="couple">Couple</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friends">Friends Group</SelectItem>
                        <SelectItem value="business">Business Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Themes */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Travel Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TRAVEL_THEMES.map(theme => (
                    <div key={theme.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={theme.id}
                        checked={preferences?.preferred_themes?.includes(theme.id)}
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
                  {preferences?.preferred_themes?.map(themeId => {
                    const theme = TRAVEL_THEMES.find(t => t.id === themeId);
                    return (
                      <Badge key={themeId} variant="secondary" className="bg-slate-900 text-white">
                        {theme?.icon} {theme?.name}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Accommodation Preferences */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Accommodation Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ACCOMMODATION_TYPES.map(accommodation => (
                    <div key={accommodation.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={accommodation.id}
                        checked={preferences?.accommodation_preferences?.includes(accommodation.id)}
                        onCheckedChange={() => handleAccommodationToggle(accommodation.id)}
                      />
                      <Label htmlFor={accommodation.id} className="text-sm font-medium cursor-pointer">
                        {accommodation.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dietary & Accessibility */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Dietary & Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {["vegetarian", "vegan", "jain", "halal", "none"].map(dietary => (
                      <div key={dietary} className="flex items-center space-x-2">
                        <Checkbox 
                          id={dietary}
                          checked={preferences?.dietary_restrictions?.includes(dietary)}
                          onCheckedChange={() => handleDietaryToggle(dietary)}
                        />
                        <Label htmlFor={dietary} className="text-sm font-medium cursor-pointer capitalize">
                          {dietary}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Accessibility className="w-4 h-4" />
                      Mobility Requirements
                    </Label>
                    <Select 
                      value={preferences?.mobility_requirements} 
                      onValueChange={(value) => handlePreferenceChange('mobility_requirements', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No special requirements</SelectItem>
                        <SelectItem value="wheelchair_accessible">Wheelchair accessible</SelectItem>
                        <SelectItem value="limited_walking">Limited walking ability</SelectItem>
                        <SelectItem value="senior_friendly">Senior-friendly options</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language Preference</Label>
                    <Select 
                      value={preferences?.language_preference} 
                      onValueChange={(value) => handlePreferenceChange('language_preference', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                        <SelectItem value="marathi">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              onClick={savePreferences}
              disabled={saving}
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800 py-4 text-lg font-semibold"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}