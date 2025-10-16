'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TreeCapture } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on status
const createCustomIcon = (status: string, isFollowUp: boolean) => {
  let color = '#22c55e'; // green for verified
  
  if (isFollowUp) {
    color = '#3b82f6'; // blue for follow-up
  } else if (status === 'pending') {
    color = '#eab308'; // yellow
  } else if (status === 'rejected') {
    color = '#ef4444'; // red
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to fit bounds to markers
function FitBounds({ captures }: { captures: TreeCapture[] }) {
  const map = useMap();

  useEffect(() => {
    if (captures.length > 0) {
      const bounds = L.latLngBounds(
        captures.map((c) => [c.gpsCoordinates.latitude, c.gpsCoordinates.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [captures, map]);

  return null;
}

interface MapViewProps {
  captures: TreeCapture[];
}

export default function MapView({ captures }: MapViewProps) {
  // Default center (Kenya)
  const defaultCenter: [number, number] = [-1.2921, 36.8219];
  const defaultZoom = 10;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {captures.map((capture) => (
        <Marker
          key={capture.id}
          position={[capture.gpsCoordinates.latitude, capture.gpsCoordinates.longitude]}
          icon={createCustomIcon(capture.status, capture.isFollowUp)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-2">
                {capture.species || 'Unknown Species'}
              </h3>
              
              {capture.isFollowUp && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">
                  Follow-up
                </span>
              )}
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`font-semibold ${
                    capture.status === 'verified' ? 'text-green-600' :
                    capture.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {capture.status.charAt(0).toUpperCase() + capture.status.slice(1)}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong> {formatDateTime(capture.timestamp)}
                </p>
                <p>
                  <strong>Location:</strong> {capture.gpsCoordinates.latitude.toFixed(6)}, {capture.gpsCoordinates.longitude.toFixed(6)}
                </p>
                {capture.notes && (
                  <p>
                    <strong>Notes:</strong> {capture.notes}
                  </p>
                )}
              </div>
              
              <Link
                href={`/captures/${capture.id}`}
                className="block w-full text-center bg-primary-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-primary-700 transition"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <FitBounds captures={captures} />
    </MapContainer>
  );
}