import { Sparkles, Moon, Sun, History } from 'lucide-react';

export default function Header({ theme, toggleTheme, toggleHistory, historyCount }) {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-yellow-500/10 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      <div className="flex items-center space-x-3 group cursor-pointer select-none">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Sparkles className="h-7 w-7 text-yellow-400 group-hover:rotate-12 transition-transform duration-300 relative" />
        </div>
        <span className="font-display font-bold text-xl md:text-2xl bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-400 bg-clip-text text-transparent hover:brightness-110 transition-all select-none gold-glow-text">
          AURA NUMEROLOGY
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* History Toggle Button */}
        <button
          onClick={toggleHistory}
          className="relative p-2.5 rounded-full border border-yellow-500/20 bg-purple-950/20 hover:bg-yellow-500/10 text-yellow-400/90 hover:text-yellow-400 hover:border-yellow-500/40 active:scale-95 transition-all select-none no-print"
          title="Prediction History"
        >
          <History className="h-5 w-5" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-purple-950 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-purple-900 select-none animate-bounce">
              {historyCount}
            </span>
          )}
        </button>

        {/* Theme Switcher Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full border border-yellow-500/20 bg-purple-950/20 hover:bg-yellow-500/10 text-yellow-400/90 hover:text-yellow-400 hover:border-yellow-500/40 active:scale-95 transition-all select-none no-print"
          title={theme === 'dark' ? "Activate Mystical Light Theme" : "Activate Cosmic Dark Theme"}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 animate-pulse" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}
