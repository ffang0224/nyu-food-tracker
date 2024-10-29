"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const MapComponent = () => {
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Initialize the map
    const initMap = () => {
      const NYU = { lat: 40.7295, lng: -73.9965 }; // NYU coordinates
      
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: NYU,
        zoom: 15,
      });

      // Create Places service
      const service = new window.google.maps.places.PlacesService(mapInstance);

      // Search for restaurants
      const request = {
        location: NYU,
        radius: 200,
        type: ['restaurant']
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
          
          // Create markers for each place
          results.forEach(place => {
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: mapInstance,
              title: place.name
            });

            // Add info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-bold">${place.name}</h3>
                  <p>${place.vicinity}</p>
                  <p>Rating: ${place.rating} ⭐</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker);
            });

            setMarkers(prev => [...prev, marker]);
          });
        }
      });

      setMap(mapInstance);
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=[apikey]&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    // Cleanup
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Restaurants Near NYU</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="map" className="w-full h-96 rounded-lg" />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Found Restaurants:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((place, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-bold">{place.name}</h4>
                <p className="text-sm text-gray-600">{place.vicinity}</p>
                <p className="text-sm">Rating: {place.rating} ⭐</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapComponent;