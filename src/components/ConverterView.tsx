import React, { useState, useEffect } from 'react';
import { ArrowUpDown, AlertCircle, Sparkles, Send, Coins, Globe, Key, CheckCircle, Smartphone, RefreshCw, Radio } from 'lucide-react';
import { CURRENCIES } from '../data';
import { getExchangeRates } from '../api';

export default function ConverterView() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1000');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [recipientName, setRecipientName] = useState('Elena Pappas');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  async function loadRates() {
    setLoading(true);
    try {
      // Direct call using live Currency API Key from environmental key or default fallback
      const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY || "09b78b161649b45a934366bb";
      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.result === 'success' && data.conversion_rates) {
          setExchangeRates(data.conversion_rates);
          setIsLive(true);
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setLoading(false);
          return;
        }
      }
      throw new Error('API query fell back');
    } catch (e) {
      // Soft backup values support in event of cors limits or transient network flags
      const rates = await getExchangeRates(fromCurrency);
      setExchangeRates(rates);
      setIsLive(false);
      setLastUpdated('Estimated (static backup)');
    } finally {
      setLoading(false);
    }
  }

  // Load exchange rates whenever base currency changes
  useEffect(() => {
    loadRates();
  }, [fromCurrency]);

  const fromSymbol = CURRENCIES.find(c => c.code === fromCurrency)?.symbol || '$';
  const toSymbol = CURRENCIES.find(c => c.code === toCurrency)?.symbol || '€';
  const fromFlag = CURRENCIES.find(c => c.code === fromCurrency)?.flag || '🇺🇸';
  const toFlag = CURRENCIES.find(c => c.code === toCurrency)?.flag || '🇪🇺';

  const rate = exchangeRates[toCurrency] || 0.92;
  const result = (Number(amount || '0') * rate).toFixed(2);

  // Keyboard press helper
  const handleKeyPress = (val: string) => {
    if (val === '✕') {
      // Backspace
      setAmount(prev => prev.length <= 1 ? '' : prev.slice(0, -1));
    } else if (val === '.') {
      if (!amount.includes('.')) {
        setAmount(prev => prev === '' ? '0.' : prev + '.');
      }
    } else {
      // Numerical
      setAmount(prev => {
        if (prev === '0') return val;
        return prev + val;
      });
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSendFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferConfirmed(true);
  };

  return (
    <div className="flex flex-col gap-8 font-sans w-full">
      
      {/* View Header */}
      <section className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-3xl text-slate-800 tracking-tight">Nomad Liquidity Hub</h2>
          <p className="text-slate-500 font-medium text-sm">Real-time exchange conversion parameters utilizing premium live indexation feeds.</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 px-4 flex items-center gap-2 max-w-sm">
          <Globe className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-[11px] text-emerald-800 font-bold leading-normal">
            Your location resolved to <span className="underline">Athens, Greece</span>. Default currency locked to <strong className="font-extrabold">EUR</strong>.
          </p>
        </div>
      </section>

      {/* Main double column container layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: Live rate index information card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-700 uppercase bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                Interbank Index Rate
              </span>
              
              {/* Live Connection Badges */}
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono font-black">
                {isLive ? (
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <Radio className="w-3 h-3 animate-pulse" /> Live Feed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" /> Cached Rate
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-150 pb-2 mt-4">
              <h3 className="font-display font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                <Coins className="w-5 h-5 text-slate-600" /> Conversions Status
              </h3>
              
              {/* Interactive manual refresh trigger */}
              <button
                onClick={loadRates}
                disabled={loading}
                className="p-1 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
                title="Trigger immediate live rate query"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Sync
              </button>
            </div>

            <div className="my-6 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">INDEX COMPARATIVE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-display font-black text-slate-800">1 {fromCurrency} =</span>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
                  {loading ? '...' : rate.toFixed(4)} {toCurrency}
                </span>
              </div>
              
              {/* Last synchronized timestamp report */}
              {lastUpdated && (
                <span className="text-[9px] text-slate-400 block font-mono font-semibold pt-1">
                  Synced: {lastUpdated}
                </span>
              )}
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              Indices update in real time from international clearing broker reserves. Live interbank rates contain a small tourist spread of +0.12%.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-150 mt-6 text-xs font-sans font-bold">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Clearing Time</span>
                <span className="text-slate-700">Instant Routing</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Wire Cost</span>
                <span className="text-emerald-700">Free Account</span>
              </div>
            </div>
          </div>

          {/* Prompt/Guide */}
          <div className="bg-slate-100 border border-slate-200 text-slate-800 rounded-xl p-6 shadow-sm space-y-3">
            <h4 className="font-display font-extrabold text-sm flex items-center gap-1.5 text-slate-900 uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4 text-slate-650" /> Safe Transfer Guarantees
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              NomadPulse utilizes premium escrow routing. Our deposits are protected up to €100,000 under the European Deposit Protection Agreement.
            </p>
          </div>
        </div>

        {/* Right Column: Calculator panel with tactile touch numeric keyboard */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="space-y-6">
            
            {/* INPUT CURRENCY SELECTOR CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center group focus-within:ring-1 focus-within:ring-slate-400">
              <div className="space-y-1 flex-grow">
                <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">FROM CURRENCY</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-display font-black text-slate-800">{fromSymbol}</span>
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent border-none text-xl font-display font-black text-slate-800 focus:outline-none focus:ring-0 p-0 w-full"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Selection Dropdown */}
              <div className="flex items-center gap-2 font-display bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-lg">{fromFlag}</span>
                <select 
                  value={fromCurrency} 
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="bg-transparent font-bold border-none text-xs focus:ring-0 cursor-pointer text-slate-700 outline-none"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SWAP ROW */}
            <div className="flex justify-center -my-3 relative z-10">
              <button 
                onClick={swapCurrencies}
                className="bg-slate-900 hover:bg-slate-850 text-white p-3 rounded-lg shadow-sm active:scale-90 active:rotate-180 transition-all cursor-pointer"
                title="Swap currencies"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* OUTPUT CURRENCY SELECTOR CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">TO CURRENCY (ESTIMATED)</label>
                <p className="text-2xl font-mono font-black text-slate-900">
                  {toSymbol} {loading ? '...' : result}
                </p>
              </div>

              {/* Selection Dropdown */}
              <div className="flex items-center gap-2 font-display bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-lg">{toFlag}</span>
                <select 
                  value={toCurrency} 
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="bg-transparent font-bold border-none text-xs focus:ring-0 cursor-pointer text-slate-700 outline-none"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tactile Touch Numerical Keyboard matching design image */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-150">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '✕'].map((key) => {
                const isDelete = key === '✕';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyPress(key)}
                    className={`h-12 w-full flex items-center justify-center font-display font-bold text-base rounded-lg transition-all active:scale-95 cursor-pointer ${
                      isDelete 
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100/85 border border-rose-200' 
                        : 'bg-slate-50 text-slate-800 hover:bg-slate-100/80 border border-slate-200'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Send Funds Button triggers modal */}
            <button 
              onClick={() => setIsSendModalOpen(true)}
              disabled={Number(amount || '0') <= 0}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-display font-black text-xs tracking-wider uppercase py-4 rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Dispatch Escrow Transfer ({fromSymbol}{amount})
            </button>

          </div>
        </div>

      </section>

      {/* DISPATCH SEND ESCROW TRANSFER MODAL */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 max-w-sm w-full transform transition-all relative">
            
            {/* Close button X */}
            <button 
              onClick={() => { setIsSendModalOpen(false); setTransferConfirmed(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 border border-slate-200 rounded-lg text-lg leading-none cursor-pointer"
            >
              ×
            </button>

            {transferConfirmed ? (
              <div className="p-8 text-center flex flex-col items-center gap-4">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
                <h3 className="font-display font-black text-xl text-slate-900">Transfer Success</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Your funds package has been validated by Swiss smart contract filters. Handing over to local clearing agents.
                </p>

                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-left font-sans space-y-2 text-xs">
                  <p className="flex justify-between">
                    <span className="text-slate-400 font-bold font-mono text-[9px]">RECIPIENT IP</span>
                    <span className="font-bold text-slate-800">{recipientName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400 font-bold font-mono text-[9px]">SEND SUM</span>
                    <span className="font-bold text-slate-800">{fromSymbol}{amount} {fromCurrency}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400 font-bold font-mono text-[9px]">RECEIVER SUM</span>
                    <span className="font-bold text-slate-950 font-mono">{toSymbol}{result} {toCurrency}</span>
                  </p>
                  <p className="flex justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                    <span>ESCROW BRIDGE ID</span>
                    <span className="font-mono text-[9px]">TXN-88219-G897</span>
                  </p>
                </div>

                <button 
                  onClick={() => { setIsSendModalOpen(false); setTransferConfirmed(false); }}
                  className="mt-4 w-full bg-slate-900 text-white font-display font-bold text-xs uppercase py-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Conclude Bridge View
                </button>
              </div>
            ) : (
              <div className="p-6 pt-8 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-slate-800" />
                  <h3 className="font-display font-black text-lg text-slate-900">Swift Liquidity Wire</h3>
                </div>
                <p className="text-slate-500 text-xs mb-6Leading-relaxed">Authorize an instant broker bridge routing using local bank interfaces.</p>

                <form onSubmit={handleSendFundsSubmit} className="space-y-4">
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recipient Traveler Name</label>
                    <input 
                      type="text" 
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full p-2.5 text-xs font-sans font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2 text-xs">
                    <p className="flex justify-between">
                      <span className="text-slate-500">You Authorize Sending:</span>
                      <span className="font-bold text-slate-800">{fromSymbol}{amount} {fromCurrency}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Routing Index Rate:</span>
                      <span className="font-bold text-slate-800">1 {fromCurrency} = {rate} {toCurrency}</span>
                    </p>
                    <p className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                      <span>ELENA RECEIVES:</span>
                      <span className="font-mono">{toSymbol}{result} {toCurrency}</span>
                    </p>
                  </div>

                  <div className="p-2 border border-slate-200 rounded-lg flex items-center gap-2 bg-slate-50">
                    <Key className="w-4 h-4 text-slate-500" />
                    <span className="text-[9px] text-slate-400 font-mono font-bold">ENCRYPTED GATEWAY V3.2</span>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-lg active:scale-95 transition-all font-sans cursor-pointer"
                  >
                    Confirm Escrow Push
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
