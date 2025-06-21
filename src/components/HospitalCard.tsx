
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  phone: string;
  services: string[];
  hours: string;
  waitTime: string;
  specialties: string[];
}

interface HospitalCardProps {
  hospital: Hospital;
  onClick: () => void;
}

const HospitalCard = ({ hospital, onClick }: HospitalCardProps) => {
  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This would integrate with Mapbox for real navigation
    const address = encodeURIComponent(hospital.address);
    window.open(`https://www.google.com/maps/search/${address}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${hospital.phone}`;
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {hospital.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{hospital.address}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{hospital.rating}</span>
                <span className="text-gray-500 ml-1">({hospital.reviews})</span>
              </div>
              <div className="flex items-center text-blue-600">
                <Navigation className="h-4 w-4 mr-1" />
                <span>{hospital.distance}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">
              Wait: {hospital.waitTime}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{hospital.hours}</span>
        </div>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {hospital.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
            {hospital.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hospital.services.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {hospital.specialties.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Specialties:</div>
            <div className="flex flex-wrap gap-1">
              {hospital.specialties.map((specialty, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            onClick={handleGetDirections}
            className="flex items-center gap-1 flex-1"
          >
            <Navigation className="h-4 w-4" />
            Directions
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCall}
            className="flex items-center gap-1"
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;
