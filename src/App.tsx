import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import ToursView from './components/ToursView';
import ConverterView from './components/ConverterView';
import DestinationDetailView from './components/DestinationDetailView';
import LogisticsView from './components/LogisticsView';
import LogoutView from './components/LogoutView';
import TripsView from './components/TripsView';
import { ATTRACTIONS, TOURS, INITIAL_SHIPMENTS } from './data';
import { Shipment, Attraction, InAppNotification } from './types';
import { Compass, Users, MapPin, Sparkles, LogIn, Plane, Heart, Loader2, Compass as CompassIcon, ShieldAlert } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['santorini']);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);


  const [notifications, setNotifications] = useState<InAppNotification[]>([
    {
      id: 'notif-welcome',
      title: ' Price Tracking Gateway Active',
      message: 'Welcome back Nomad! Select an explore destination from Sights to monitor flight ranges across 1 to 5 days, see instant status updates, and obtain bookings easily.',
      time: 'May 21, 2026',
      isRead: false,
      type: 'info'
    }
  ]);

  const handleAddNotification = (title: string, message: string, type: 'info' | 'price-drop' | 'flight' | 'alert') => {
    const freshNotif: InAppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title,
      message,
      time: new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) + ' today',
      isRead: false,
      type
    };
    setNotifications(prev => [freshNotif, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        setIsLoggedIn(true);
        setAuthError(null);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);


  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Popup Sign-in declined:", err);
      if (err.code === "auth/popup-blocked") {
        setAuthError("Sign-in pop-up was blocked. Please enable pop-ups for this port or open the applet in a new tab.");
      } else {
        setAuthError("Failed to initialize Google Authentication. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };


  const handleAddShipment = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev]);
  };


  const handleSearchFromHome = (query: string) => {
    setActiveTab('explore');
    setSelectedAttraction(null);
  };

  const handleFilterCategoryFromHome = (category: string) => {
    setActiveTab('explore');
    setSelectedAttraction(null);
  };


  const handleSelectAttraction = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setActiveTab('explore-detail');
  };


  const handleLogoutConfirm = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setIsLogoutOpen(false);
      setActiveTab('home');
      setSelectedAttraction(null);
    } catch (err) {
      console.error("Log out failure:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
          <p className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest leading-none">Establishing Security Handshakes...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-slate-800">
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm max-w-sm w-full border border-slate-200 relative z-10 flex flex-col p-8 gap-8">
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white mx-auto shadow-sm">
              <CompassIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-slate-900 tracking-tight">NomadPulse</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Global Navigation & Logistics Portal</p>
            </div>
          </div>

          <p className="text-slate-500 text-xs text-center leading-relaxed">
            Welcome to the digital nomad&apos;s most reliable suite. Access live weather indexes, real-time currency converters, structural checklists, custom documents, and flight arrival boards.
          </p>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px] flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Authenticate with Google
            </button>
          </div>

          <div className="text-center border-t border-slate-200 pt-6">
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase font-mono">SECURE IDENTITY GATEWAYS V3.2</span>
          </div>

        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-24 md:pb-0 font-sans">
      
    
      <Header 
        activeTab={activeTab === 'explore-detail' ? 'explore' : activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedAttraction(null);
        }} 
        onLogoutClick={() => setIsLogoutOpen(true)}
        userDisplayName={user?.displayName}
        userPhotoURL={user?.photoURL}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
      />

    
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full animate-fade-in">
        
        {activeTab === 'home' && (
          <HomeView 
            onSearch={handleSearchFromHome}
            onFilterCategory={handleFilterCategoryFromHome}
            featuredAttraction={ATTRACTIONS.find(a => a.id === 'great-wall') || ATTRACTIONS[0]}
            onSelectAttraction={handleSelectAttraction}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView 
            attractions={ATTRACTIONS}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelect={handleSelectAttraction}
          />
        )}

        {activeTab === 'explore-detail' && selectedAttraction && (
          <DestinationDetailView 
            attraction={selectedAttraction}
            onBack={() => setActiveTab('explore')}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onAddNotification={handleAddNotification}
          />
        )}

        {activeTab === 'tours' && (
          <ToursView 
            tours={TOURS}
          />
        )}

        {activeTab === 'trips' && user && (
          <TripsView userId={user.uid} />
        )}

        {activeTab === 'converter' && (
          <ConverterView />
        )}

        {activeTab === 'shipments' && (
          <LogisticsView 
            shipments={shipments}
            onAddShipment={handleAddShipment}
          />
        )}

      </main>

      
      {isLogoutOpen && (
        <LogoutView 
          onCancel={() => setIsLogoutOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}

    </div>
  );
}
