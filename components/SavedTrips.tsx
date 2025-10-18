import React from 'react';
import type { Itinerary } from '../types';
import { TrashIcon, FolderArrowDownIcon, MapPinIcon } from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';

interface SavedTripsProps {
    trips: Itinerary[];
    onLoad: (trip: Itinerary) => void;
    onDelete: (tripId: string) => void;
}

const SavedTrips: React.FC<SavedTripsProps> = ({ trips, onLoad, onDelete }) => {
    const { t } = useTranslation();

    return (
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-secondary mb-4">{t('savedTrips_title')}</h3>
            {trips.length === 0 ? (
                <p className="text-slate-500 text-sm">{t('savedTrips_empty')}</p>
            ) : (
                <ul className="space-y-3">
                    {trips.map((trip) => (
                        <li key={trip.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-secondary truncate">{trip.tripName}</p>
                                <div className="flex items-center mt-1">
                                    <MapPinIcon className="w-4 h-4 text-slate-400 ltr:mr-1.5 rtl:ml-1.5 flex-shrink-0" />
                                    <p className="text-xs text-slate-500 truncate">{trip.destination}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse ltr:ml-2 rtl:mr-2">
                                <button
                                    onClick={() => onLoad(trip)}
                                    title="Load Itinerary"
                                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                    aria-label={t('savedTrips_load_aria', { destination: trip.destination })}
                                >
                                    <FolderArrowDownIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => trip.id && onDelete(trip.id)}
                                    title="Delete Itinerary"
                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-500/10 rounded-full transition-colors"
                                    aria-label={t('savedTrips_delete_aria', { destination: trip.destination })}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SavedTrips;