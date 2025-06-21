
import { X, MapPin, Phone, Clock, Star, Navigation, Users, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

interface HospitalDetailsProps {
  hospital: Hospital;
  isOpen: boolean;
  onClose: () => void;
}

const HospitalDetails = ({ hospital, isOpen, onClose }: HospitalDetailsProps) => {
  const handleGetDirections = () => {
    const address = encodeURIComponent(hospital.address);
    window.open(`https://www.google.com/maps/search/${address}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${hospital.phone}`;
  };

  const handleBookAppointment = () => {
    // This would integrate with the hospital's booking system
    alert("Booking system integration would be implemented here");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 pr-8">
            {hospital.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{hospital.rating}</span>
                    <span className="text-gray-500 ml-1">({hospital.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Navigation className="h-4 w-4 mr-1" />
                    <span>{hospital.distance}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="ml-4">
                Wait: {hospital.waitTime}
              </Badge>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>{hospital.hours}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button onClick={handleGetDirections} className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Get Directions
              </Button>
              <Button variant="outline" onClick={handleCall} className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" onClick={handleBookAppointment} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Book Appointment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Medical Services</h3>
            <div className="grid grid-cols-2 gap-2">
              {hospital.services.map((service, index) => (
                <Badge key={index} variant="outline" className="justify-start">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Specialties */}
          {hospital.specialties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Specialties & Centers</h3>
              <div className="grid grid-cols-1 gap-2">
                {hospital.specialties.map((specialty, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 justify-start">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Patient Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average Wait Time:</span>
                  <span className="font-medium">{hospital.waitTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Patient Rating:</span>
                  <span className="font-medium">{hospital.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Reviews:</span>
                  <span className="font-medium">{hospital.reviews}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Main Number:</span>
                  <span className="font-medium">{hospital.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency:</span>
                  <span className="font-medium">Available 24/7</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-medium">{hospital.distance}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Notice */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Emergency Services</h4>
                  <p className="text-sm text-red-700">
                    For life-threatening emergencies, call 911 immediately or go to the nearest emergency room.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HospitalDetails;
