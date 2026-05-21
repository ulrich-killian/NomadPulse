import React, { useState } from 'react';
import { Sparkles, Star, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Tour } from '../types';

interface ToursViewProps {
  tours: Tour[];
}

export default function ToursView({ tours }: ToursViewProps) {
  const [bookingTour, setBookingTour] = useState<Tour | null>(null);
  const [travelerName, setTravelerName] = useState('Alex Graham');
  const [ticketCount, setTicketCount] = useState(2);
  const [bookingDate, setBookingDate] = useState('2026-05-28');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      // Closes modal/drawer after summary
    }, 4000);
  };

  const closeBookingFlow = () => {
    setBookingTour(null);
    setBookingConfirmed(false);
  };

  return (
    <div className="flex flex-col gap-8 font-sans w-full">
      
      {/* View Header */}
      <section className="border-b border-slate-200 pb-6 text-left">
        <span className="text-xs font-bold text-slate-700 font-mono uppercase tracking-widest bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">Curated Expeditions</span>
        <h2 className="font-display font-black text-3xl text-slate-850 tracking-tight mt-2">Elite Local Tours</h2>
        <p className="text-slate-500 font-medium text-sm">Privately led tour modules that fully immerse you in history, yachting, and nature.</p>
      </section>

      {/* Main Tours Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {tours.map((tour) => (
          <article 
            key={tour.id}
            className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm group hover:border-slate-350 transition-all flex flex-col sm:flex-row"
          >
            {/* Image section */}
            <div className="relative w-full sm:w-1/2 aspect-[4/3] sm:aspect-auto">
              <img 
                alt={tour.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={tour.image}
              />
              {tour.trending && (
                <div className="absolute top-4 left-4 bg-slate-900 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-550" /> Trending
                </div>
              )}
            </div>

            {/* Content info section */}
            <div className="p-6 sm:w-1/2 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {tour.category}
                  </span>
                  
                  <div className="flex items-center gap-1 font-sans text-xs font-bold text-slate-800">
                    <Star className="w-4.5 h-4.5 text-amber-500" fill="#f59e0b" />
                    {tour.rating.toFixed(1)}
                  </div>
                </div>

                <h3 className="font-display font-black text-slate-850 text-base leading-snug group-hover:text-slate-900 transition-colors">
                  {tour.name}
                </h3>

                <p className="text-slate-500 text-xs leading-relaxed">
                  {tour.description}
                </p>
                
                {/* Specific features tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tour.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-slate-50 border border-slate-200 text-slate-500 text-[9px] font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Booking Actions */}
              <div className="flex items-center justify-between border-t border-slate-150 pt-4 mt-auto">
                <div>
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block font-mono">PER EXPLORER</span>
                  <span className="text-lg font-mono font-extrabold text-slate-900">€{tour.price}</span>
                </div>

                <button 
                  onClick={() => setBookingTour(tour)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs px-5 py-2.5 rounded-lg uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Booking Form Dialog / Drawer Overlay */}
      {bookingTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 max-w-sm w-full transform transition-all relative">
            
            {/* Close button x */}
            <button 
              onClick={closeBookingFlow}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 border border-slate-200 rounded-lg text-lg leading-none cursor-pointer"
            >
              ×
            </button>

            {bookingConfirmed ? (
              <div className="p-8 text-center flex flex-col items-center gap-4">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
                <h3 className="font-display font-black text-xl text-slate-900">Booking Success</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Congratulations, your ticket has been reserved under the profile of <strong>{travelerName}</strong>.
                </p>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-left font-sans space-y-2 text-xs">
                  <p className="flex justify-between">
                    <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9px]">EXPEDITION</span>
                    <span className="font-bold text-slate-800">{bookingTour.name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9px]">DATE SCHEDULE</span>
                    <span className="font-bold text-slate-800">{bookingDate}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400 uppercase font-bold tracking-wider font-mono text-[9px]">TRAVELERS</span>
                    <span className="font-bold text-slate-800">{ticketCount} Tickets</span>
                  </p>
                  <p className="flex justify-between pt-2 border-t border-slate-200 text-xs font-extrabold text-slate-900 font-mono">
                    <span>TOTAL CHARGES</span>
                    <span>€{bookingTour.price * ticketCount}</span>
                  </p>
                </div>
                <button 
                  onClick={closeBookingFlow}
                  className="mt-4 w-full bg-slate-900 text-white font-display font-bold text-xs uppercase tracking-wider py-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <div className="p-6 pt-8 text-left">
                <h3 className="font-display font-black text-lg text-slate-900 mb-1">Configure Your Expedition</h3>
                <p className="text-slate-500 text-[11px] mb-6">Confirm details below. Tickets include private guiding & full transport amenities.</p>
                
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Primary Traveler Profile</label>
                    <input 
                      type="text" 
                      required
                      value={travelerName} 
                      onChange={(e) => setTravelerName(e.target.value)}
                      className="w-full p-2.5 text-xs font-sans font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Travel Date</label>
                      <input 
                        type="date" 
                        required
                        value={bookingDate} 
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-2.5 text-xs font-sans font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Explorer Count</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="10"
                        required
                        value={ticketCount} 
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                        className="w-full p-2.5 text-xs font-sans font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2 mt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal ({ticketCount} × €{bookingTour.price}):</span>
                      <span className="font-bold text-slate-700">€{bookingTour.price * ticketCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Eco Levy:</span>
                      <span className="font-bold text-emerald-600">Included</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                      <span>Final Estimate Charge:</span>
                      <span className="font-mono">€{bookingTour.price * ticketCount}</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-lg active:scale-95 transition-all mt-4 cursor-pointer"
                  >
                    Confirm Tour Booking
                  </button>

                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
