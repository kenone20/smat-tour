import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratorFormState, Itinerary, GenerationType } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mocked data. Please provide a valid Gemini API key for live generation.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const MOCK_ITINERARY: Itinerary = {
    tripName: "Amazing Trip to Paris (Mock Data)",
    destination: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    totalDays: 5,
    totalCost: 1500,
    itinerary: [
        {
            day: 1,
            date: "2024-10-26",
            title: "Arrival and Eiffel Tower Magic",
            dailyCost: 250,
            activities: [
                { time: "14:00", description: "Arrive at Charles de Gaulle Airport (CDG) and take a taxi to your hotel.", estimatedCost: "€60", transport: "Taxi" },
                { time: "16:00", description: "Check into your hotel and freshen up.", estimatedCost: "€150 (accommodation)", latitude: 48.86, longitude: 2.34 },
                { time: "18:00", description: "Evening visit to the Eiffel Tower. Pre-book tickets to avoid long queues.", estimatedCost: "€25", bookingLink: "https://www.toureiffel.paris/en", latitude: 48.8584, longitude: 2.2945 },
                { time: "20:00", description: "Dinner at a classic French bistro in the 7th arrondissement.", estimatedCost: "€50", latitude: 48.855, longitude: 2.31 }
            ]
        },
        {
            day: 2,
            date: "2024-10-27",
            title: "Art and History at the Louvre",
            dailyCost: 300,
            activities: [
                { time: "09:00", description: "Morning at the Louvre Museum. Focus on key exhibits like the Mona Lisa and Venus de Milo.", estimatedCost: "€17", transport: "Metro", latitude: 48.8606, longitude: 2.3376 },
                { time: "13:00", description: "Lunch in the Tuileries Garden.", estimatedCost: "€20", latitude: 48.863, longitude: 2.327 },
                { time: "15:00", description: "Explore the historic neighborhood of Le Marais, with its unique shops and architecture.", estimatedCost: "Free", latitude: 48.857, longitude: 2.359 },
                { time: "19:00", description: "Enjoy a relaxing dinner cruise on the Seine River.", estimatedCost: "€100", bookingLink: "https://www.bateauxparisiens.com/", latitude: 48.852, longitude: 2.300 }
            ]
        }
    ]
};

const MOCK_QUICK_ITINERARY: Itinerary = {
    tripName: "Quick Plan for Paris (Mock Data)",
    destination: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    totalDays: 1,
    totalCost: 300,
    itinerary: [
        {
            day: 1,
            date: new Date().toISOString().split('T')[0],
            title: "A Whirlwind Day in Paris",
            dailyCost: 300,
            activities: [
                { time: "Morning", description: "Visit the iconic Eiffel Tower for breathtaking views.", estimatedCost: "€25", latitude: 48.8584, longitude: 2.2945 },
                { time: "Afternoon", description: "Explore masterpieces at the Louvre Museum.", estimatedCost: "€17", latitude: 48.8606, longitude: 2.3376 },
                { time: "Evening", description: "Enjoy a scenic dinner cruise on the Seine River.", estimatedCost: "€100", latitude: 48.852, longitude: 2.300 }
            ]
        }
    ]
};


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        tripName: { type: Type.STRING, description: "A creative and descriptive name for the trip." },
        destination: { type: Type.STRING },
        latitude: { type: Type.NUMBER, description: "The latitude of the main destination city." },
        longitude: { type: Type.NUMBER, description: "The longitude of the main destination city." },
        totalDays: { type: Type.INTEGER },
        totalCost: { type: Type.NUMBER, description: "Estimated total cost in USD." },
        itinerary: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER },
                    date: { type: Type.STRING, description: "Date in YYYY-MM-DD format." },
                    title: { type: Type.STRING, description: "A catchy title for the day's theme." },
                    dailyCost: { type: Type.NUMBER, description: "Estimated cost for the day in USD." },
                    activities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                time: { type: Type.STRING, description: "Start time in HH:MM format or a general time like 'Morning'." },
                                description: { type: Type.STRING, description: "Detailed description of the activity." },
                                estimatedCost: { type: Type.STRING, description: "Estimated cost for this activity, including currency symbol if applicable." },
                                bookingLink: { type: Type.STRING, description: "A URL for booking tickets or reservations. Can be a search link." },
                                transport: { type: Type.STRING, description: "Recommended mode of transport to get here." },
                                alternatives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "1-2 alternative suggestions for this activity slot." },
                                latitude: { type: Type.NUMBER, description: "The latitude of the activity location. Optional." },
                                longitude: { type: Type.NUMBER, description: "The longitude of the activity location. Optional." }
                            },
                            required: ["time", "description", "estimatedCost"]
                        }
                    }
                },
                required: ["day", "date", "title", "dailyCost", "activities"]
            }
        }
    },
    required: ["tripName", "destination", "latitude", "longitude", "totalDays", "totalCost", "itinerary"]
};


export const generateItinerary = async (formData: GeneratorFormState, type: GenerationType, language: string): Promise<Itinerary> => {
    if (!process.env.API_KEY) {
        console.log(`Using mock data for '${type}' plan because API_KEY is not set.`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        return type === 'quick' ? MOCK_QUICK_ITINERARY : MOCK_ITINERARY;
    }

    const { destination, startDate, endDate, budget, interests, pace, tripName } = formData;
    const duration = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24) + 1;
    
    const languageMap: { [key: string]: string } = {
        en: 'English',
        fr: 'French',
        es: 'Spanish',
        ar: 'Arabic'
    };
    const languageName = languageMap[language] || 'English';

    let systemInstruction = `You are SmartTour AI, an expert travel planner. Your goal is to generate a detailed, day-by-day travel itinerary in JSON format that is practical, inspiring, and tailored to the user's preferences. You MUST adhere to the provided JSON schema. For booking links, provide direct search URLs on popular sites like Booking.com for hotels, GetYourGuide for tours, or Skyscanner for flights. You MUST also provide valid latitude and longitude coordinates for the main destination and for each specific activity location (like a museum, restaurant, or park).`;
    
    let userPrompt = `
        Please generate a travel itinerary based on these details:
        - Trip Name: "${tripName}"
        - Destination: ${destination}
        - Dates: From ${startDate} to ${endDate} (${duration} days)
        - Travel Style/Budget: ${budget}
        - Pace: ${pace}
        - Interests: ${interests.join(', ')}

        Generate a complete itinerary object following the specified JSON schema, including coordinates. Ensure the number of days in the itinerary array matches the trip duration.
        IMPORTANT: The entire response, including all text fields like tripName, titles, descriptions, and activity details, must be in ${languageName}.
    `;

    if (type === 'quick') {
        systemInstruction = `You are SmartTour AI, an expert travel planner. Your goal is to generate a condensed, single-page summary travel itinerary in JSON format. This should be a high-level overview, not a detailed plan. You MUST adhere to the provided JSON schema, but generate an itinerary for ONLY ONE representative day. You MUST also provide valid latitude and longitude coordinates for the main destination and for each specific activity location.`;
        userPrompt = `
            Please generate a QUICK, ONE-PAGE SUMMARY travel itinerary based on these details:
            - Trip Name: "${tripName} (Quick Plan)"
            - Destination: ${destination}
            - Dates: From ${startDate} to ${endDate}
            - Travel Style/Budget: ${budget}
            - Pace: ${pace}
            - Interests: ${interests.join(', ')}
    
            Generate an itinerary object for a single, representative day that captures the essence of the trip, including coordinates. Focus on 3-5 key highlights. The 'totalDays' should be 1.
            IMPORTANT: The entire response, including all text fields like tripName, titles, descriptions, and activity details, must be in ${languageName}.
        `;
    }


    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const itineraryData = JSON.parse(jsonText);

        // Basic validation
        if (!itineraryData.itinerary || !Array.isArray(itineraryData.itinerary)) {
            throw new Error("Invalid itinerary structure received from API.");
        }

        return itineraryData as Itinerary;

    } catch (error) {
        console.error("Error generating itinerary:", error);
        throw new Error("Failed to generate itinerary. The model may have returned an invalid format. Please try again.");
    }
};