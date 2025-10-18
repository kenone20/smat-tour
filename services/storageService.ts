import type { Itinerary } from '../types';

const STORAGE_KEY = 'smarttour_saved_itineraries';

export const getSavedItineraries = (): Itinerary[] => {
  try {
    const savedTripsJSON = localStorage.getItem(STORAGE_KEY);
    if (savedTripsJSON) {
      return JSON.parse(savedTripsJSON);
    }
  } catch (error) {
    console.error("Failed to parse saved itineraries from localStorage:", error);
  }
  return [];
};

export const saveItinerary = (newItinerary: Itinerary): Itinerary[] => {
  const savedTrips = getSavedItineraries();
  
  if (!newItinerary.id) {
    newItinerary.id = crypto.randomUUID();
  }

  const existingIndex = savedTrips.findIndex(trip => trip.id === newItinerary.id);
  if (existingIndex > -1) {
    savedTrips[existingIndex] = newItinerary;
  } else {
    if(savedTrips.length >= 10) {
        savedTrips.shift(); // Remove the oldest to prevent unbounded storage use
    }
    savedTrips.push(newItinerary);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTrips));
  } catch (error) {
    console.error("Failed to save itinerary to localStorage:", error);
  }
  
  return savedTrips;
};

export const deleteItinerary = (tripIdToDelete: string): Itinerary[] => {
  let savedTrips = getSavedItineraries();
  const updatedTrips = savedTrips.filter(trip => trip.id !== tripIdToDelete);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
  } catch (error) {
    console.error("Failed to update itineraries in localStorage after deletion:", error);
  }

  return updatedTrips;
};
