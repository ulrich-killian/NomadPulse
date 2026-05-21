import React, { useState } from 'react';
import { Search, Plus, Truck, FileText, Upload, CheckCircle2, AlertTriangle, Play, HelpCircle, ChevronRight, BarChart2 } from 'lucide-react';
import { Shipment } from '../types';

interface LogisticsViewProps {
  shipments: Shipment[];
  onAddShipment: (shipment: Shipment) => void;
}

export default function LogisticsView({ shipments, onAddShipment }: LogisticsViewProps) {
  const [searchTrackingId, setSearchTrackingId] = useState('');
  
  // Custom shipment builder states
  const [showAddForm, setShowAddForm] = useState(false);
  const [fromCode, setFromCode] = useState('Athens (ATH)');
  const [toCode, setToCode] = useState('Chicago (ORD)');
  const [newStatus, setNewStatus] = useState<'In Transit' | 'Pending'>('In Transit');

  // Document uploader states
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Search filter
  const filteredShipments = shipments.filter(ship => 
    ship.id.toLowerCase().includes(searchTrackingId.trim().toLowerCase()) ||
    ship.from.toLowerCase().includes(searchTrackingId.trim().toLowerCase()) ||
    ship.to.toLowerCase().includes(searchTrackingId.trim().toLowerCase())
  );

  // Auto shipment adder submit
  const handleAddNewShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = `NP-${Math.floor(1000 + Math.random() * 9000)}-S`;
    const shipmentToAdd: Shipment = {
      id: cleanId,
      from: fromCode,
      to: toCode,
      status: newStatus,
      statusDetails: newStatus === 'In Transit' ? 'Routing clearance granted. En route.' : 'Package registered in system scheduling.',
      progress: newStatus === 'In Transit' ? 15 : 0,
      eta: '4 days estimated'
    };
    onAddShipment(shipmentToAdd);
    setShowAddForm(false);
  };

  // Drag and Drop simulation
  const handleDragOver = (e: React.DragEvent, format: string) => {
    e.preventDefault();
    setDragOver(format);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, format: string) => {
    e.preventDefault();
    setDragOver(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileName = e.dataTransfer.files[0].name;
      setUploadedFiles(prev => ({ ...prev, [format]: fileName }));
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>, format: string) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setUploadedFiles(prev => ({ ...prev, [format]: fileName }));
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans w-full text-left">
      
      {/* View Header */}
      <section className="border-b border-slate-205 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-3xl text-slate-850 tracking-tight">Active Logistics Hub</h2>
          <p className="text-slate-505 font-medium text-sm">Secure, transparent transport, cargo declarations, and customs clearance trackers.</p>
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-900 hover:bg-slate-850 text-white font-display text-xs font-bold px-5 py-3 rounded-lg uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Declare Custom Shipment
        </button>
      </section>

      {/* Conditional custom shipment generator form popup */}
      {showAddForm && (
        <div className="bg-slate-50 border border-slate-205 rounded-xl p-6 text-left max-w-xl">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-4">Declare Cargo Package</h3>
          
          <form onSubmit={handleAddNewShipment} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Origin Airpoint</label>
              <input 
                type="text" 
                value={fromCode} 
                onChange={(e) => setFromCode(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-450"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Destination</label>
              <input 
                type="text" 
                value={toCode} 
                onChange={(e) => setToCode(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-450"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">State</label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-slate-450 cursor-pointer"
              >
                <option value="In Transit">In Transit</option>
                <option value="Pending">Pending Setup</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer"
              >
                Confirm Setup
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bento grid dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Search list, Shipments Tracking Details Card Blocks */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tracking Query input */}
          <div className="bg-white border text-xs border-slate-205 p-3.5 rounded-lg flex items-center gap-2 shadow-sm text-left">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logistics tracking ID (e.g., NP-7829-X)..."
              value={searchTrackingId}
              onChange={(e) => setSearchTrackingId(e.target.value)}
              className="w-full border-none focus:outline-none placeholder:text-slate-400 font-sans font-medium text-xs focus:ring-0 text-slate-800"
            />
          </div>

          <div className="space-y-4 text-left">
            {filteredShipments.length > 0 ? (
              filteredShipments.map((ship) => {
                const isCustomsAlert = ship.status === 'Customs Delay';
                const isDelivered = ship.status === 'Delivered';
                return (
                  <div 
                    key={ship.id}
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 group hover:border-slate-350 transition-colors"
                  >
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">REGISTRATION KEY</span>
                        <h4 className="font-mono text-base font-black text-slate-800 group-hover:text-slate-900 transition-colors">{ship.id}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-sans">ETA: <strong>{ship.eta}</strong></span>
                        <span className={`text-[10px] font-sans font-bold px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 border ${
                          isDelivered 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : isCustomsAlert
                              ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {isCustomsAlert && <AlertTriangle className="w-3 h-3" />}
                          {ship.status}
                        </span>
                      </div>
                    </div>

                    {/* From / To Flight Path Representation */}
                    <div className="bg-slate-50 border border-slate-200 p-3 px-4 rounded-lg flex items-center justify-between text-xs font-sans font-bold text-slate-600">
                      <div>
                        <span className="text-[8px] text-slate-400 block font-sans">ORIGIN PLACE</span>
                        <span className="text-slate-800 font-semibold">{ship.from}</span>
                      </div>
                      
                      <div className="h-[1px] bg-dashed flex-grow mx-4 relative border-t-2 border-slate-200 border-dashed">
                        <Truck className="w-4 h-4 text-slate-400 absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 block font-sans">DELIVERY TARGET</span>
                        <span className="text-slate-800 font-semibold">{ship.to}</span>
                      </div>
                    </div>

                    {/* Progress slider bar matching Section 3 visual levels */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-[10px] font-semibold text-slate-400">
                        <span>Cleared sorting</span>
                        <span>{ship.progress}% Route covered</span>
                        <span>Delivered</span>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCustomsAlert 
                              ? 'bg-amber-500' 
                              : isDelivered 
                                ? 'bg-emerald-500' 
                                : 'bg-slate-900'
                          }`}
                          style={{ width: `${ship.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status commentary text notes */}
                    <p className="font-sans text-[11px] text-slate-500 leading-normal bg-slate-50/50 p-2 border border-slate-200 rounded-lg">
                      <strong>Status Details:</strong> {ship.statusDetails}
                    </p>

                    {/* Warning overlay button if Customs Delayed */}
                    {isCustomsAlert && (
                      <div className="bg-amber-50/40 border border-amber-200 rounded-lg p-3 flex justify-between items-center text-xs text-amber-800 font-bold gap-2">
                        <span>Commercial Invoice upload required for Munich custom offices.</span>
                        <span className="text-[10px] bg-amber-500 text-slate-900 px-2 py-1 rounded">Action Required</span>
                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-8">
                <p className="text-slate-400 font-sans">No declared cargo routes match your search inputs.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Document lockers uploads, timeline performance lists */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Document Locker Cards Section */}
          <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-black text-slate-800 text-base flex items-center gap-2 border-b border-slate-150 pb-2">
              <FileText className="w-5 h-5 text-slate-500" /> Export Document Lockers
            </h3>
            
            <p className="text-slate-405 font-sans text-xs">
              Load customs clearance templates onto active escrow lockers before container dispatch deadlines.
            </p>

            {/* Structured lockers list */}
            <div className="space-y-3 pt-2">
              {[
                { format: 'Commercial Invoice', requiredFor: 'NP-4412-M' },
                { format: 'Certificate of Origin', requiredFor: 'General Clearance' },
                { format: 'Packing Checklist', requiredFor: 'General Clearance' },
              ].map((doc) => {
                const wasUploaded = !!uploadedFiles[doc.format];
                return (
                  <div 
                    key={doc.format}
                    onDragOver={(e) => handleDragOver(e, doc.format)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, doc.format)}
                    className={`p-4 border rounded-xl transition-all relative ${
                      wasUploaded 
                        ? 'bg-emerald-50/30 border-emerald-200 text-emerald-800' 
                        : dragOver === doc.format
                          ? 'bg-slate-100 border-slate-400 text-slate-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">LOCKER TARGET</span>
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          {doc.format} {wasUploaded && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">Restricts: <strong className="text-slate-500 font-sans">{doc.requiredFor}</strong></span>
                      </div>

                      {/* Manual Upload trigger button */}
                      <div className="relative">
                        <label className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold p-2 px-3 rounded-lg text-xs cursor-pointer shadow-sm active:scale-95 transition-all flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Upload</span>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,.jpg"
                            onChange={(e) => handleManualUpload(e, doc.format)}
                            className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-auto cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Drag over state hint or upload feedback status annotation */}
                    {wasUploaded ? (
                      <p className="text-[9px] font-mono font-bold text-emerald-600 mt-2 bg-emerald-50 p-1 border border-emerald-100 rounded">
                        FILE LOADED: {uploadedFiles[doc.format]}
                      </p>
                    ) : (
                      <p className="text-[9px] text-slate-400 font-normal mt-2 border-t border-slate-200 pt-2 border-dashed">
                        Drag & drop PDF invoice sheets here to store permanently.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Logistics Route Metrics Card Component */}
          <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-black text-slate-800 text-base flex items-center gap-2 border-b border-slate-150 pb-2">
              <BarChart2 className="w-5 h-5 text-slate-500" /> Transit Lead-times KPI
            </h3>
            
            <div className="space-y-3 pt-2 text-xs font-sans font-bold text-slate-600">
              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-400 font-mono font-bold">
                  <span>EU-APAC Transit Speed</span>
                  <span className="text-slate-905">Fastest (2.2 days)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-full rounded" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-400 font-mono font-bold">
                  <span>Transatlantic Customs Clearance</span>
                  <span className="text-amber-600">Pending Delay</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
