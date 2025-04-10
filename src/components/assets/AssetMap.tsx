
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssetStore } from '@/store/assetStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

// Use a public token for demo purposes - in production this should be in an env variable
const MAPBOX_TOKEN = "pk.eyJ1Ijoid2h5eHBvc2UiLCJhIjoiY2xnZXpjdzIwMDVxODNoczdkbGc0bWJhaCJ9.NLaaYdO52UHVEsgJ0lnUZw";

const AssetMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { assetDetail } = useAssetStore();
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !assetDetail?.torrent?.latest_peers) return;

    try {
      // Initialize mapbox
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          zoom: 1.5,
          center: [0, 20],
          projection: 'globe'
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          if (map.current) {
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            
            // Add atmosphere and fog for better globe visualization
            map.current.setFog({
              color: 'rgb(20, 20, 30)',
              'high-color': 'rgb(40, 40, 80)',
              'horizon-blend': 0.4,
            });
          }
        });
      }

      // Once map is loaded, add the data points
      if (mapLoaded && map.current && assetDetail?.torrent?.latest_peers) {
        // Remove existing data if any
        if (map.current.getSource('peers')) {
          map.current.removeLayer('peer-points');
          map.current.removeSource('peers');
        }

        // Prepare GeoJSON data from peers
        const geojsonData = {
          type: 'FeatureCollection',
          features: assetDetail.torrent.latest_peers
            .filter(peer => peer.geo?.latitude && peer.geo?.longitude)
            .map(peer => ({
              type: 'Feature',
              properties: {
                city: peer.city,
                country: peer.country,
                isp: peer.isp,
                isSeeder: peer.seeder
              },
              geometry: {
                type: 'Point',
                coordinates: [peer.geo.longitude, peer.geo.latitude]
              }
            }))
        };

        // Add the source and layer
        map.current.addSource('peers', {
          type: 'geojson',
          data: geojsonData as any
        });

        map.current.addLayer({
          id: 'peer-points',
          type: 'circle',
          source: 'peers',
          paint: {
            'circle-radius': 5,
            'circle-color': [
              'case',
              ['==', ['get', 'isSeeder'], true],
              '#22c55e', // Green for seeders
              '#f97316'  // Orange for leechers
            ],
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Add popup on hover
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.current.on('mouseenter', 'peer-points', (e) => {
          if (e.features && e.features.length > 0) {
            map.current!.getCanvas().style.cursor = 'pointer';
            
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice();
            const city = feature.properties.city || 'Unknown City';
            const country = feature.properties.country || 'Unknown Country';
            const isp = feature.properties.isp || 'Unknown ISP';
            const type = feature.properties.isSeeder ? 'Seeder' : 'Leecher';
            
            const html = `
              <div class="px-2 py-1">
                <div class="font-semibold">${city}, ${country}</div>
                <div class="text-xs text-gray-400">${isp}</div>
                <div class="text-xs mt-1 ${feature.properties.isSeeder ? 'text-green-500' : 'text-orange-500'}">${type}</div>
              </div>
            `;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup
              .setLngLat(coordinates as [number, number])
              .setHTML(html)
              .addTo(map.current!);
          }
        });

        map.current.on('mouseleave', 'peer-points', () => {
          map.current!.getCanvas().style.cursor = '';
          popup.remove();
        });

        // Auto-rotate the globe
        const secondsPerRevolution = 120;
        function rotateGlobe() {
          if (!map.current) return;
          const center = map.current.getCenter();
          center.lng -= 0.1;
          map.current.easeTo({ center, duration: 100, easing: (n) => n });
          requestAnimationFrame(rotateGlobe);
        }
        
        if (!map.current.isMoving() && !map.current.isZooming()) {
          rotateGlobe();
        }
      }
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to load map visualization");
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [assetDetail?.torrent?.latest_peers, mapLoaded]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Map Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 flex justify-center items-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assetDetail?.torrent?.latest_peers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Map Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 flex justify-center items-center">
            <p className="text-muted-foreground">No peer data available for map visualization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Peer Distribution Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] relative rounded-md overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Skeleton className="w-[300px] h-[300px] rounded-full opacity-20" />
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span>Seeders</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-1"></span>
            <span>Leechers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetMap;
