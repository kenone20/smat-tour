import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingScreen from './components/LoadingScreen';
import SavedTrips from './components/SavedTrips';
import Modal from './components/Modal';
import HowToUseContent from './components/HowToUseContent';
import AboutContent from './components/AboutContent';
import { generateItinerary } from './services/geminiService';
import { getSavedItineraries, saveItinerary, deleteItinerary } from './services/storageService';
import type { GeneratorFormState, Itinerary, GenerationType } from './types';
import { GlobeAltIcon } from './components/IconComponents';
import { useTranslation } from './contexts/LanguageContext';
import { INITIAL_FORM_STATE } from './constants';

type ActiveModal = 'howToUse' | 'about' | null;

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [formData, setFormData] = useState<GeneratorFormState>(INITIAL_FORM_STATE);
  const { t, language } = useTranslation();

  useEffect(() => {
    setSavedTrips(getSavedItineraries());
  }, []);

  const handleGenerateItinerary = useCallback(async (type: GenerationType) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const generatedData = await generateItinerary(formData, type, language);
      const updatedSavedTrips = saveItinerary(generatedData);
      setSavedTrips(updatedSavedTrips);
      // The last item in the updated list is the one we just added, now with an ID
      setItinerary(updatedSavedTrips[updatedSavedTrips.length - 1]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, language]);

  const handleLoadItinerary = useCallback((tripToLoad: Itinerary) => {
    setItinerary(tripToLoad);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteItinerary = useCallback((tripIdToDelete: string) => {
    if (itinerary?.id === tripIdToDelete) {
      setItinerary(null);
    }
    const updatedSavedTrips = deleteItinerary(tripIdToDelete);
    setSavedTrips(updatedSavedTrips);
  }, [itinerary]);

  const handleDestinationChange = useCallback((newDestination: string) => {
    setFormData(prev => ({ ...prev, destination: newDestination }));
  }, []);

  const getModalTitle = () => {
    switch (activeModal) {
      case 'howToUse': return t('howToUse_title');
      case 'about': return t('about_title');
      default: return '';
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header 
        onShowHowToUse={() => setActiveModal('howToUse')}
        onShowAbout={() => setActiveModal('about')}
        destination={formData.destination}
        onDestinationChange={handleDestinationChange}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <GeneratorForm 
              onGenerate={handleGenerateItinerary} 
              isLoading={isLoading} 
              formData={formData}
              setFormData={setFormData}
            />
            <SavedTrips
              trips={savedTrips}
              onLoad={handleLoadItinerary}
              onDelete={handleDeleteItinerary}
            />
          </div>
          <div className="lg:col-span-8">
            {isLoading && <LoadingScreen />}
            {error && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 rounded-2xl shadow-lg mt-12 w-full min-h-[50vh]">
                  <h3 className="text-2xl font-bold text-red-800 dark:text-red-300">{t('error_title')}</h3>
                  <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">{t('error_message')}</p>
              </div>
            )}
            {itinerary && !isLoading && <ItineraryDisplay itinerary={itinerary} />}
            {!itinerary && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg mt-12 w-full min-h-[50vh]">
                  <GlobeAltIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                  <h3 className="text-2xl font-bold text-secondary dark:text-slate-200 mt-6">{t('welcome_title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                      {t('welcome_subtitle')}
                  </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
        <p>{t('footer_copyright', { year: new Date().getFullYear() })}</p>
      </footer>

      <Modal 
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        title={getModalTitle()}
      >
        {activeModal === 'howToUse' && <HowToUseContent />}
        {activeModal === 'about' && <AboutContent />}
      </Modal>
    </div>
  );
};

export default App;