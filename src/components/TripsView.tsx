import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../firebase";
import { Trip } from "../types";
import { Calendar, MapPin, Plus, Trash2, Edit3, Loader2, Compass, Check, AlertCircle, X, Navigation } from "lucide-react";
import { ATTRACTIONS } from "../data";

interface TripsViewProps {
  userId: string;
}

export default function TripsView({ userId }: TripsViewProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Destinations mapping
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [customDestinationInput, setCustomDestinationInput] = useState("");

  // Retrieve existing trips for active authenticated user
  const fetchTrips = async () => {
    setLoading(true);
    setErrorStatus(null);
    const tripsPath = "trips";
    try {
      const q = query(
        collection(db, tripsPath),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const items: Trip[] = [];
      snapshot.forEach((snapshotDoc) => {
        const data = snapshotDoc.data();
        items.push({
          id: snapshotDoc.id,
          userId: data.userId,
          name: data.name || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          destinations: data.destinations || [],
        });
      });
      // Sort trips by start date descending
      items.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setTrips(items);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, tripsPath);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [userId]);

  const togglePresetDestination = (destName: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destName)
        ? prev.filter(d => d !== destName)
        : [...prev, destName]
    );
  };

  const handleAddCustomDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDestinationInput.trim()) {
      const cleanInput = customDestinationInput.trim();
      if (!selectedDestinations.includes(cleanInput)) {
        setSelectedDestinations(prev => [...prev, cleanInput]);
      }
      setCustomDestinationInput("");
    }
  };

  const removeDestination = (destName: string) => {
    setSelectedDestinations(prev => prev.filter(d => d !== destName));
  };

  const resetForm = () => {
    setTripName("");
    setStartDate("");
    setEndDate("");
    setSelectedDestinations([]);
    setCustomDestinationInput("");
    setEditingTripId(null);
    setIsFormOpen(false);
  };

  // Create or Update Firebase Document
  const handleSubmitTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName.trim() || !startDate || !endDate || selectedDestinations.length === 0) {
      setErrorStatus("Please provide a name, dates, and at least one destination.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorStatus("The start date cannot fall after the end date.");
      return;
    }

    setErrorStatus(null);
    const tripsPath = "trips";

    try {
      if (editingTripId) {
        // Update Document path
        const docRef = doc(db, tripsPath, editingTripId);
        const updatePayload = {
          name: tripName.trim(),
          startDate,
          endDate,
          destinations: selectedDestinations,
        };
        await updateDoc(docRef, updatePayload);
      } else {
        // Create Document path
        const randomId = doc(collection(db, tripsPath)).id;
        const createPayload = {
          id: randomId,
          userId,
          name: tripName.trim(),
          startDate,
          endDate,
          destinations: selectedDestinations,
        };
        await addDoc(collection(db, tripsPath), createPayload);
      }
      resetForm();
      await fetchTrips();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, tripsPath);
    }
  };

  // Load selected trip details for edit mode
  const handleEditClick = (trip: Trip) => {
    setEditingTripId(trip.id);
    setTripName(trip.name);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setSelectedDestinations(trip.destinations);
    setIsFormOpen(true);
  };

  // Delete document
  const handleDeleteClick = async (tripId: string) => {
    if (!confirm("Are you sure you want to permanently delete this travel itinerary?")) {
      return;
    }
    const tripsPath = "trips";
    try {
      const docRef = doc(db, tripsPath, tripId);
      await deleteDoc(docRef);
      await fetchTrips();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, tripsPath);
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans w-full text-slate-800">
      
      {/* Page Header */}
      <section className="border-b border-slate-200 pb-6 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-700 font-mono uppercase tracking-widest bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
            My Itineraries
          </span>
          <h2 className="font-display font-black text-3xl text-slate-900 tracking-tight mt-2">
            My Trips
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Configure, manage, and visualise your personal journeys, stopovers, and travel timelines.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="self-start sm:self-center bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Plan A Journey
          </button>
        )}
      </section>

      {/* Main Dynamic View Block */}
      {isFormOpen ? (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-left max-w-4xl mx-auto w-full shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-display font-display font-extrabold text-lg text-slate-900">
              {editingTripId ? "Modify Travel Itinerary" : "Plan a New Journey"}
            </h3>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorStatus && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs mb-6 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="font-medium">{errorStatus}</p>
            </div>
          )}

          <form onSubmit={handleSubmitTrip} className="space-y-6">
            {/* Trip General Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
                  Itinerary Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Euro Tour"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full p-3 text-xs font-sans font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 text-xs font-sans font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 text-xs font-sans font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Selected Destinations Output */}
            <div className="border border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50">
              <span className="text-[10px] uppercase font-extrabold text-slate-500 block mb-2 tracking-wider">
                Selected Destinations ({selectedDestinations.length})
              </span>
              {selectedDestinations.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No destinations selected yet. Please pick from below or add custom cities.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedDestinations.map((dest) => (
                    <span
                      key={dest}
                      className="bg-slate-900 text-white text-[11px] font-sans font-bold pl-3 pr-1 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-900 hover:bg-slate-800"
                    >
                      {dest}
                      <button
                        type="button"
                        onClick={() => removeDestination(dest)}
                        className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center text-[10px] leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Destination Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Add Custom Destination / City
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Kyoto, Japan"
                  value={customDestinationInput}
                  onChange={(e) => setCustomDestinationInput(e.target.value)}
                  className="flex-grow p-3 text-xs font-sans font-medium border border-slate-200 rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={(e) => handleAddCustomDestination(e)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Quick Add
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Quick-Add Famous Preset Destinations
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ATTRACTIONS.map((attr) => {
                  const isSelected = selectedDestinations.includes(attr.name);
                  return (
                    <button
                      key={attr.id}
                      type="button"
                      onClick={() => togglePresetDestination(attr.name)}
                      className={`p-3 text-left border rounded-xl flex items-center gap-2 justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold text-[11px] block truncate">{attr.name}</span>
                        <span className="text-[9px] text-slate-400 block truncate">{attr.location}</span>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex-grow md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {editingTripId ? "Confirm Modifications" : "Save Itinerary"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-grow md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-600 font-display font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : (
        /* Trips Feed */
        <section className="space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm font-medium text-slate-500">Retrieving travel logs from Cloud Storage...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl bg-white p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-black text-slate-850 text-base">No Trips Planned Yet</h4>
                <p className="text-slate-500 text-xs">Begin curating your custom globetrot flights, stopover attractions, and dynamic hotels.</p>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold py-2.5 px-6 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Assemble First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {trips.map((trip) => (
                <article
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between gap-6 hover:shadow-sm transition-all relative group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-display font-black text-slate-900 text-md leading-tight group-hover:text-blue-600 transition-colors">
                        {trip.name}
                      </h4>
                      <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleEditClick(trip)}
                          title="Edit itinerary"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors border-r border-slate-205 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trip.id)}
                          title="Delete itinerary"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-medium text-slate-500">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          {" — "}
                          {new Date(trip.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest font-mono">
                        ITINERARY DESTINATIONS
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {trip.destinations.map((dest) => (
                          <span
                            key={dest}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-sans font-bold px-2 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"
                          >
                            <MapPin className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle Footer indicator */}
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono border-t border-slate-50 pt-3 mt-auto">
                    ACTIVE LOGGED JOURNEY
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
