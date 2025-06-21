
import { Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Filters {
  services: string[];
  distance: string;
  rating: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const medicalServices = [
    "Emergency Care",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Internal Medicine",
    "Surgery",
    "Radiology",
    "Laboratory Services",
    "Mental Health",
    "Women's Health",
    "Cancer Care",
    "Urgent Care"
  ];

  const handleServiceToggle = (service: string) => {
    const updatedServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    
    onFiltersChange({
      ...filters,
      services: updatedServices
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      services: [],
      distance: "10",
      rating: "0"
    });
  };

  const hasActiveFilters = filters.services.length > 0 || filters.distance !== "10" || filters.rating !== "0";

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Distance Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Distance</Label>
          <Select value={filters.distance} onValueChange={(value) => onFiltersChange({...filters, distance: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Within 5 miles</SelectItem>
              <SelectItem value="10">Within 10 miles</SelectItem>
              <SelectItem value="25">Within 25 miles</SelectItem>
              <SelectItem value="50">Within 50 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Minimum Rating</Label>
          <Select value={filters.rating} onValueChange={(value) => onFiltersChange({...filters, rating: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Services Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Medical Services
            {filters.services.length > 0 && (
              <span className="ml-2 text-xs text-blue-600">
                ({filters.services.length} selected)
              </span>
            )}
          </Label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {medicalServices.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={filters.services.includes(service)}
                  onCheckedChange={() => handleServiceToggle(service)}
                />
                <Label 
                  htmlFor={service} 
                  className="text-xs cursor-pointer hover:text-blue-600"
                >
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
