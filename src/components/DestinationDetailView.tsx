import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Heart, CloudSun, Languages, Plane, MapPin, BellRing, Copy, Check, Navigation, AlertCircle, Bell, Calendar, X } from 'lucide-react';
import { Attraction } from '../types';
import { getWeatherData, getLiveFlights, WeatherForecast, FlightInfo } from '../api';

interface DestinationDetailViewProps {
  attraction: Attraction;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddNotification: (title: string, message: string, type: 'info' | 'price-drop' | 'flight' | 'alert') => void;
}

export default function DestinationDetailView({ attraction, onBack, favorites, onToggleFavorite, onAddNotification }: DestinationDetailViewProps) {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [flights, setFlights] = useState<FlightInfo[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [notificationRegistered, setNotificationRegistered] = useState(false);

  // States for 1-5 Days Flight Search & Instant Booking Engine
  const [selectedOffset, setSelectedOffset] = useState<number>(1);
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({});
  const [bookingFlight, setBookingFlight] = useState<any | null>(null);
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState<any | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('12A');
  const [luggageOption, setLuggageOption] = useState<string>('standard');

  const getOffsetDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getSimulatedFlightsForDay = (offset: number) => {
    const carriers = [
      { name: 'Global Horizon Air', code: 'GH' },
      { name: 'SkyPulse Connect', code: 'SP' },
      { name: 'Nomad Airways', code: 'NA' },
      { name: 'Aero Expedition', code: 'AE' }
    ];
    
    // Seeded random pricing and timing based on attraction rating & offset
    const seed1 = (attraction.id.charCodeAt(0) + offset * 13) % 4;
    const seed2 = (attraction.id.charCodeAt(1) + offset * 27) % 4;
    
    const basePrices: Record<string, number> = {
      'great-wall': 480,
      'santorini': 190,
      'pompeii': 140,
      'fushimi-inari': 525,
      'banff': 220,
      'serengeti': 980
    };
    const basePrice = basePrices[attraction.id] || 250;
    
    // Higher offset = slightly higher/lower prices
    const price1 = Math.round(basePrice * (0.9 + (offset * 0.04) + (seed1 * 0.05)));
    const price2 = Math.round(basePrice * (0.85 + (offset * 0.05) + (seed2 * 0.045)));
    
    return [
      {
        id: `${attraction.id}-${offset}-1`,
        carrier: carriers[seed1].name,
        flightNo: `${carriers[seed1].code}-${100 + offset * 12 + seed1}`,
        departureTime: '08:15 AM',
        arrivalTime: '11:45 AM',
        stops: 'Non-stop',
        price: price1,
        dateStr: getOffsetDate(offset),
        offset
      },
      {
        id: `${attraction.id}-${offset}-2`,
        carrier: carriers[(seed2 + 1) % 4].name,
        flightNo: `${carriers[(seed2 + 1) % 4].code}-${300 + offset * 18 + seed2}`,
        departureTime: '04:40 PM',
        arrivalTime: '10:15 PM',
        stops: '1 layover (LHR)',
        price: price2,
        dateStr: getOffsetDate(offset),
        offset
      }
    ];
  };

  const horizonFlights = getSimulatedFlightsForDay(selectedOffset);

  const handleToggleAlert = (flight: any) => {
    const isNowAlerting = !activeAlerts[flight.id];
    setActiveAlerts(prev => ({ ...prev, [flight.id]: isNowAlerting }));
    
    if (isNowAlerting) {
      onAddNotification(
        `🔔 Flight Monitor Enabled: (${flight.flightNo})`,
        `Real-time price & departure alerts enabled for ${flight.carrier} flying to ${attraction.name} on ${flight.dateStr}. Standard rate is $${flight.price}.`,
        'alert'
      );
      
      // Simulate real-time price drop update in 3.5 seconds to book easily
      setTimeout(() => {
        const dropAmount = Math.round(flight.price * 0.18);
        const newPrice = flight.price - dropAmount;
        onAddNotification(
          `📉 Flight Deal Detected! saved 18% on Flight ${flight.flightNo}`,
          `Good news! Standard fare to ${attraction.name} for ${flight.dateStr} plummeted to $${newPrice} (was $${flight.price}). Secure this ticket easily!`,
          'price-drop'
        );
      }, 3500);
    } else {
      onAddNotification(
        `🔕 Flight Monitor Disabled`,
        `Turned off flight tracker alarms for flight ${flight.flightNo} departing ${flight.dateStr}.`,
        'info'
      );
    }
  };

  const handleStartBooking = (flight: any) => {
    setBookingFlight(flight);
    setBookingSuccessTicket(null);
  };

  const handleConfirmReservation = () => {
    if (!bookingFlight) return;
    
    onAddNotification(
      `✈️ Smart Booking Confirmed! (${bookingFlight.flightNo})`,
      `Your e-ticket to ${attraction.name} on ${bookingFlight.dateStr} via ${bookingFlight.carrier} was successfully secured. Seat: ${selectedSeat}, Luggage: ${luggageOption}.`,
      'flight'
    );
    
    setBookingSuccessTicket({
      ...bookingFlight,
      seat: selectedSeat,
      luggage: luggageOption,
      boardingGroup: 'Zone A',
      bookingRef: `NP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    });
  };

  // Curated local "Things to Do" states powered by server-side Gemini
  interface SuggestionItem {
    name: string;
    description: string;
    category?: string;
    cuisine?: string;
    type?: string;
  }
  interface Suggestions {
    attractions: SuggestionItem[];
    restaurants: SuggestionItem[];
    activities: SuggestionItem[];
  }
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [activeSuggestionTab, setActiveSuggestionTab] = useState<'attractions' | 'restaurants' | 'activities'>('attractions');

  const isFavorite = favorites.includes(attraction.id);

  // Fetch local things-to-do curated guide from server-side Gemini API
  useEffect(() => {
    async function loadSuggestions() {
      if (!attraction.location) return;
      // Extract city name safely
      const city = attraction.location.split(',')[0].trim();
      setLoadingSuggestions(true);
      setSuggestionsError(null);
      setSuggestions(null);

      try {
        const response = await fetch("/api/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ city }),
        });

        if (!response.ok) {
          throw new Error(`Server returned error code ${response.status}`);
        }

        const data = await response.json();
        setSuggestions(data);
      } catch (err: any) {
        console.error("loadSuggestions failed:", err);
        setSuggestionsError("Could not retrieve local recommendations at this time.");
      } finally {
        setLoadingSuggestions(false);
      }
    }
    loadSuggestions();
  }, [attraction]);

  // Load weather and live airport flights dynamically on mount
  useEffect(() => {
    async function loadDynamicDetails() {
      setLoadingWeather(true);
      const weatherData = await getWeatherData(attraction.coords.lat, attraction.coords.lng);
      setWeather(weatherData);
      setLoadingWeather(false);

      setLoadingFlights(true);
      const flightsData = await getLiveFlights(attraction.airport.code);
      setFlights(flightsData);
      setLoadingFlights(false);
    }
    loadDynamicDetails();
  }, [attraction]);

  // Copy vocabulary helper
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 font-sans w-full max-w-7xl mx-auto pb-12 text-left">
      
      {/* Back button and Favorite Trigger */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-sans text-xs font-bold text-slate-700 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" /> Back to Explore Sights
        </button>

        <button 
          onClick={() => onToggleFavorite(attraction.id)}
          className={`p-3 rounded-lg shadow-sm backdrop-blur-md active:scale-90 transition-all cursor-pointer ${
            isFavorite 
              ? 'bg-rose-50 border border-rose-100 text-rose-500' 
              : 'bg-white border border-slate-200 text-slate-400 hover:text-rose-505'
          }`}
        >
          <Heart className="w-5 h-5" fill={isFavorite ? '#f43f5e' : 'none'} />
        </button>
      </div>

      {/* Hero Panoramic Image with Header Title Overlay */}
      <section className="relative w-full rounded-xl overflow-hidden shadow-sm h-[340px] sm:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-black/20 to-transparent z-10"></div>
        <img 
          alt={attraction.name} 
          className="w-full h-full object-cover" 
          src={attraction.image}
        />
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="bg-slate-900 text-white border border-slate-750 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
              {attraction.category} Spot
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-3 leading-tight">
              {attraction.name}
            </h2>
            <p className="text-slate-300 font-sans text-xs font-bold uppercase tracking-wider mt-1">{attraction.location}</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded border border-white/10 self-start sm:self-auto shadow-md">
            <Star className="w-5 h-5 text-amber-400" fill="#f59e0b" />
            <span className="font-sans text-white font-extrabold text-sm">{attraction.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-sans text-xs">(Spot Rating)</span>
          </div>
        </div>
      </section>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Double Column: Description, Language Card, Maps Widget */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Overview Statement */}
          <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-black text-lg text-slate-800 tracking-tight">Sight Overview</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {attraction.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {attraction.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-slate-100 border border-slate-200 text-slate-800 font-sans text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Curious local TripAdvisor-style recommendations powered by Gemini */}
          <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Navigation className="w-5 h-5 text-blue-600 shrink-0" />
                <h3 className="font-display font-black text-lg text-slate-850 tracking-tight">Things to Do nearby</h3>
              </div>
              <span className="text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded font-mono uppercase font-bold tracking-wider">
                TripAdvisor AI Companion
              </span>
            </div>

            <p className="text-slate-500 text-xs">
              Gemini guided local sights, gastronomy, and cultural experiences in <strong>{attraction.location.split(',')[0]}</strong>.
            </p>

            {loadingSuggestions ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-sans text-[10px]">Retrieving curated recommendations...</p>
              </div>
            ) : suggestionsError ? (
              <div className="bg-amber-50 border border-amber-250 text-amber-800 p-4 rounded-xl text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{suggestionsError}</span>
              </div>
            ) : suggestions ? (
              <div className="space-y-4">
                {/* Custom Sub-tabs */}
                <div className="flex border-b border-slate-100 gap-2">
                  <button
                    onClick={() => setActiveSuggestionTab('attractions')}
                    className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider relative cursor-pointer font-sans transition-all ${
                      activeSuggestionTab === 'attractions'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Attractions ({suggestions.attractions?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveSuggestionTab('restaurants')}
                    className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider relative cursor-pointer font-sans transition-all ${
                      activeSuggestionTab === 'restaurants'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Gastronomy ({suggestions.restaurants?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveSuggestionTab('activities')}
                    className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider relative cursor-pointer font-sans transition-all ${
                      activeSuggestionTab === 'activities'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Activities ({suggestions.activities?.length || 0})
                  </button>
                </div>

                {/* Recommendations Feed */}
                <div className="pt-2">
                  {activeSuggestionTab === 'attractions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestions.attractions?.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-sans font-bold text-xs text-slate-800">{item.name}</h4>
                            <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 font-mono">
                              {item.category || 'Sight'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSuggestionTab === 'restaurants' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestions.restaurants?.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-sans font-bold text-xs text-slate-800">{item.name}</h4>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 font-mono">
                              {item.cuisine || 'Eats'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSuggestionTab === 'activities' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestions.activities?.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-sans font-bold text-xs text-slate-800">{item.name}</h4>
                            <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 font-mono">
                              {item.type || 'Experience'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">Awaiting database sync...</p>
            )}
          </section>

          {/* Local Language phrasebook matching section 5 */}
          <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Languages className="w-5 h-5 text-slate-600 animate-pulse" />
                <h3 className="font-display font-black text-lg text-slate-800 tracking-tight">Local Vocabulary Flashcards</h3>
              </div>
              <span className="text-xs bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded font-mono uppercase font-bold">
                {attraction.languages.primary}
              </span>
            </div>

            <p className="text-slate-505 text-xs">
              Primary travelers communicate best when they utilize standard vocabulary indexes blocks. Tap to copy quick phrases.
            </p>

            <div className="space-y-3 pt-2">
              {attraction.languages.phrases.map((phrase, i) => (
                <div 
                  key={i} 
                  onClick={() => copyToClipboard(phrase.original.split(' (')[0], i)}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 rounded-lg flex items-center justify-between gap-4 cursor-pointer transition-all group"
                >
                  <div className="space-y-0.5">
                    <p className="font-sans font-extrabold text-xs text-slate-800">{phrase.original}</p>
                    <p className="font-sans text-[10px] text-slate-400 font-medium">Pronounced: &ldquo;<em className="not-italic text-slate-900 font-semibold">{phrase.pronunciation}</em>&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-xs text-slate-705">{phrase.english}</span>
                    <button className="text-slate-400 group-hover:text-slate-900 transition-colors cursor-pointer">
                      {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Google Maps Interactive Component Container */}
          <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-slate-700" />
                <h3 className="font-display font-black text-lg text-slate-800 tracking-tight">Google Map Orientation</h3>
              </div>
              
              <div className="text-[10px] font-mono text-slate-750 font-bold uppercase py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                Lat: {attraction.coords.lat}, Lng: {attraction.coords.lng}
              </div>
            </div>

            <div className="aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group min-h-[250px]">
              {/* Actual embedded Google Maps Map Frame */}
              <iframe
                title={`Google Map positioning for ${attraction.name}`}
                src={`https://maps.google.com/maps?q=${attraction.coords.lat},${attraction.coords.lng}&z=13&output=embed`}
                className="w-full h-full border-none opacity-90 hover:opacity-100 transition-opacity"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
              ></iframe>

              <div className="absolute bottom-3 right-3 bg-slate-950 text-white px-3 py-1.5 rounded-lg border border-slate-850 text-[10px] font-sans font-bold flex items-center gap-1.5 pointer-events-none shadow-md font-mono">
                <MapPin className="w-3.5 h-3.5 text-slate-300" /> Ground Positioning Active
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Local weather widget, local airport info, live flight runway index */}
        <div className="lg:col-span-4 space-y-8 text-left">
          
          {/* Weather card */}
          <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-black text-base text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-150 pb-2">
              <CloudSun className="w-5 h-5 text-slate-500" /> Meteorological Index
            </h3>
            
            {loadingWeather ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-4 border-slate-100 border-t-slate-800 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-sans text-xs">Querying Open-Meteo feeds...</p>
              </div>
            ) : weather ? (
              <div className="space-y-4">
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase">CURRENT LEVEL</span>
                    <span className="text-3xl font-display font-black text-slate-800">{weather.currentTemp}°C</span>
                    <span className="text-[11px] text-slate-505 font-bold block mt-0.5">{weather.conditionText}</span>
                  </div>
                  
                  <div className="w-14 h-14 bg-slate-100 border border-slate-205 rounded-lg flex items-center justify-center text-slate-800 font-bold text-lg select-none">
                    {weather.condition === 'sunny' ? '☀️' : weather.condition === 'cloudy' ? '⛅' : '🌦️'}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-sans font-bold text-slate-400 block tracking-wider uppercase font-mono">3-DAY HORIZON EXPECTATION</span>
                  <div className="grid grid-cols-3 gap-2">
                    {weather.forecast.map((fc, i) => (
                      <div key={i} className="bg-slate-50/50 border border-slate-200 p-2 text-center rounded-lg space-y-1">
                        <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-tight">{fc.day}</span>
                        <span className="text-xs font-bold font-sans">{fc.condition === 'sunny' ? '☀️' : fc.condition === 'cloudy' ? '⛅' : '🌦️'}</span>
                        <span className="text-xs font-bold text-slate-805 block">{fc.temp}°C</span>
                        <span className="text-[8px] text-slate-400 block leading-none truncate">{fc.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}
          </section>

          {/* Airport parameters and live runway tracking */}
          <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-150 pb-2">
              <Plane className="w-5 h-5 text-slate-500" />
              <h3 className="font-display font-black text-base text-slate-800 tracking-tight">Runway Transport</h3>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans font-bold space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">DESTINATION AIRPORT</span>
              <p className="text-slate-800 text-sm font-black flex items-center justify-between">
                <span>{attraction.airport.name}</span>
                <span className="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded ml-2 select-all">{attraction.airport.code}</span>
              </p>
              <div className="flex justify-between text-slate-500 text-[11px] pt-1 font-mono">
                <span>Distance: {attraction.airport.distance}</span>
                <span>Drive: {attraction.airport.driveTime}</span>
              </div>
            </div>

            {/* Live Flights Indexing matching Section 6 runway */}
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">LIVE ARRIVALS INDEX ({attraction.airport.code})</span>
                <button 
                  onClick={() => setNotificationRegistered(!notificationRegistered)}
                  className={`text-[9px] font-bold p-1 px-2 rounded-lg uppercase border active:scale-95 transition-all cursor-pointer ${
                    notificationRegistered 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-250 font-bold' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {notificationRegistered ? 'Alert Set' : 'Monitor Flight'}
                </button>
              </div>

              {loadingFlights ? (
                <div className="py-4 text-center">
                  <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin mx-auto mb-1"></div>
                  <p className="text-slate-400 font-sans text-[10px]">Gathering Live feed...</p>
                </div>
              ) : flights.length > 0 ? (
                <div className="space-y-2">
                  {flights.map((f, i) => (
                    <div key={i} className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs transition-colors">
                      <div className="space-y-0.5">
                        <p className="font-mono font-bold text-slate-800">{f.flightNumber}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{f.airline}</p>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className="text-[10px] text-slate-500 block">Orig: <strong className="text-slate-700 font-extrabold">{f.departure.split(' (')[0]}</strong></span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono inline-block uppercase tracking-wider border ${
                          f.status === 'Landed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : f.status === 'Delayed'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {f.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 text-[10px] font-mono">No immediate scheduled arrivals available.</p>
              )}
            </div>
          </section>

          {/* Smart Flight Alerts & 1-5 Days Booking Outlook card */}
          <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-150 pb-2 justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600 animate-bounce" />
                <h3 className="font-display font-black text-base text-slate-800 tracking-tight">1-5 Days Outlook Alerts</h3>
              </div>
              <span className="text-[9px] bg-blue-50 border border-blue-200 text-blue-700 font-mono font-extrabold px-1.5 py-0.5 rounded">
                SIMULATOR
              </span>
            </div>

            <p className="text-slate-500 text-xs">
              Select departing offsets (1 to 5 days out) to display low pricing alerts, secure electronic tickets easily, or receive instantaneous test deals.
            </p>

            {/* Selector range buttons */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {[1, 2, 3, 4, 5].map((day) => {
                const isActive = selectedOffset === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedOffset(day)}
                    className={`text-[10px] font-bold py-1.5 px-0.5 rounded-lg border transition-all cursor-pointer font-sans text-center flex flex-col justify-center items-center ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-850'
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase font-extrabold">D+{day}</span>
                    <span className="text-[8px] font-normal leading-tight opacity-90 truncate max-w-full">
                      {getOffsetDate(day).split(',')[1]?.trim()?.split(' ')[0]} {getOffsetDate(day).split(',')[1]?.trim()?.split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* List Simulated Flight Deals for that Day */}
            <div className="space-y-3 pt-2">
              {horizonFlights.map((flight) => {
                const isAlerting = activeAlerts[flight.id];
                return (
                  <div key={flight.id} className="p-3 bg-slate-50/75 hover:bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2.5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-800">{flight.flightNo}</span>
                        <span className="text-[9px] text-slate-400 block font-medium">{flight.carrier}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 block">${flight.price}</span>
                        <span className="text-[9px] text-emerald-600 block font-mono font-semibold">{flight.stops}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-dashed border-slate-200 pt-2">
                      <span>Dep: {flight.departureTime}</span>
                      <span>Arr: {flight.arrivalTime}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleToggleAlert(flight)}
                        className={`text-[10px] font-extrabold py-2 px-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          isAlerting
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250 font-black'
                            : 'bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-800 border-slate-200 shadow-sm'
                        }`}
                        title={isAlerting ? 'Press to disable price tracker' : 'Press to track standard tickets'}
                      >
                        <Bell className="w-3.5 h-3.5 animate-pulse" fill={isAlerting ? 'currentColor' : 'none'} />
                        {isAlerting ? 'Alert Set' : 'Monitor Flight'}
                      </button>

                      <button
                        onClick={() => handleStartBooking(flight)}
                        className="text-[10px] font-extrabold py-2 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" /> Book Ticket
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

      </div>

      {/* Express Passenger Booking Modal Portal */}
      {bookingFlight && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in text-slate-850">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden text-left flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <span className="text-[8px] bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-mono font-bold uppercase block w-max mb-1">express gate</span>
                <h3 className="font-display font-black text-sm uppercase tracking-wide text-slate-900">Passenger Reservation Portal</h3>
              </div>
              <button 
                onClick={() => setBookingFlight(null)}
                className="text-slate-400 hover:text-slate-650 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingSuccessTicket ? (
              <div className="p-6 space-y-4">
                
                {/* Flight Summary Card */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-extrabold">{bookingFlight.flightNo}</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{bookingFlight.carrier}</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">${bookingFlight.price}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>Date: {bookingFlight.dateStr}</span>
                    <span>Stops: {bookingFlight.stops}</span>
                  </div>
                </div>

                {/* Booking Options */}
                <div className="space-y-4">
                  {/* Seat Select Block */}
                  <div>
                    <label className="text-[10px] font-sans font-extrabold text-slate-400 block tracking-wider uppercase font-mono mb-1.5">Select Seat Coordinates</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['12A', '12B', '15C', '16D'].map((seat) => (
                        <button
                          key={seat}
                          onClick={() => setSelectedSeat(seat)}
                          className={`py-1.5 px-2 rounded-lg border font-mono text-xs font-bold cursor-pointer transition-all ${
                            selectedSeat === seat
                              ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-705'
                          }`}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Baggage selector */}
                  <div>
                    <label className="text-[10px] font-sans font-extrabold text-slate-400 block tracking-wider uppercase font-mono mb-1.5">Add Checked Luggage</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setLuggageOption('standard')}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          luggageOption === 'standard'
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-705'
                        }`}
                      >
                        <p className="text-xs font-bold font-sans">Standard</p>
                        <p className="text-[9px] opacity-75 mt-0.5">1 carry-on only (Free)</p>
                      </button>
                      <button
                        onClick={() => setLuggageOption('heavy')}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          luggageOption === 'heavy'
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-705'
                        }`}
                      >
                        <p className="text-xs font-bold font-sans">Business Max</p>
                        <p className="text-[9px] opacity-75 mt-0.5">+ 2 Checked bags ($45)</p>
                      </button>
                    </div>
                  </div>

                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-3">
                  <button
                    onClick={() => setBookingFlight(null)}
                    className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-sans text-xs font-bold rounded-xl active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-extrabold rounded-xl active:scale-95 transition-all shadow-sm text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Issue Ticket (${luggageOption === 'heavy' ? bookingFlight.price + 45 : bookingFlight.price})
                  </button>
                </div>

              </div>
            ) : (
              // Ticket details success page
              <div className="p-6 space-y-5 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto select-none font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-display font-black text-slate-900 text-base">Flight Ticket Secured!</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">Your boarding pass has been issued and linked to your Nomad travel logs.</p>
                </div>

                {/* Simulated physical ticket */}
                <div className="bg-[#FAF9F5] border border-orange-200/50 rounded-xl p-4 text-left font-mono text-zinc-700 space-y-3 relative overflow-hidden">
                  
                  {/* Decorative ticket punches */}
                  <div className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-white border border-transparent border-r-orange-200/50 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-white border border-transparent border-l-orange-200/50 transform -translate-y-1/2"></div>

                  <div className="flex justify-between border-b border-dashed border-orange-200/70 pb-2">
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase">CARRIER SIGN</span>
                      <span className="text-[10px] font-bold text-slate-800">{bookingSuccessTicket.carrier}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-zinc-400 block uppercase">REF INDEX</span>
                      <span className="text-[10px] font-bold text-slate-800">{bookingSuccessTicket.bookingRef}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase">FLIGHT</span>
                      <span className="font-bold text-slate-800">{bookingSuccessTicket.flightNo}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase">TARGET PLACE</span>
                      <span className="font-bold text-slate-800">{attraction.airport.code} ({attraction.airport.name.split(' ')[0]})</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase">TARGET DEPARTURE</span>
                      <span className="font-bold text-slate-800 text-[9px]">{bookingSuccessTicket.dateStr}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase">GATE / SEAT CODE</span>
                      <span className="font-bold text-slate-800">C24 / {bookingSuccessTicket.seat} ({bookingSuccessTicket.boardingGroup})</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-orange-200/70 pt-3 text-center">
                    <span className="text-xs font-bold text-zinc-350 block select-none tracking-widest leading-none">|||||||||||||||||||||||||||||||||||||</span>
                    <span className="text-[7px] text-zinc-400 block uppercase tracking-wide mt-1">E-BOARDING GATE BARCODE PROTOCOL</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingFlight(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-extrabold rounded-xl active:scale-95 transition-all text-center cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
