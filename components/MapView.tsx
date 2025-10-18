import React, { useEffect, useRef } from 'react';
import type { Itinerary } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

// Declare the Leaflet global object to satisfy TypeScript
declare const L: any;

interface MapViewProps {
  itinerary: Itinerary;
}

const MapView: React.FC<MapViewProps> = ({ itinerary }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // To hold the map instance
  const markersRef = useRef<any[]>([]); // To hold marker instances
  const { t } = useTranslation();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [itinerary.latitude, itinerary.longitude],
        12
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else {
        // If map already exists, just update the view
        mapRef.current.setView([itinerary.latitude, itinerary.longitude], 12);
    }
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    itinerary.itinerary.forEach((day) => {
      day.activities.forEach((activity) => {
        if (activity.latitude && activity.longitude) {
          
          const bookingLinkHtml = activity.bookingLink
            ? `<div class="mt-2"><a href="${activity.bookingLink}" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-primary hover:underline">${t('itinerary_activity_booking_label')}</a></div>`
            : '';

          const popupContent = `
            <div class="font-sans" style="min-width: 180px;">
              <div class="font-bold text-base mb-1 text-secondary">${t('itinerary_day')} ${day.day} &bull; ${activity.time}</div>
              <p class="text-sm text-slate-700">${activity.description}</p>
              <div class="text-xs text-slate-500 mt-2">${t('itinerary_activity_cost_label')} <span class="font-medium text-slate-700">${activity.estimatedCost}</span></div>
              ${bookingLinkHtml}
            </div>
          `;

          const marker = L.marker([activity.latitude, activity.longitude])
            .addTo(mapRef.current)
            .bindPopup(popupContent);
          
          markersRef.current.push(marker);
        }
      });
    });

    // Invalidate size to ensure map renders correctly if container size changed
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 100);

    return () => {
        clearTimeout(timer);
    }

  }, [itinerary, t]);

  return (
    <div 
        ref={mapContainerRef} 
        className="w-full h-[60vh] md:h-[70vh] rounded-lg border border-slate-200"
        aria-label={`Map of ${itinerary.destination}`}
    />
  );
};

export default MapView;
