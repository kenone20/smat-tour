import React, { useCallback } from 'react';
import type { GeneratorFormState, FormOption, GenerationType } from '../types';
import { INTEREST_OPTIONS } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';


interface GeneratorFormProps {
  onGenerate: (type: GenerationType) => void;
  isLoading: boolean;
  formData: GeneratorFormState;
  setFormData: React.Dispatch<React.SetStateAction<GeneratorFormState>>;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading, formData, setFormData }) => {
  const { t } = useTranslation();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const handleInterestChange = useCallback((interestId: string) => {
    setFormData(prev => {
      const newInterests = prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests: newInterests };
    });
  }, [setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate('full');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary dark:text-slate-200">{t('form_title')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('form_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label={t('form_tripName')} name="tripName" value={formData.tripName} onChange={handleInputChange} placeholder={t('form_tripName_placeholder')} />
        <InputField label={t('form_destination')} name="destination" value={formData.destination} onChange={handleInputChange} placeholder={t('form_destination_placeholder')} />
        <InputField label={t('form_startDate')} name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
        <InputField label={t('form_endDate')} name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('form_budget')}</label>
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 p-1">
          <BudgetOption label={t('form_budget_budget')} value="budget" current={formData.budget} setter={setFormData} />
          <BudgetOption label={t('form_budget_mid')} value="mid" current={formData.budget} setter={setFormData} />
          <BudgetOption label={t('form_budget_luxury')} value="luxury" current={formData.budget} setter={setFormData} />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('form_interests')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {INTEREST_OPTIONS.map(interest => (
            <InterestChip 
              key={interest.id} 
              option={interest} 
              isSelected={formData.interests.includes(interest.id)} 
              onToggle={handleInterestChange}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('form_pace')}</label>
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 p-1">
            <PaceOption label={t('form_pace_relaxed')} value="relaxed" current={formData.pace} setter={setFormData} />
            <PaceOption label={t('form_pace_moderate')} value="moderate" current={formData.pace} setter={setFormData} />
            <PaceOption label={t('form_pace_busy')} value="busy" current={formData.pace} setter={setFormData} />
        </div>
      </div>
      
      <div className="space-y-3">
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('form_generating_button')}
            </>
          ) : t('form_generate_button')}
        </button>
        <button
          type="button"
          onClick={() => onGenerate('quick')}
          disabled={isLoading}
          className="w-full bg-white dark:bg-slate-800 border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-400 dark:disabled:border-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {t('form_generate_quick_button')}
        </button>
      </div>
    </form>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    <input 
      type={type} 
      id={name} 
      name={name} 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
    />
  </div>
);

interface BudgetOptionProps {
  label: string;
  value: 'budget' | 'mid' | 'luxury';
  current: string;
  setter: React.Dispatch<React.SetStateAction<GeneratorFormState>>;
}

const BudgetOption: React.FC<BudgetOptionProps> = ({ label, value, current, setter }) => (
    <button type="button" onClick={() => setter(p => ({...p, budget: value}))} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${current === value ? 'bg-primary text-white shadow' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600'}`}>
        {label}
    </button>
);

interface PaceOptionProps {
    label: string;
    value: 'relaxed' | 'moderate' | 'busy';
    current: string;
    setter: React.Dispatch<React.SetStateAction<GeneratorFormState>>;
}
  
const PaceOption: React.FC<PaceOptionProps> = ({ label, value, current, setter }) => (
    <button type="button" onClick={() => setter(p => ({...p, pace: value}))} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${current === value ? 'bg-primary text-white shadow' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600'}`}>
        {label}
    </button>
);


interface InterestChipProps {
  option: FormOption;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const InterestChip: React.FC<InterestChipProps> = ({ option, isSelected, onToggle }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => onToggle(option.id)}
      className={`flex items-center justify-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm font-medium border rounded-full transition-all ${
        isSelected
          ? 'bg-primary border-primary text-white'
          : 'bg-white border-slate-300 text-slate-700 hover:border-primary hover:text-primary dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary'
      }`}
    >
      {option.icon}
      <span>{t(option.label)}</span>
    </button>
  );
};

export default GeneratorForm;