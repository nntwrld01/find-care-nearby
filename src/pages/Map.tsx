
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Navigation, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const Map = () => {
  const [routeInfo, setRouteInfo] = useState<{
    duration: number;
    distance: string;
    alternatives: { duration: number; distance: string; index: number }[];
    selected: number;
  } | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);
  const [mapStyle, setMapStyle] = useState<'navigation' | 'streets'>('navigation');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  // Fetch Mapbox token from backend
  useEffect(() => {
    fetch("/api/mapbox-token/")
      .then(res => res.json())
      .then(data => setMapboxToken(data.token))
      .catch(() => setMapboxToken(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    import("@/lib/api").then(({ fetchHospitals }) => {
      fetchHospitals()
        .then((data) => {
          setHospitals(data);
          setError(null);
        })
        .catch(() => {
          setError("Failed to load hospitals");
          setHospitals([]);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  useEffect(() => {
    // Get user's current location
    setMapLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
          setMapLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to NYC if location access denied
          setUserLocation([-74.006, 40.7128]);
          setMapLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      // Default to NYC if geolocation not supported
      setUserLocation([-74.006, 40.7128]);
      setMapLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    // Calculate dynamic zoom based on nearest hospital and viewport
    let dynamicZoom = 17.5;
    if (hospitals.length > 0) {
      const distances = hospitals
        .filter(h => h.latitude && h.longitude)
        .map(h => {
          const dx = h.longitude - userLocation[0];
          const dy = h.latitude - userLocation[1];
          return Math.sqrt(dx * dx + dy * dy);
        });
      const minDist = Math.min(...distances);
      // Simple heuristic: closer hospitals = higher zoom
      if (minDist < 0.005) dynamicZoom = 17.5;
      else if (minDist < 0.02) dynamicZoom = 15;
      else dynamicZoom = 12;
    }
    // Adjust for viewport size (mobile = zoom out a bit)
    if (window.innerWidth < 600) dynamicZoom -= 1.5;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'navigation'
        ? 'mapbox://styles/mapbox/navigation-day-v1'
        : 'mapbox://styles/mapbox/streets-v12',
      center: userLocation,
      zoom: dynamicZoom
    });

    map.current.on('load', () => setMapLoading(false));

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Use custom flat beacon SVG for user location
    const userEl = document.createElement('div');
    userEl.style.width = '48px';
    userEl.style.height = '48px';
    userEl.innerHTML = `<img src='/src/assets/user-beacon.svg' alt='User Location' style='width:100%;height:100%'/>`;
    new mapboxgl.Marker({ element: userEl })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
      .addTo(map.current);

    hospitals.forEach((hospital) => {
      if (!hospital.latitude || !hospital.longitude) return;
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div>
          <h3 class="font-semibold">${hospital.name}</h3>
          <p class="text-sm text-gray-600">${hospital.address}</p>
          <p class="text-sm text-blue-600">${hospital.phone || ""}</p>
        </div>`
      );

      // Use custom doctor SVG marker
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.background = 'none';
      el.innerHTML = `<img src='/src/assets/doctor-marker.svg' alt='Doctor Marker' style='width:100%;height:100%'/>`;
      new mapboxgl.Marker({ element: el })
        .setLngLat([hospital.longitude, hospital.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [userLocation, mapboxToken, hospitals]);

  // Store route layer id for cleanup
  const routeLayerId = 'route';

  const handleGetDirections = async (hospital: typeof hospitals[0]) => {
    if (!userLocation || !hospital.latitude || !hospital.longitude) return;
    const [userLng, userLat] = userLocation;
    // Remove existing route if present
    if (map.current && map.current.getLayer(routeLayerId)) {
      map.current.removeLayer(routeLayerId);
      map.current.removeSource(routeLayerId);
    }
    // Fetch route from Mapbox Directions API
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${hospital.longitude},${hospital.latitude}?geometries=geojson&alternatives=true&overview=full&access_token=${mapboxgl.accessToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.routes || !data.routes.length) return;
    // Remove any previous routes
    [routeLayerId, ...data.routes.map((_: any, i: number) => `${routeLayerId}-${i}`)].forEach(id => {
      if (map.current && map.current.getLayer(id)) {
        map.current.removeLayer(id);
        map.current.removeSource(id);
      }
    });
    // Plot all routes: primary in blue, alternates in gray
    data.routes.forEach((route: any, i: number) => {
      const color = i === selectedRoute ? '#3B82F6' : '#A0AEC0';
      const id = `${routeLayerId}-${i}`;
      if (map.current) {
        map.current.addSource(id, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });
        map.current.addLayer({
          id,
          type: 'line',
          source: id,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': color, 'line-width': i === selectedRoute ? 6 : 4, 'line-opacity': i === selectedRoute ? 0.9 : 0.5 }
        });
      }
    });
    // Fit map to selected route
    const coords = data.routes[selectedRoute].geometry.coordinates;
    const bounds = coords.reduce((b: any, coord: [number, number]) => b.extend(coord), new mapboxgl.LngLatBounds(coords[0], coords[0]));
    map.current!.fitBounds(bounds, { padding: 60 });
    // Show ETA and distance in overlay
    setRouteInfo({
      duration: Math.round(data.routes[selectedRoute].duration / 60),
      distance: (data.routes[selectedRoute].distance / 1000).toFixed(1),
      alternatives: data.routes.map((r: any, i: number) => ({
        duration: Math.round(r.duration / 60),
        distance: (r.distance / 1000).toFixed(1),
        index: i
      })),
      selected: selectedRoute
    });
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
        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-blue-600 font-semibold">Loading map...</div>
          </div>
        )}
        {/* Hospital List Overlay */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Nearby Hospitals</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMapStyle(mapStyle === 'navigation' ? 'streets' : 'navigation')}
              className="ml-2"
            >
              {mapStyle === 'navigation' ? 'Detailed Map' : 'Navigation Map'}
            </Button>
          </div>
          {/* Route info overlay */}
          {routeInfo && (
            <div className="mb-4 p-2 rounded bg-blue-50 border border-blue-200 text-blue-900">
              <div className="mb-1">
                <span className="font-semibold">ETA:</span> {routeInfo.duration} min
                <span className="mx-2">|</span>
                <span className="font-semibold">Distance:</span> {routeInfo.distance} km
              </div>
              <div className="flex gap-2 flex-wrap">
                {routeInfo.alternatives.map((alt, i) => (
                  <span
                    key={alt.index}
                    onClick={() => setSelectedRoute(alt.index)}
                    className={`px-2 py-1 rounded cursor-pointer border ${routeInfo.selected === alt.index ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                  >
                    {alt.duration} min / {alt.distance} km {routeInfo.selected === alt.index ? '(Fastest)' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            {loading ? (
              <div className="text-center text-gray-500">Loading hospitals...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : hospitals.length === 0 ? (
              <div className="text-center text-gray-400">No hospitals found.</div>
            ) : (
              hospitals.map((hospital) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
