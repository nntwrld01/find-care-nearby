
import { useState } from "react";
import { Search, MapPin, Phone, Clock, Star, Navigation, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HospitalMap from "@/components/HospitalMap";
import HospitalCard from "@/components/HospitalCard";
import SearchFilters from "@/components/SearchFilters";
import HospitalDetails from "@/components/HospitalDetails";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    services: [],
    distance: "10",
    rating: "0"
  });

  // Mock hospital data
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
      coordinates: [-74.006, 40.7128],
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
      coordinates: [-74.008, 40.7158],
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
      coordinates: [-74.010, 40.7180],
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
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Find Hospitals</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find the Right Healthcare, Fast
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Locate nearby hospitals, check services, and get real-time navigation to the care you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by hospital name or medical service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Search Results */}
          <div className="lg:w-1/2">
            {/* Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredHospitals.length} hospitals found
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
              
              {showFilters && (
                <SearchFilters filters={filters} onFiltersChange={setFilters} />
              )}
            </div>

            {/* Hospital List */}
            <div className="space-y-4">
              {filteredHospitals.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onClick={() => setSelectedHospital(hospital)}
                />
              ))}
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:w-1/2">
            <div className="sticky top-8">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    Hospital Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <HospitalMap hospitals={filteredHospitals} selectedHospital={selectedHospital} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Details Modal */}
      {selectedHospital && (
        <HospitalDetails
          hospital={selectedHospital}
          isOpen={!!selectedHospital}
          onClose={() => setSelectedHospital(null)}
        />
      )}

      {/* Quick Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Medical Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">HealthcareBoard</h3>
              </div>
              <p className="text-gray-400">
                Connecting you to quality healthcare when you need it most.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <div>Hospital Finder</div>
                <div>Service Directory</div>
                <div>Emergency Locator</div>
                <div>Navigation</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <div className="space-y-2 text-gray-400">
                <div>Call 911</div>
                <div>Poison Control</div>
                <div>Crisis Hotline</div>
                <div>Mental Health</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthcareBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
