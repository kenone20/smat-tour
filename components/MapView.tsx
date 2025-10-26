import React, { useEffect, useRef } from 'react';
import type { Itinerary, ActivityType } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { ArrowsPointingOutIcon, BuildingLibraryIcon, ChatBubbleLeftRightIcon, ClockIcon, CurrencyDollarIcon, HomeModernIcon, SparklesIcon, TruckIcon } from './IconComponents';

// Declare the Leaflet global object to satisfy TypeScript
declare const L: any;

interface MapViewProps {
  itinerary: Itinerary;
}

const ICON_SVG_STRINGS = {
    sightseeing: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>`,
    accommodation: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3-1m3 1v5.5m-3-5.5l-3 1m0 0l-3-1m3 1v5.5m0 0l3 1" /></svg>`,
    dining: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72A2.123 2.123 0 013 15.118V12.75a2.25 2.25 0 012.25-2.25h3.81a6.32 6.32 0 004.28-1.586 1.125 1.125 0 00.329-1.603Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 3.75A2.25 2.25 0 015.25 1.5h6.366a2.25 2.25 0 011.591.659l2.121 2.121c.43.43.659.998.659 1.591v6.366a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15.75V3.75Z" /></svg>`,
    transport: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875m-17.25 4.5h15M6.375 9h11.25L21 12.75v-1.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9v1.5L6.375 9z" /></svg>`,
    activity: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" /></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    currency: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.157 0-2.983L12 6" /></svg>`,
};

const ICON_CONFIG: Record<ActivityType, { color: string, svg: string }> = {
    sightseeing: { color: 'bg-sky-500', svg: ICON_SVG_STRINGS.sightseeing },
    accommodation: { color: 'bg-purple-500', svg: ICON_SVG_STRINGS.accommodation },
    dining: { color: 'bg-amber-500', svg: ICON_SVG_STRINGS.dining },
    transport: { color: 'bg-slate-500', svg: ICON_SVG_STRINGS.transport },
    activity: { color: 'bg-emerald-500', svg: ICON_SVG_STRINGS.activity },
};

const MapView: React.FC<MapViewProps> = ({ itinerary }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // To hold the map instance
  const markersRef = useRef<any[]>([]); // To hold marker instances
  const { t } = useTranslation();

  const handleFitBounds = () => {
    if (!mapRef.current) return;
    
    const points: [number, number][] = [];
    itinerary.itinerary.forEach(day => {
        day.activities.forEach(activity => {
            if (activity.latitude && activity.longitude) {
                points.push([activity.latitude, activity.longitude]);
            }
        });
    });

    if (points.length > 1) {
        const bounds = L.latLngBounds(points);
        mapRef.current.fitBounds(bounds.pad(0.1));
    } else if (points.length === 1) {
        mapRef.current.setView(points[0], 15);
    }
  };


  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
      const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
      });
      
      mapRef.current = L.map(mapContainerRef.current, {
        center: [itinerary.latitude, itinerary.longitude],
        zoom: 12,
        layers: [streetMap]
      });

      const baseMaps = { "Street": streetMap, "Satellite": satelliteMap, "Terrain": terrainMap };
      L.control.layers(baseMaps).addTo(mapRef.current);
    }

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    const points: [number, number][] = [];

    itinerary.itinerary.forEach((day) => {
      day.activities.forEach((activity) => {
        if (activity.latitude && activity.longitude) {
          points.push([activity.latitude, activity.longitude]);
          
          const activityType = activity.type && ICON_CONFIG[activity.type] ? activity.type : 'activity';
          const iconConfig = ICON_CONFIG[activityType];
          
          const iconHtml = `
            <div class="relative flex items-center justify-center w-8 h-8 ${iconConfig.color} rounded-full text-white shadow-lg border-2 border-white">
              ${iconConfig.svg}
              <div class="absolute -bottom-1 w-2 h-2 ${iconConfig.color} transform rotate-45"></div>
            </div>
          `;
          
          const customIcon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });

          const bookingLinkHtml = activity.bookingLink
            ? `<div class="mt-3"><a href="${activity.bookingLink}" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-primary hover:underline">${t('itinerary_activity_booking_label')}</a></div>`
            : '';
            
          const popupContent = `
            <div class="font-sans" style="min-width: 220px;">
              <div class="flex items-center mb-2 pb-2 border-b">
                  <div class="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 shrink-0 ${iconConfig.color.replace('bg-', 'text-')}">${iconConfig.svg}</div>
                  <h3 class="font-bold text-lg text-secondary capitalize">${activityType}</h3>
              </div>
              <p class="font-semibold text-slate-800 leading-tight">${activity.description}</p>
              <div class="text-sm text-slate-600 space-y-1 mt-3">
                  <div class="flex items-center"><div class="w-5 h-5 mr-1 text-slate-400">${ICON_SVG_STRINGS.clock}</div><strong class="w-12">${t('popup_time')}:</strong> ${activity.time}</div>
                  <div class="flex items-center"><div class="w-5 h-5 mr-1 text-slate-400">${ICON_SVG_STRINGS.currency}</div><strong class="w-12">${t('popup_cost')}:</strong> ${activity.estimatedCost}</div>
              </div>
              ${bookingLinkHtml}
            </div>
          `;

          const marker = L.marker([activity.latitude, activity.longitude], { icon: customIcon })
            .addTo(mapRef.current)
            .bindPopup(popupContent);
          
          markersRef.current.push(marker);
        }
      });
    });

    if (points.length > 0) {
        const bounds = L.latLngBounds(points);
        mapRef.current.fitBounds(bounds.pad(0.1));
    } else {
        mapRef.current.setView([itinerary.latitude, itinerary.longitude], 12);
    }

    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 100);
    return () => clearTimeout(timer);

  }, [itinerary, t]);

  return (
    <div className="relative">
      <div 
          ref={mapContainerRef} 
          className="w-full h-[60vh] md:h-[70vh] rounded-lg border border-slate-200 dark:border-slate-700 z-0"
          aria-label={`Map of ${itinerary.destination}`}
      />
      <button
          onClick={handleFitBounds}
          title={t('map_fit_bounds_title')}
          className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-slate-700 rounded-md shadow-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          aria-label={t('map_fit_bounds_title')}
      >
          <ArrowsPointingOutIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      </button>
    </div>
  );
};

export default MapView;