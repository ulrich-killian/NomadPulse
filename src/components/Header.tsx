import { useState } from 'react';
import { Compass, Home as HomeIcon, MapPin, Coins, Truck, User, Bell, Menu, X, Calendar, Check, Trash2, BellRing } from 'lucide-react';
import { InAppNotification } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogoutClick: () => void;
  userDisplayName?: string | null;
  userPhotoURL?: string | null;
  notifications: InAppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onLogoutClick, 
  userDisplayName, 
  userPhotoURL,
  notifications,
  onMarkNotificationRead,
  onClearNotifications
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Brand logo */}
        <div 
          onClick={() => {
            setActiveTab('home');
            setDropdownOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 shadow-inner" />
          </div>
          <div className="text-left">
            <h1 className="font-display text-lg sm:text-xl font-extrabold text-slate-800 leading-none">NomadPulse</h1>
            <p className="font-sans text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Global Portal</p>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: 'home', label: 'Home', icon: HomeIcon },
            { id: 'explore', label: 'Explore', icon: Compass },
            { id: 'tours', label: 'Tours', icon: MapPin },
            { id: 'trips', label: 'My Trips', icon: Calendar },
            { id: 'converter', label: 'Converter', icon: Coins },
            { id: 'shipments', label: 'Shipments', icon: Truck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-xs font-bold transition-all active:scale-95 ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-4 relative">
          
          {/* Bell Icon & Notification Area dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                dropdownOpen 
                  ? 'bg-slate-100 text-slate-800' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
              title="View in-app travel notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 text-[9px] font-sans font-extrabold text-white rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg ring-1 ring-black/5 z-55 overflow-hidden animate-fade-in text-left">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-blue-600" />
                    <span className="font-display font-black text-xs text-slate-800">Flight Price Alerts</span>
                  </div>
                  {notifications.length > 0 && (
                    <button 
                      onClick={onClearNotifications}
                      className="text-[10px] text-slate-400 hover:text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <p className="text-slate-400 text-xs italic">No active notifications.</p>
                      <p className="text-[10px] text-slate-400">Go to Destinations detail and choose a flight range (1-5 days) to request immediate tracking alarms.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 transition-colors relative flex justify-between gap-3 ${
                          notif.isRead ? 'bg-white opacity-80' : 'bg-blue-50/40 hover:bg-blue-50/60'
                        }`}
                      >
                        <div className="space-y-1 text-xs">
                          <p className={`font-bold text-slate-800 leading-tight ${notif.isRead ? 'font-medium' : 'font-extrabold'}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{notif.message}</p>
                          <span className="text-[9px] text-slate-400 block font-mono font-semibold">{notif.time}</span>
                        </div>
                        
                        {!notif.isRead && (
                          <button
                            onClick={() => onMarkNotificationRead(notif.id)}
                            className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center self-start shrink-0 hover:bg-blue-200 transition-colors cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-800 font-display">{userDisplayName || 'Nomad Traveler'}</span>
              <span className="text-[9px] text-slate-400 font-bold tracking-wider font-mono uppercase bg-slate-50 border border-slate-250 px-1.5 py-0.5 rounded">PRO OWNER</span>
            </div>
            
            <button 
              onClick={onLogoutClick}
              className="w-10 h-10 rounded-full overflow-hidden border border-slate-350 cursor-pointer active:scale-95 transition-transform shadow-sm hover:ring-2 hover:ring-slate-300"
              title="Click to logout"
            >
              <img 
                alt="Traveler avatar profile" 
                className="w-full h-full object-cover" 
                src={userPhotoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"}
              />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Navigation Banner */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50 shadow-sm">
        {[
          { id: 'home', label: 'Home', icon: HomeIcon },
          { id: 'explore', label: 'Explore', icon: Compass },
          { id: 'tours', label: 'Tours', icon: MapPin },
          { id: 'trips', label: 'My Trips', icon: Calendar },
          { id: 'converter', label: 'Converter', icon: Coins },
          { id: 'shipments', label: 'Shipments', icon: Truck },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setDropdownOpen(false);
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${
                isActive 
                  ? 'text-slate-900 font-bold scale-105' 
                  : 'text-slate-400 font-sans hover:text-slate-600'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
