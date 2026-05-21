import React, { useState } from 'react';
import { Search, Calendar, Landmark, Anchor, Trees, Building, Sparkles } from 'lucide-react';
import { Attraction } from '../types';

interface HomeViewProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: string) => void;
  featuredAttraction: Attraction;
  onSelectAttraction: (attraction: Attraction) => void;
}

export default function HomeView({ onSearch, onFilterCategory, featuredAttraction, onSelectAttraction }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState('May 25 - Jun 04, 2026');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const categories = [
    { id: 'Beach', label: 'Beach', icon: Anchor, color: 'text-sky-500 bg-sky-50' },
    { id: 'Mountain', label: 'Mountain', icon: Trees, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'City', label: 'City', icon: Building, color: 'text-purple-500 bg-purple-50' },
    { id: 'History', label: 'History', icon: Landmark, color: 'text-amber-500 bg-amber-50' },
    { id: 'Wellness', label: 'Wellness', icon: Sparkles, color: 'text-rose-500 bg-rose-50' },
  ];

  return (
    <div className="flex flex-col gap-12 font-sans w-full">
      
      {/* Hero Panoramic Image with Centered Desktop Search Bar */}
      <section className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl h-[450px] sm:h-[520px] lg:h-[580px] group">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
          <img 
            alt="Secluded tropical beach cinematic view" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMCQPOs9Gi41fhGOP37Dd-cJrkk211fV31r3NfQyw9GC1vni88En5yquDOgAKxuxDcdaWnDISGqSpAM7lacpP_KG7Ktr5gemGvfyvn_t6y_FNFcGlp5WUKavw1EM5rShR6sxOd5TCHVai4jHofaPOy3k253rebiVJnKysAvFeiQC-qAXf3tCSYSZnpe2_gGOHFDvsoXvI-1RE732RJfzZIFKGPD1YX66K-TpzkfypaOHWCTFKcC9KksNlnayyHNjKFF1s6eU3m-BXT"
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-20 w-full h-full p-6 sm:p-12 flex flex-col justify-end items-center text-center">
          <div className="max-w-4xl flex flex-col gap-8 items-center pb-8 sm:pb-12">
            
            {/* Headline and text */}
            <div className="space-y-4">
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-xl tracking-tight leading-tight">
                Discover the world&apos;s most <span className="text-amber-400">hidden gems</span>
              </h2>
              <p className="text-sky-50/95 font-medium text-sm sm:text-lg lg:text-xl drop-shadow-md max-w-2xl mx-auto">
                Premium, effortless travel experiences designed for the modern explorer.
              </p>
            </div>

            {/* Central Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl">
              <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-full p-2 shadow-2xl flex flex-col sm:flex-row items-center gap-2 group transition-all hover:ring-4 hover:ring-white/10">
                
                <div className="flex-grow flex items-center w-full">
                  <div className="pl-4 pr-2 text-blue-600">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where would you like to go?" 
                    className="bg-transparent border-none text-slate-800 focus:outline-none placeholder:text-slate-400 font-sans font-medium text-sm sm:text-base h-12 w-full focus:ring-0"
                  />
                </div>

                <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

                {/* Calendar Button */}
                <div 
                  onClick={() => setShowDatesModal(!showDatesModal)}
                  className="flex items-center px-4 py-3 cursor-pointer hover:bg-slate-100 rounded-full transition-colors h-12 w-full sm:w-auto relative"
                >
                  <Calendar className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                  <span className="text-slate-600 font-bold font-sans text-xs whitespace-nowrap truncate">
                    {selectedDays}
                  </span>
                  
                  {showDatesModal && (
                    <div className="absolute bottom-16 right-0 bg-white shadow-2xl p-4 rounded-xl border border-slate-100 text-left z-50 w-64 text-slate-700">
                      <p className="font-bold text-xs mb-2">Select Travel Date Range</p>
                      <input 
                        type="text" 
                        value={selectedDays}
                        onChange={(e) => setSelectedDays(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded text-xs text-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDatesModal(false); }}
                        className="mt-2 w-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 rounded"
                      >
                        Apply range
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  className="bg-slate-900 hover:bg-black text-white font-display font-extrabold text-sm sm:text-base px-8 h-12 rounded-xl sm:rounded-full active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Chips */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onFilterCategory(cat.id)}
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 sm:px-6 py-2 rounded-full font-sans text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95 group"
                  >
                    <Icon className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Featured Location Information section (Great Wall of China Spotlight matching Screen 6) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm">
            <img 
              alt="Great Wall of China winding across green mountains" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvU1TCeOWK-5qjqzXVYfRj_-6q0Ofrr5NbAZQiTxXkqXbxsgyZNMhHnRloToRdz7V3eV__Nq9Zljsvphs49rjr-y9uTVSdbYHnbrOA-AsO9H_nLdtByV2MvopPneHVL0Un4SNbaTc9hcfoBgqzeLgagiXCLSH_nPtxDZxBqx1IaBjwpu1DJsd1YLyRCDiOOvFTPRgwVubgvtyfMJOmsSkC-24ioQmEaczkgB1WfWrQ7uEV04O_VQXfk2i3mlrNreT5trNcX1mTS-ck" 
            />
            <div className="absolute top-4 left-4 bg-slate-900 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
              Featured Spot
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">SPOTLIGHT ARCHAEOLOGY</span>
              <span className="text-xs font-sans text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">Live Forecast Connected</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
              Explorer Destination: Great Wall of China
            </h3>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Walk where emperors trod centuries ago. This ancient structural masterpiece spans jagged mountain peaks, offering unparalleled panoramic vistas of rural China and a deep, immersive connection to imperial history.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-150">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Live Temp</span>
                <span className="text-xl font-bold font-mono text-slate-800">24°C</span>
                <span className="text-[10px] text-slate-500 font-bold block">Clear Skies</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Primary Lang</span>
                <span className="text-xl font-bold font-mono text-slate-800">Mandarin</span>
                <span className="text-[10px] text-slate-500 font-bold block">Beijing Accent</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Vibe Index</span>
                <span className="text-xl font-bold font-mono text-slate-800">Majestic</span>
                <span className="text-[10px] text-slate-500 font-bold block">Eternal History</span>
              </div>
            </div>

            <button 
              onClick={() => onSelectAttraction(featuredAttraction)}
              className="mt-4 self-start bg-slate-900 hover:bg-slate-800 text-white font-display font-extrabold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Examine Destination
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
