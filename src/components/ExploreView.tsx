import { useState } from 'react';
import { Star, Heart, Search, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { Attraction } from '../types';

interface ExploreViewProps {
  attractions: Attraction[];
  onSelect: (attraction: Attraction) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function ExploreView({ attractions, onSelect, favorites, onToggleFavorite }: ExploreViewProps) {
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  const subCategories = ['All', 'Cultural', 'Adventure', 'Gastronomy'];

  const filteredAttractions = attractions.filter(attr => {
    // Sub-category match
    const categoryMatch = activeSubCategory === 'All' 
      ? true 
      : activeSubCategory === 'Cultural'
        ? attr.category === 'History' || attr.category === 'City'
        : activeSubCategory === 'Adventure'
          ? attr.category === 'Mountain' || attr.category === 'Beach'
          : attr.category === 'Gastronomy' // Custom tag or category matching
            ? attr.tags.includes('Gastronomy') || attr.tags.includes('Local') || attr.id === 'amalfi'
            : true;

    // Search query match
    const queryMatch = attr.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                       attr.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
                       attr.category.toLowerCase().includes(searchFilter.toLowerCase());

    return categoryMatch && queryMatch;
  });

  return (
    <div className="flex flex-col gap-8 font-sans w-full">
      
      {/* Header and Filter Top Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-display font-black text-3xl text-slate-850 tracking-tight">Explore Attractions</h2>
          <p className="text-slate-500 font-medium text-sm">Uncover the most breathtaking sights across the Mediterranean.</p>
        </div>

        {/* Categories Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar items-center">
          {subCategories.map((sub) => {
            const isActive = activeSubCategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub)}
                className={`px-5 py-2.5 rounded-lg font-sans text-xs font-bold whitespace-nowrap transition-all active:scale-95 border ${
                  isActive 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sub === 'All' ? 'All Sights' : sub}
              </button>
            );
          })}
          
          {/* Interactive sliders buttons */}
          <button className="bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 p-2.5 rounded-lg flex items-center justify-center transition-all active:scale-95">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Internal Search bar for granular controls */}
      <div className="w-full max-w-md relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input 
          type="text" 
          placeholder="Filter attractions by name or region..." 
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs font-sans font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-400 focus:outline-none transition-shadow"
        />
      </div>

      {/* Attractions Grid matching Section 3 */}
      {filteredAttractions.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAttractions.map((attr) => {
            const isFavorite = favorites.includes(attr.id);
            return (
              <article 
                key={attr.id}
                onClick={() => onSelect(attr)}
                className="bg-white rounded-xl overflow-hidden cursor-pointer border border-slate-200 shadow-sm hover:border-slate-350 transition-all duration-200 flex flex-col group relative"
              >
                {/* Image layout container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  
                  {/* Floating Like Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(attr.id);
                    }}
                    className="absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm text-rose-500 hover:scale-110 active:scale-90 transition-all z-10"
                  >
                    <Heart className="w-4 h-4" fill={isFavorite ? '#f43f5e' : 'none'} />
                  </button>

                  <img 
                    alt={attr.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={attr.image}
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-slate-100 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" fill="#f59e0b" />
                    <span className="font-sans text-slate-800 font-extrabold text-[11px]">{attr.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Content wrapper */}
                <div className="p-5 flex flex-col flex-grow gap-3">
                  <div>
                    <h3 className="font-display font-black text-slate-850 text-base leading-tight group-hover:text-slate-900 transition-colors tracking-tight line-clamp-1">
                      {attr.name}
                    </h3>
                    <p className="text-slate-400 font-sand text-[10px] font-bold uppercase tracking-wider mt-0.5">{attr.location}</p>
                  </div>

                  <p className="font-mono text-slate-800 text-xs font-bold uppercase tracking-wider">
                    PRICING REFERENCE: <span className="text-slate-600 underline decoration-slate-200">{attr.price}</span>
                  </p>

                  <p className="text-slate-500 font-sans text-xs leading-relaxed line-clamp-2">
                    {attr.description}
                  </p>

                  {/* Category Tags */}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {attr.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag}
                        className="bg-slate-50 border border-slate-200 text-slate-500 font-sans text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto flex items-center text-[10px] font-bold text-slate-800 group-hover:translate-x-0.5 transition-transform">
                      View details <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>

              </article>
            );
          })}
        </section>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-slate-500 font-sans font-bold">No attractions match your current selection.</p>
          <button 
            onClick={() => { setSearchFilter(''); setActiveSubCategory('All'); }}
            className="mt-3 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More Trigger Button */}
      {filteredAttractions.length > 0 && (
        <div className="flex justify-center pt-4">
          <button className="bg-slate-900 text-white border border-slate-900 font-display font-bold text-xs tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer">
            Load More Sights
          </button>
        </div>
      )}

    </div>
  );
}
