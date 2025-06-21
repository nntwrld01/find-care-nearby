
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  coordinates: [number, number];
}

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
}

const HospitalMap = ({ hospitals, selectedHospital }: HospitalMapProps) => {
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      toast({
        title: "Mapbox Token Set",
        description: "Map functionality is now enabled with your token.",
      });
    } else {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid Mapbox token.",
        variant: "destructive",
      });
    }
  };

  if (showTokenInput) {
    return (
      <div className="h-96 bg-gray-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-2">Enable Map View</h3>
              <p className="text-sm text-gray-600 mb-4">
                To use the interactive map with real-time navigation, please enter your Mapbox public token.
              </p>
              <p className="text-xs text-blue-600 mb-4">
                Get your token at{" "}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Enter your Mapbox public token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={handleTokenSubmit} className="w-full">
                Enable Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 relative rounded-lg overflow-hidden">
      {/* Map Placeholder with Hospital Markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Simulated Map Background */}
          <div 
            className="w-full h-full bg-cover bg-center opacity-80"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Hospital Markers */}
          {hospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                selectedHospital?.id === hospital.id ? 'scale-125 z-10' : 'hover:scale-110'
              }`}
              style={{
                left: `${30 + (index * 15) + (index % 2 === 0 ? 10 : -10)}%`,
                top: `${30 + (index * 10) + (index % 3 === 0 ? 15 : -5)}%`,
              }}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg ${
                  selectedHospital?.id === hospital.id 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                <MapPin className="h-5 w-5" />
              </div>
              
              {/* Hospital Info Popup */}
              {selectedHospital?.id === hospital.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-20">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {hospital.name}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {hospital.distance} away
                  </div>
                  <Button size="sm" className="w-full text-xs">
                    <Navigation className="h-3 w-3 mr-1" />
                    Get Directions
                  </Button>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45 -mt-1"></div>
                </div>
              )}
            </div>
          ))}
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              +
            </Button>
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              −
            </Button>
          </div>
          
          {/* Current Location Indicator */}
          <div className="absolute bottom-4 left-4">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1">
          <MapPin className="h-3 w-3 text-red-500" />
          <span>Hospitals</span>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;
