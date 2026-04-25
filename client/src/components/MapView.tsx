import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapViewProps {
  sourceCoords?: { lat: number; lng: number };
  destCoords?: { lat: number; lng: number };
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label?: string; color?: string }>;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const MapView: React.FC<MapViewProps> = ({
  sourceCoords,
  destCoords,
  center = [78.9629, 20.5937],
  zoom = 4,
  markers = [],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_token_here') {
      // Render a beautiful placeholder if no token
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center,
      zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.current?.remove();
    };
  }, []);

  // Update markers whenever coords change
  useEffect(() => {
    if (!map.current || !MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_token_here') return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const allMarkers: Array<{ lat: number; lng: number; color: string; label?: string }> = [
      ...markers.map(m => ({ ...m, color: m.color || '#FBBF24' })),
    ];

    if (sourceCoords) allMarkers.push({ ...sourceCoords, color: '#34D399', label: 'Start' });
    if (destCoords) allMarkers.push({ ...destCoords, color: '#F87171', label: 'End' });

    allMarkers.forEach(({ lat, lng, color, label }) => {
      const el = document.createElement('div');
      el.style.cssText = `
        width: 14px; height: 14px; border-radius: 50%;
        background: ${color}; border: 3px solid white;
        box-shadow: 0 0 0 3px ${color}40, 0 4px 12px rgba(0,0,0,0.4);
        cursor: pointer;
      `;
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      if (label) {
        marker.setPopup(new mapboxgl.Popup({ offset: 12 }).setText(label));
      }
      markersRef.current.push(marker);
    });

    // Draw route line if both source and dest
    if (sourceCoords && destCoords && map.current.isStyleLoaded()) {
      drawRoute(sourceCoords, destCoords);
    } else if (sourceCoords && destCoords) {
      map.current.on('load', () => drawRoute(sourceCoords!, destCoords!));
    }

    // Fit bounds
    if (allMarkers.length >= 2) {
      const bounds = new mapboxgl.LngLatBounds();
      allMarkers.forEach(({ lat, lng }) => bounds.extend([lng, lat]));
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 10 });
    } else if (allMarkers.length === 1) {
      map.current.flyTo({ center: [allMarkers[0].lng, allMarkers[0].lat], zoom: 8 });
    }
  }, [sourceCoords, destCoords, markers]);

  const drawRoute = (src: { lat: number; lng: number }, dst: { lat: number; lng: number }) => {
    if (!map.current) return;

    // Remove existing route layer
    if (map.current.getLayer('route')) map.current.removeLayer('route');
    if (map.current.getSource('route')) map.current.removeSource('route');

    // Simple straight-line route (real Mapbox Directions API needs a separate token plan)
    const midLng = (src.lng + dst.lng) / 2;
    const midLat = (src.lat + dst.lat) / 2 + Math.abs(dst.lng - src.lng) * 0.1;

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [src.lng, src.lat],
            [midLng, midLat],
            [dst.lng, dst.lat],
          ],
        },
      },
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#FBBF24',
        'line-width': 3,
        'line-opacity': 0.8,
        'line-dasharray': [2, 1],
      },
    });
  };

  const hasToken = MAPBOX_TOKEN && MAPBOX_TOKEN !== 'your_mapbox_token_here';

  if (!hasToken) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-ink-800 rounded-2xl border border-ink-700 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#FBBF24 1px, transparent 1px), linear-gradient(90deg, #FBBF24 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 text-center px-6">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-ink-200 font-display text-lg mb-2">Map Preview</h3>
          <p className="text-ink-400 text-sm mb-4">
            Add your Mapbox token to <code className="text-amber-400 bg-ink-700 px-1 rounded">client/.env</code>
          </p>
          {sourceCoords && destCoords && (
            <div className="glass rounded-xl p-4 text-left mt-4 space-y-2">
              <div className="flex gap-2 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-jade-400 flex-shrink-0" />
                <span className="text-ink-300 text-sm">
                  {sourceCoords.lat.toFixed(4)}, {sourceCoords.lng.toFixed(4)}
                </span>
              </div>
              <div className="w-px h-4 bg-ink-600 ml-1" />
              <div className="flex gap-2 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-coral-400 flex-shrink-0" />
                <span className="text-ink-300 text-sm">
                  {destCoords.lat.toFixed(4)}, {destCoords.lng.toFixed(4)}
                </span>
              </div>
            </div>
          )}
          {markers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {markers.map((m, i) => (
                <span key={i} className="glass-light rounded-lg px-3 py-1 text-xs text-ink-300">
                  📍 {m.label || `Point ${i + 1}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-2xl" />;
};

export default MapView;
