import React, { useState } from 'react';
import type { Itinerary, DayPlan, Activity } from '../types';
import {
    CalendarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    DocumentDuplicateIcon,
    LinkIcon,
    MapPinIcon,
    ShareIcon,
    ArrowDownTrayIcon,
    ListBulletIcon,
    MapIcon
} from './IconComponents';
import { useTranslation } from '../contexts/LanguageContext';
import MapView from './MapView';


// Add declarations for the CDN-loaded libraries to avoid TypeScript errors
declare const html2canvas: any;
declare const jspdf: any;

interface ItineraryDisplayProps {
    itinerary: Itinerary;
}

type ViewMode = 'list' | 'map';

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const { t } = useTranslation();

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(itinerary, null, 2));
        alert(t('alert_copied_clipboard_json'));
    };

    const formatItineraryForSharing = (itineraryData: Itinerary): string => {
        let shareText = `${t('share_text_header', { tripName: itineraryData.tripName })}\n\n`;
        shareText += `${t('share_text_destination', { destination: itineraryData.destination })}\n`;
        shareText += `${t('share_text_duration', { totalDays: itineraryData.totalDays })}\n`;
        shareText += `${t('share_text_cost', { totalCost: itineraryData.totalCost.toLocaleString() })}\n`;
        shareText += `\n------------------------------\n\n`;

        itineraryData.itinerary.forEach(day => {
            shareText += `${t('share_text_day_header', { day: day.day, title: day.title, date: day.date })}\n`;
            day.activities.forEach(activity => {
                shareText += `  - ${activity.time}: ${activity.description} (${activity.estimatedCost})\n`;
            });
            shareText += `\n`;
        });
        
        shareText += t('share_text_footer');
        return shareText;
    };

    const handleShare = async () => {
        const shareText = formatItineraryForSharing(itinerary);
        const shareData = {
            title: itinerary.tripName,
            text: shareText,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    console.log('Share was cancelled by the user.');
                } else {
                    console.error('Error sharing:', error);
                    navigator.clipboard.writeText(shareText);
                    alert(t('alert_share_failed'));
                }
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert(t('alert_copied_clipboard_share'));
        }
    };

    const handleDownloadPdf = async () => {
        // Ensure list view is active for PDF generation
        if (viewMode === 'map') {
            await setViewMode('list');
            // Allow time for the DOM to update before capturing
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const input = document.getElementById('itinerary-content-render');
        if (!input) {
            console.error("Itinerary content element not found!");
            return;
        }

        setIsDownloadingPdf(true);

        try {
            const canvas = await html2canvas(input, {
                scale: 2, 
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;

            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const fileName = `${itinerary.tripName.replace(/ /g, '-')}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(t('alert_pdf_error'));
        } finally {
            setIsDownloadingPdf(false);
        }
    };


    return (
        <div className="bg-white rounded-2xl shadow-lg mt-12 w-full animate-fade-in">
            <div className="p-6 md:p-8">
                <div className="border-b border-slate-200 pb-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary">{itinerary.tripName}</h2>
                            <div className="flex items-center mt-2 text-slate-500">
                                <MapPinIcon className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                <span>{itinerary.destination}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                             <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                 <button
                                    onClick={handleDownloadPdf}
                                    title={t('itinerary_download_title')}
                                    disabled={isDownloadingPdf}
                                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors disabled:text-slate-300 disabled:cursor-wait"
                                >
                                    {isDownloadingPdf ? (
                                        <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <ArrowDownTrayIcon className="w-6 h-6" />
                                    )}
                                </button>
                                 <button
                                    onClick={handleShare}
                                    title={t('itinerary_share_title')}
                                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                >
                                    <ShareIcon className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleCopy}
                                    title={t('itinerary_copy_title')}
                                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                >
                                    <DocumentDuplicateIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="bg-slate-100 rounded-full p-1 flex space-x-1 rtl:space-x-reverse">
                                <ViewToggleButton icon={<ListBulletIcon className="w-5 h-5" />} label={t('itinerary_view_list')} isActive={viewMode === 'list'} onClick={() => setViewMode('list')} />
                                <ViewToggleButton icon={<MapIcon className="w-5 h-5" />} label={t('itinerary_view_map')} isActive={viewMode === 'map'} onClick={() => setViewMode('map')} />
                            </div>
                        </div>
                    </div>
                </div>

                <div id="itinerary-content-render">
                    {viewMode === 'list' && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-center">
                                <StatCard icon={<CalendarIcon className="w-6 h-6 text-primary" />} label={t('itinerary_stat_duration')} value={t('days', {count: itinerary.totalDays})} />
                                <StatCard icon={<CurrencyDollarIcon className="w-6 h-6 text-primary" />} label={t('itinerary_stat_cost')} value={`$${itinerary.totalCost.toLocaleString()}`} />
                                <StatCard icon={<ClockIcon className="w-6 h-6 text-primary" />} label={t('itinerary_stat_pace')} value="Varies" className="col-span-2 md:col-span-1" />
                            </div>
                            <div className="space-y-8">
                                {itinerary.itinerary.map((day) => (
                                    <DayCard key={day.day} day={day} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                {viewMode === 'map' && <MapView itinerary={itinerary} />}
            </div>

            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

interface ViewToggleButtonProps {
    icon: React.ReactElement;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const ViewToggleButton: React.FC<ViewToggleButtonProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        title={label}
        className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full text-sm transition-colors ${
            isActive
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:bg-slate-200'
        }`}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);


const StatCard: React.FC<{ icon: React.ReactElement, label: string, value: string, className?: string }> = ({ icon, label, value, className = '' }) => (
    <div className={`bg-slate-50 p-4 rounded-lg flex flex-col items-center justify-center ${className}`}>
        {icon}
        <p className="text-sm text-slate-500 mt-1">{label}</p>
        <p className="text-lg font-bold text-secondary">{value}</p>
    </div>
);

const DayCard: React.FC<{ day: DayPlan }> = ({ day }) => {
    const { t } = useTranslation();
    return (
        <div className="border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-primary">{t('itinerary_day')} {day.day} - {day.title}</h3>
                    <p className="text-sm text-slate-500">{day.date}</p>
                </div>
                <div className="text-right rtl:text-left">
                    <p className="text-lg font-semibold text-secondary">${day.dailyCost}</p>
                    <p className="text-xs text-slate-400">{t('itinerary_dailyCost_label')}</p>
                </div>
            </div>

            <div className="space-y-4">
                {day.activities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                ))}
            </div>
        </div>
    );
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-start space-x-4 rtl:space-x-reverse p-4 bg-slate-50/50 rounded-lg">
            <div className="flex-shrink-0 w-20 text-center">
                <p className="font-bold text-primary">{activity.time}</p>
            </div>
            <div className="flex-1 ltr:border-l-2 rtl:border-r-2 border-primary/20 ltr:pl-4 rtl:pr-4">
                <p className="font-semibold text-slate-800">{activity.description}</p>
                <div className="text-sm text-slate-500 mt-1 space-y-1">
                    <p>{t('itinerary_activity_cost_label')} <span className="font-medium text-slate-600">{activity.estimatedCost}</span></p>
                    {activity.transport && <p>{t('itinerary_activity_transport_label')} <span className="font-medium text-slate-600">{activity.transport}</span></p>}
                    {activity.bookingLink && (
                        <a href={activity.bookingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                            <LinkIcon className="w-4 h-4 ltr:mr-1 rtl:ml-1" />
                            {t('itinerary_activity_booking_label')}
                        </a>
                    )}
                    {activity.alternatives && activity.alternatives.length > 0 && (
                        <div className="pt-2">
                            <p className="font-medium text-slate-600">{t('itinerary_activity_alternatives_label')}</p>
                            <ul className="list-disc ltr:list-inside rtl:list-inside rtl:pr-4">
                                {activity.alternatives.map((alt, i) => <li key={i}>{alt}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItineraryDisplay;