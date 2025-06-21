
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// You'll need to set your Mapbox token in environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "your-mapbox-token-here";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const navigate = useNavigate();

  // Mock hospital data with coordinates
  const hospitals = [
    {
      id: 1,
      name: "City General Hospital",
      coordinates: [-74.006, 40.7128] as [number, number],
      address: "123 Healthcare Ave, Medical District",
      phone: "(555) 123-4567",
    },
    {
      id: 2,
      name: "St. Mary's Medical Center",
      coordinates: [-74.008, 40.7158] as [number, number],
      address: "456 Wellness Blvd, Downtown",
      phone: "(555) 987-6543",
    },
    {
      id: 3,
      name: "Regional Emergency Hospital",
      coordinates: [-74.010, 40.7180] as [number, number],
      address: "789 Quick Care St, Uptown",
      phone: "(555) 456-7890",
    }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to NYC if location access denied
          setUserLocation([-74.006, 40.7128]);
        }
      );
    } else {
      // Default to NYC if geolocation not supported
      setUserLocation([-74.006, 40.7128]);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation,
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    new mapboxgl.Marker({ color: '#3B82F6' })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
      .addTo(map.current);

    // Add hospital markers
    hospitals.forEach((hospital) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div>
          <h3 class="font-semibold">${hospital.name}</h3>
          <p class="text-sm text-gray-600">${hospital.address}</p>
          <p class="text-sm text-blue-600">${hospital.phone}</p>
        </div>`
      );

      new mapboxgl.Marker({ color: '#EF4444' })
        .setLngLat(hospital.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [userLocation]);

  const handleGetDirections = (hospital: typeof hospitals[0]) => {
    if (!userLocation) return;
    
    const [userLng, userLat] = userLocation;
    const [hospitalLng, hospitalLat] = hospital.coordinates;
    
    const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${hospitalLat},${hospitalLng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Hospital Map</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-4rem)]">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Hospital List Overlay */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h2 className="font-semibold mb-3">Nearby Hospitals</h2>
          <div className="space-y-2">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="p-2 border rounded-lg">
                <h3 className="font-medium text-sm">{hospital.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{hospital.address}</p>
                <Button
                  size="sm"
                  onClick={() => handleGetDirections(hospital)}
                  className="w-full text-xs"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Get Directions
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
