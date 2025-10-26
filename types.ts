import type { ReactElement } from 'react';

export type GenerationType = 'full' | 'quick';

export interface GeneratorFormState {
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'mid' | 'luxury';
  interests: string[];
  pace: 'relaxed' | 'moderate' | 'busy';
  tripName: string;
}

export type ActivityType = 'dining' | 'sightseeing' | 'accommodation' | 'transport' | 'activity';

export interface Activity {
  time: string;
  description: string;
  estimatedCost: string;
  bookingLink?: string;
  transport?: string;
  alternatives?: string[];
  latitude?: number;
  longitude?: number;
  type?: ActivityType;
}

export interface DayPlan {
  day: number;
  date: string;
  title: string;
  dailyCost: number;
  activities: Activity[];
}

export interface TravelAdvisories {
  visaRequirements: string;
  localCustoms: string;
  safetyTips: string;
  healthAndVaccinations: string;
}

export interface Itinerary {
  id?: string;
  tripName: string;
  destination: string;
  latitude: number;
  longitude: number;
  totalDays: number;
  totalCost: number;
  itinerary: DayPlan[];
  travelAdvisories?: TravelAdvisories;
}

export interface FormOption {
  id: string;
  label: string;
  // Fix: Use `ReactElement` instead of `JSX.Element` to resolve "Cannot find namespace 'JSX'" error in a .ts file.
  icon: ReactElement;
}
