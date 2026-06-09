import { X, Trash2, Calendar, Phone, RefreshCw, User } from 'lucide-react';

export default function SavedPredictions({ isOpen, onClose, history, onLoadPrediction, onDeletePrediction, onClearAll }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md h-full glass-panel border-l border-yellow-500/20 shadow-2xl flex flex-col z-10 animate-fade-in-right transition-transform duration-300">
        {/* Header */}
        <div className="p-5 border-b border-yellow-500/10 flex justify-between items-center bg-purple-950/40">
          <h2 className="font-display font-bold text-xl text-yellow-100 flex items-center gap-2">
            Celestial Records
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-yellow-500/10 text-yellow-400 hover:text-yellow-300 active:scale-95 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {history.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full border border-dashed border-yellow-500/30 flex items-center justify-center text-yellow-500/40">
                <RefreshCw className="h-8 w-8 animate-spin-slow" />
              </div>
              <div>
                <p className="text-yellow-100/80 font-medium">No readings found</p>
                <p className="text-xs text-yellow-500/50 mt-1">Predictions you run will appear here for quick recall</p>
              </div>
            </div>
          ) : (
            history.map((record) => (
              <div 
                key={record.id}
                className="group relative rounded-xl border border-yellow-500/10 bg-purple-950/30 hover:border-yellow-500/30 hover:bg-purple-950/50 p-4 transition-all duration-300"
              >
                {/* Delete button */}
                <button
                  onClick={() => onDeletePrediction(record.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-rose-500/20 text-yellow-500/40 hover:text-rose-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300"
                  title="Erase Record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Record Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-100 font-semibold text-sm truncate pr-6">
                    <User className="h-3.5 w-3.5 text-yellow-500/70" />
                    {record.name}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-yellow-100/60 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-yellow-500/50" />
                      {record.dob}
                    </div>
                    {record.mobile && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="h-3.5 w-3.5 text-yellow-500/50" />
                        {record.mobile}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-yellow-500/5">
                    {/* Numbers breakdown */}
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-500/20 text-purple-300">
                        LPN: {record.lpn}
                      </span>
                      <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-500/20 text-purple-300">
                        NN: {record.nn}
                      </span>
                      {record.mnv && (
                        <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-500/20 text-purple-300">
                          MNV: {record.mnv}
                        </span>
                      )}
                    </div>

                    {/* Compatibility score if mobile */}
                    {record.score !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-yellow-500 font-bold">{record.score}%</span>
                        <button
                          onClick={() => onLoadPrediction(record)}
                          className="px-2 py-1 bg-yellow-500 hover:bg-yellow-400 text-purple-950 rounded text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
                        >
                          Recall
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onLoadPrediction(record)}
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-yellow-100 rounded text-xs font-bold transition-all border border-purple-500/40 active:scale-95"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-yellow-500/10 bg-purple-950/40 flex justify-end">
            <button
              onClick={onClearAll}
              className="px-4 py-2 border border-rose-500/20 hover:border-rose-500/50 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-bold rounded-lg transition-all active:scale-95"
            >
              Clear Records Database
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
