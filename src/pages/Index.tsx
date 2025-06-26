import { useState, useEffect } from "react";
import { Search, MapPin, Navigation, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import HospitalCard from "@/components/HospitalCard";
import { fetchHospitals } from "@/lib/api";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchHospitals()
      .then((data) => {
        setHospitals(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load hospitals");
        setHospitals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hospital.services || []).some((service: string) => 
      service.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Find Hospitals</h1>
              </div>
            </div>
            <Button onClick={() => navigate('/map')} className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              View Map
            </Button>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search hospitals or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-gray-300 rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hospital List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredHospitals.length} hospitals found near you
          </h3>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading hospitals...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center text-gray-400">No hospitals found.</div>
          ) : (
            filteredHospitals.map((hospital) => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onClick={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
