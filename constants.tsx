

import React from 'react';
import { GeneratorFormState, FormOption } from './types';
import { GlobeAltIcon, CalendarIcon, CurrencyDollarIcon, SparklesIcon, ClockIcon, PencilIcon, ChatBubbleLeftRightIcon, BuildingLibraryIcon, UserGroupIcon, HeartIcon, SunIcon, BeakerIcon, ShoppingBagIcon } from './components/IconComponents';

export const INTEREST_OPTIONS: FormOption[] = [
  { id: 'culture', label: 'interest_culture', icon: <GlobeAltIcon className="w-5 h-5" /> },
  { id: 'art', label: 'interest_art', icon: <PencilIcon className="w-5 h-5" /> },
  { id: 'history', label: 'interest_history', icon: <BuildingLibraryIcon className="w-5 h-5" /> },
  { id: 'food', label: 'interest_food', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
  { id: 'shopping', label: 'interest_shopping', icon: <ShoppingBagIcon className="w-5 h-5" /> },
  { id: 'nightlife', label: 'interest_nightlife', icon: <ClockIcon className="w-5 h-5" /> },
  { id: 'adventure', label: 'interest_adventure', icon: <SparklesIcon className="w-5 h-5" /> },
  { id: 'nature', label: 'interest_nature', icon: <BeakerIcon className="w-5 h-5" /> },
  { id: 'beaches', label: 'interest_beaches', icon: <SunIcon className="w-5 h-5" /> },
  { id: 'wellness', label: 'interest_wellness', icon: <HeartIcon className="w-5 h-5" /> },
  { id: 'family-friendly', label: 'interest_family_friendly', icon: <UserGroupIcon className="w-5 h-5" /> },
];

export const INITIAL_FORM_STATE: GeneratorFormState = {
  tripName: 'Trip to Paris',
  destination: 'Paris, France',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
  budget: 'mid',
  interests: ['culture', 'food', 'history'],
  pace: 'moderate',
};