
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssetStore } from '@/store/assetStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for marker icons not displaying correctly
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Set the default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

const AssetMap = () => {
  const { assetDetail } = useAssetStore();
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  // Helper function to create custom icons based on seeder status
  const createCustomIcon = (isSeeder) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${isSeeder ? '#22c55e' : '#f97316'}; width: 10px; height: 10px; border-radius: 50%; border: 1px solid white;"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
  };

  useEffect(() => {
    // Set loading to false after a short delay to ensure the map has time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!assetDetail?.torrent?.latest_peers || assetDetail?.torrent?.latest_peers.length === 0) {
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

  // Filter out peers without valid coordinates
  const validPeers = assetDetail.torrent.latest_peers
    .filter(peer => peer.geo?.latitude && peer.geo?.longitude);

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
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Skeleton className="w-[300px] h-[300px] rounded-full opacity-20" />
            </div>
          ) : null}
          
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            style={{ height: '100%', width: '100%', background: '#242731' }}
            zoomControl={false}
            attributionControl={false}
            ref={mapRef}
            whenReady={() => {
              if (mapRef.current) {
                setIsLoading(false);
              }
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles-dark"
            />
            {validPeers.map((peer, index) => (
              <Marker 
                key={`${peer.ip}-${index}`}
                position={[peer.geo.latitude, peer.geo.longitude]}
                icon={createCustomIcon(peer.seeder)}
              >
                <Popup>
                  <div className="p-1">
                    <div className="font-semibold">{peer.city || 'Unknown City'}, {peer.country || 'Unknown Country'}</div>
                    <div className="text-xs text-gray-400">{peer.isp || 'Unknown ISP'}</div>
                    <div className="text-xs mt-1" style={{ color: peer.seeder ? '#22c55e' : '#f97316' }}>
                      {peer.seeder ? 'Seeder' : 'Leecher'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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
