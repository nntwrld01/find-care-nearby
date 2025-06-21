
import { useState } from "react";
import { Search, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import HospitalCard from "@/components/HospitalCard";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Simplified hospital data
  const hospitals = [
    {
      id: 1,
      name: "City General Hospital",
      address: "123 Healthcare Ave, Medical District",
      distance: "0.8 miles",
      rating: 4.7,
      reviews: 342,
      phone: "(555) 123-4567",
      services: ["Emergency Care", "Cardiology", "Orthopedics", "Pediatrics"],
      hours: "24/7 Emergency",
      coordinates: [-74.006, 40.7128] as [number, number],
      waitTime: "15 mins",
      specialties: ["Trauma Center", "Stroke Center"]
    },
    {
      id: 2,
      name: "St. Mary's Medical Center",
      address: "456 Wellness Blvd, Downtown",
      distance: "1.2 miles",
      rating: 4.5,
      reviews: 198,
      phone: "(555) 987-6543",
      services: ["Internal Medicine", "Surgery", "Radiology", "Lab Services"],
      hours: "6 AM - 10 PM",
      coordinates: [-74.008, 40.7158] as [number, number],
      waitTime: "25 mins",
      specialties: ["Cancer Care", "Women's Health"]
    },
    {
      id: 3,
      name: "Regional Emergency Hospital",
      address: "789 Quick Care St, Uptown",
      distance: "2.1 miles",
      rating: 4.3,
      reviews: 89,
      phone: "(555) 456-7890",
      services: ["Emergency Care", "Urgent Care", "X-Ray", "Minor Surgery"],
      hours: "24/7 Emergency",
      coordinates: [-74.010, 40.7180] as [number, number],
      waitTime: "8 mins",
      specialties: ["Fast Track Emergency", "Pediatric Emergency"]
    }
  ];

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.services.some(service => 
      service.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">HealthcareBoard</h1>
            </div>
            <Button onClick={() => navigate('/map')} className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              View Map
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find Healthcare Near You
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Locate nearby hospitals and get directions instantly.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search hospitals or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hospital List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredHospitals.length} hospitals found
          </h3>
        </div>

        <div className="space-y-4">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
