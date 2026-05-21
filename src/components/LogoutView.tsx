import { LogOut, Globe, AlertCircle } from 'lucide-react';

interface LogoutViewProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutView({ onCancel, onConfirm }: LogoutViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-sm w-full transform transition-all p-6 text-center space-y-6">
        
        {/* Warning Icon Banner */}
        <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
          <LogOut className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-black text-xl text-slate-800">Sign Out Session</h3>
          <p className="text-slate-500 text-xs">
            Are you sure you want to log out of your NomadPulse account, <strong className="font-bold text-slate-700">Alex Graham</strong>?
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border rounded-xl text-left flex gap-2 items-center">
          <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-[10px] text-slate-400 leading-normal">
            Clearing your session will temporarily pause tracking updates on active shipments.
          </span>
        </div>

        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs uppercase py-3 rounded-xl transition-all active:scale-95"
          >
            Stay Signed In
          </button>
          
          <button 
            type="button"
            onClick={onConfirm}
            className="flex-grow bg-rose-600 hover:bg-rose-700 text-white font-display font-bold text-xs uppercase py-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            Sign Me Out
          </button>
        </div>

      </div>
    </div>
  );
}
