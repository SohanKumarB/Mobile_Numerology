import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Calendar, 
  User, 
  Phone, 
  AlertCircle, 
  Check, 
  Copy, 
  Download, 
  Share2, 
  RotateCcw, 
  Heart, 
  Shield, 
  Zap, 
  Star, 
  Info,
  TrendingUp
} from 'lucide-react';

import Header from './components/Header';
import SavedPredictions from './components/SavedPredictions';
import { 
  calculateLifePath, 
  calculateNameNumber, 
  calculateMobileValue, 
  calculateCompatibility, 
  generateRecommendedNumbers,
  NUMBER_INFO 
} from './utils/numerology';

export default function App() {
  // Theme Management
  const [theme, setTheme] = useState('dark');

  // Page Navigation State
  // 'home' | 'form' | 'loading' | 'results'
  const [page, setPage] = useState('home');

  // Input states
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');

  // Validations & Errors
  const [errors, setErrors] = useState({});

  // Calculation Results
  const [lpn, setLpn] = useState(1);
  const [nn, setNn] = useState(1);
  const [mnv, setMnv] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Saved Predictions History
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Loading Messages cycling state
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const loadingMessages = [
    "Aligning with your date of birth planetary frequencies...",
    "Transcribing name letters to Chaldean values...",
    "Reducing values to key single digits (1-9)...",
    "Measuring compatibility of existing mobile number...",
    "Generating resonant recommended phone combinations...",
    "Consulting the astrological houses for your forecast..."
  ];

  // Clipboard feedbacks
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedState, setCopiedState] = useState(false);

  // Initialize and load LocalStorage predictions
  useEffect(() => {
    const saved = localStorage.getItem('auramobile_predictions');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse prediction records:", e);
      }
    }
  }, []);

  // Theme Sync on body class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // Loading Text Interval
  useEffect(() => {
    let interval;
    if (page === 'loading') {
      interval = setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % loadingMessages.length);
      }, 500);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [page]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleStartPrediction = () => {
    setPage('form');
  };

  const handleBackToHome = () => {
    setPage('home');
    setName('');
    setDob('');
    setMobile('');
    setErrors({});
  };

  // Form Field Validations
  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (!name.trim()) {
      newErrors.name = "Full Name is highly required.";
    } else if (/[0-9]/.test(name)) {
      newErrors.name = "Name must only contain alphabetic letters.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name should be at least 2 characters long.";
    }

    // Date of Birth Validation
    if (!dob) {
      newErrors.dob = "Date of Birth is highly required.";
    } else {
      const selectedDate = new Date(dob);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        newErrors.dob = "Date of Birth cannot be in the future.";
      }
    }

    // Mobile Number (Optional Validation)
    if (mobile.trim()) {
      const cleanMobile = mobile.replace(/[^0-9]/g, "");
      if (cleanMobile.length !== 10) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPage('loading');

    // Simulate astronomical calculations time (2.5 seconds)
    setTimeout(() => {
      // 1. Math core
      const calculatedLpn = calculateLifePath(dob);
      const calculatedNn = calculateNameNumber(name);
      
      let calculatedMnv = null;
      let calculatedComp = null;
      
      if (mobile.trim()) {
        const cleanMobile = mobile.replace(/[^0-9]/g, "");
        calculatedMnv = calculateMobileValue(cleanMobile);
        calculatedComp = calculateCompatibility(calculatedLpn, calculatedNn, calculatedMnv, cleanMobile);
      }

      const generatedRecommendations = generateRecommendedNumbers(calculatedLpn);

      // 2. Set States
      setLpn(calculatedLpn);
      setNn(calculatedNn);
      setMnv(calculatedMnv);
      setCompatibility(calculatedComp);
      setRecommendations(generatedRecommendations);

      // 3. Save to database (LocalStorage)
      const newRecord = {
        id: Date.now().toString(),
        name: name.trim(),
        dob,
        mobile: mobile.trim() || null,
        lpn: calculatedLpn,
        nn: calculatedNn,
        mnv: calculatedMnv,
        score: calculatedComp ? calculatedComp.score : undefined,
        status: calculatedComp ? calculatedComp.status : undefined,
        date: new Date().toLocaleDateString()
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('auramobile_predictions', JSON.stringify(updatedHistory));

      // 4. Trigger screen transition
      setPage('results');

      // 5. Celebration!
      if (calculatedComp && calculatedComp.score >= 80) {
        triggerConfetti();
      }
    }, 2500);
  };

  const triggerConfetti = () => {
    // Beautiful side-burst confetti
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ca8a04', '#eab308', '#a855f7', '#6b21a8']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ca8a04', '#eab308', '#a855f7', '#6b21a8']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Reload history record prediction details
  const handleLoadPrediction = (record) => {
    setLpn(record.lpn);
    setNn(record.nn);
    setMnv(record.mnv);
    
    if (record.mobile) {
      const cleanMobile = record.mobile.replace(/[^0-9]/g, "");
      const calculatedComp = calculateCompatibility(record.lpn, record.nn, record.mnv, cleanMobile);
      setCompatibility(calculatedComp);
    } else {
      setCompatibility(null);
    }

    const generatedRecommendations = generateRecommendedNumbers(record.lpn);
    setRecommendations(generatedRecommendations);

    setName(record.name);
    setDob(record.dob);
    setMobile(record.mobile || '');
    setPage('results');
    setIsHistoryOpen(false);

    // If loaded record has high score, fire confetti again!
    if (record.score >= 80) {
      triggerConfetti();
    }
  };

  const handleDeletePrediction = (id) => {
    const filtered = history.filter(item => item.id !== id);
    setHistory(filtered);
    localStorage.setItem('auramobile_predictions', JSON.stringify(filtered));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to permanently erase all predictions history?")) {
      setHistory([]);
      localStorage.removeItem('auramobile_predictions');
    }
  };

  const handleCopyToClipboard = (num, index) => {
    navigator.clipboard.writeText(num.replace(/\s+/g, ''));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyPageText = () => {
    let text = `--- Mobile Numerology Prediction Report ---\n`;
    text += `Name: ${name}\n`;
    text += `Date of Birth: ${dob} (Life Path Number: ${lpn})\n`;
    text += `Name Number: ${nn}\n`;
    if (mobile) {
      text += `Mobile Number: ${mobile} (Mobile Value: ${mnv})\n`;
      text += `Compatibility Score: ${compatibility.score}%\n`;
      text += `Vibe Resonance: ${compatibility.status}\n`;
    }
    text += `Check recommended numbers tuned for you on AuraMobile!\n`;

    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // Icon selector helper
  const renderRecommendationIcon = (iconName) => {
    switch (iconName) {
      case 'DollarSign':
        return <TrendingUp className="h-5 w-5 text-yellow-400" />;
      case 'Heart':
        return <Heart className="h-5 w-5 text-emerald-400" fill="currentColor" />;
      case 'Shield':
        return <Shield className="h-5 w-5 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5 text-sky-400" />;
      case 'Zap':
        return <Zap className="h-5 w-5 text-rose-400" fill="currentColor" />;
      default:
        return <Star className="h-5 w-5 text-pink-400" />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-space-blue-950 via-[#100824] to-space-blue-950 text-yellow-100' 
        : 'bg-gradient-to-br from-purple-50 via-indigo-50/50 to-pink-50/30 text-purple-950'
    }`}>
      {/* Dynamic Background Stars particles on Dark Mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none no-print">
          {/* Cosmic glows */}
          <div className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pulse-glow-bg"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-yellow-500/5 blur-[100px] pulse-glow-bg"></div>

          {/* Sparkles particles */}
          <div className="absolute top-[15%] left-[25%] h-1 w-1 bg-yellow-300 rounded-full animate-star-1 opacity-70"></div>
          <div className="absolute top-[30%] right-[30%] h-1.5 w-1.5 bg-purple-300 rounded-full animate-star-2 opacity-50"></div>
          <div className="absolute bottom-[25%] left-[40%] h-1 w-1 bg-yellow-100 rounded-full animate-star-3 opacity-90"></div>
          <div className="absolute top-[50%] left-[15%] h-1.5 w-1.5 bg-yellow-400 rounded-full animate-star-2 opacity-60"></div>
          <div className="absolute bottom-[40%] right-[20%] h-1 w-1 bg-purple-400 rounded-full animate-star-1 opacity-80"></div>
        </div>
      )}

      {/* Main Header */}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Side predictions Drawer */}
      <SavedPredictions 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadPrediction={handleLoadPrediction}
        onDeletePrediction={handleDeletePrediction}
        onClearAll={handleClearAllHistory}
      />

      {/* Core Main Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-16 relative z-10 flex flex-col justify-center">
        
        {/* ================= PAGE: HOME ================= */}
        {page === 'home' && (
          <div className="space-y-12 animate-fade-in text-center no-print">
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider select-none animate-bounce">
                <Sparkles className="h-3.5 w-3.5" /> Numerology-based Mobile Diagnostics
              </div>
              
              <h1 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-tight">
                Unlock Your Mobile Number's{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent hover:brightness-110 transition-all font-extrabold gold-glow-text">
                  Celestial Frequency
                </span>
              </h1>
              
              <p className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-yellow-100/70' : 'text-purple-900/70'
              }`}>
                In numerology, mobile phone numbers carry a distinct vibratory planetary force that actively interacts with your Name and Destiny Path. Evaluate your number's resonance today or discover custom numbers calculated exclusively for you.
              </p>
            </div>

            {/* Glowing CTA Button */}
            <div className="flex justify-center select-none pt-4">
              <button 
                onClick={handleStartPrediction}
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-purple-950 font-bold text-lg rounded-xl shadow-lg hover:shadow-yellow-500/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center space-x-2.5 overflow-hidden"
              >
                <span className="relative z-10">Begin Free Alignment</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1.5 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>

            {/* Value Proposition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
              
              <div className="glass-panel glass-panel-glow rounded-2xl p-6 border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group hover:translate-y-[-4px]">
                <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-yellow-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Compass className="h-6 w-6 text-yellow-400 animate-spin-slow" />
                </div>
                <h3 className="font-display text-lg font-bold text-yellow-100 mb-2 group-hover:text-yellow-300 transition-colors">
                  Planetary Resonance
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                }`}>
                  Every single-digit reduction is ruled by a planet (e.g. 1 by Sun, 5 by Mercury). Learn what planetary forces dictate your telecommunications grid.
                </p>
              </div>

              <div className="glass-panel glass-panel-glow rounded-2xl p-6 border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group hover:translate-y-[-4px]">
                <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-yellow-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-yellow-100 mb-2 group-hover:text-yellow-300 transition-colors">
                  Chaldean Name Key
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                }`}>
                  Utilizes advanced letter mapping (such as 1=A,J,S) to decipher your active communication frequency and analyze structural resonance against mobile numbers.
                </p>
              </div>

              <div className="glass-panel glass-panel-glow rounded-2xl p-6 border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group hover:translate-y-[-4px]">
                <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-yellow-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-yellow-100 mb-2 group-hover:text-yellow-300 transition-colors">
                  Destiny Realignment
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                }`}>
                  Struggling with blocks or delays? AuraMobile compiles a custom list of highly compatible 10-digit mobile solutions matching your core Life Path.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ================= PAGE: FORM ================= */}
        {page === 'form' && (
          <div className="max-w-xl mx-auto w-full glass-panel glass-panel-glow rounded-3xl p-6 md:p-10 border border-yellow-500/20 shadow-2xl relative overflow-hidden animate-fade-in no-print">
            {/* Top decorative lines */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-yellow-500 to-amber-600"></div>
            
            <div className="mb-8 space-y-2">
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-yellow-100 text-center">
                Enter Your Cosmic Key
              </h2>
              <p className={`text-xs md:text-sm text-center ${
                theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
              }`}>
                We map your core birthdate and phonetic keys to measure phone alignment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Field */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-yellow-400/90 flex items-center gap-1.5 select-none">
                  <User className="h-4 w-4" /> Full Name
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                    }}
                    placeholder="Enter your registered name (e.g. John Doe)"
                    className={`w-full px-4 py-3 rounded-xl border bg-purple-950/20 focus:outline-none transition-all ${
                      errors.name 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-yellow-500/20 focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20'
                    } ${
                      theme === 'dark' ? 'text-yellow-100' : 'text-purple-950'
                    }`}
                  />
                  {errors.name && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>

              {/* DOB Field */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-yellow-400/90 flex items-center gap-1.5 select-none">
                  <Calendar className="h-4 w-4" /> Date of Birth
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      if (errors.dob) setErrors(prev => ({ ...prev, dob: null }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-purple-950/20 focus:outline-none transition-all ${
                      errors.dob 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-yellow-500/20 focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20'
                    } ${
                      theme === 'dark' ? 'text-yellow-100' : 'text-purple-950'
                    }`}
                  />
                  {errors.dob && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.dob}
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Mobile (Optional) Field */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center select-none">
                  <label className="text-sm font-bold text-yellow-400/90 flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> Existing Mobile Number
                  </label>
                  <span className="text-[10px] text-yellow-500/50 italic font-semibold">(Optional)</span>
                </div>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (errors.mobile) setErrors(prev => ({ ...prev, mobile: null }));
                    }}
                    placeholder="Enter your current 10-digit number"
                    className={`w-full px-4 py-3 rounded-xl border bg-purple-950/20 focus:outline-none transition-all ${
                      errors.mobile 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-yellow-500/20 focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20'
                    } ${
                      theme === 'dark' ? 'text-yellow-100' : 'text-purple-950'
                    }`}
                  />
                  {errors.mobile && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.mobile}
                    </div>
                  )}
                </div>
                <p className={`text-[10px] italic ${
                  theme === 'dark' ? 'text-yellow-100/40' : 'text-purple-900/40'
                }`}>
                  Leave blank if you just want mobile number recommendations.
                </p>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 select-none">
                <button
                  type="button"
                  onClick={handleBackToHome}
                  className="flex-1 px-6 py-3 border.5 border-yellow-500/20 hover:border-yellow-500/40 bg-purple-950/20 text-yellow-400 font-bold rounded-xl transition-all active:scale-95 text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-purple-950 font-bold rounded-xl shadow-lg active:scale-95 transition-all duration-300"
                >
                  Analyze Cosmic Path
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ================= PAGE: LOADING ================= */}
        {page === 'loading' && (
          <div className="max-w-md mx-auto w-full text-center space-y-8 animate-fade-in no-print select-none">
            {/* Spinning Astrolabe */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Outermost glowing ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-yellow-500/20 animate-spin-slow"></div>
              {/* Secondary reverse spinning ring */}
              <div className="absolute inset-4 rounded-full border border-yellow-500/40 border-t-yellow-500 border-b-purple-500 animate-spin-reverse-slow"></div>
              {/* Inner ring */}
              <div className="absolute inset-10 rounded-full border border-purple-500/30 flex items-center justify-center">
                <Compass className="h-10 w-10 text-yellow-400 animate-spin" />
              </div>
            </div>

            <div className="space-y-3 min-h-[60px]">
              <h3 className="font-display font-bold text-xl text-yellow-100 gold-glow-text">
                Aligning Celestial Coordinates
              </h3>
              <p className={`text-sm italic tracking-wide animate-pulse ${
                theme === 'dark' ? 'text-yellow-100/70' : 'text-purple-900/70'
              }`}>
                {loadingMessages[loadingMsgIndex]}
              </p>
            </div>
          </div>
        )}

        {/* ================= PAGE: RESULTS ================= */}
        {page === 'results' && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Print Header (Only visible when printing) */}
            <div className="hidden print:block text-center space-y-4 border-b border-yellow-600/30 pb-6 mb-8 text-black">
              <h1 className="font-display font-extrabold text-3xl tracking-wide select-none">
                AURA MOBILE NUMEROLOGY REPORT
              </h1>
              <p className="text-sm font-semibold select-none text-slate-800">
                Resonance diagnostics calculated on {new Date().toLocaleDateString()}
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs mt-4 text-slate-700">
                <div><strong>Client Name:</strong> {name}</div>
                <div><strong>Birthdate:</strong> {dob}</div>
                {mobile && <div><strong>Mobile Diagnosed:</strong> {mobile}</div>}
              </div>
            </div>

            {/* Results Title Section */}
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 border-b border-yellow-500/10 pb-6 no-print">
              <div className="text-center md:text-left space-y-1">
                <h2 className="font-display font-extrabold text-3xl text-yellow-100">
                  Cosmic Alignment Results
                </h2>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                }`}>
                  For <span className="text-yellow-400 font-bold">{name}</span>, Born <span className="text-yellow-400 font-bold">{dob}</span>
                </p>
              </div>

              {/* Utility Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleCopyPageText}
                  className="px-4 py-2 border border-yellow-500/20 bg-purple-950/20 text-yellow-400 font-bold rounded-xl text-xs hover:bg-yellow-500/10 hover:border-yellow-500/40 active:scale-95 transition-all flex items-center gap-1.5 select-none"
                  title="Copy Report to Clipboard"
                >
                  {copiedState ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      Report Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Share Report
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-purple-950 font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 select-none"
                  title="Download and Print PDF Report"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                
                <button
                  onClick={handleBackToHome}
                  className="px-4 py-2 border border-purple-500/30 hover:border-purple-500/60 bg-purple-950/20 text-yellow-100 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 select-none"
                >
                  <RotateCcw className="h-4 w-4 text-yellow-500" />
                  Restart
                </button>
              </div>
            </div>

            {/* Dashboard grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Column Left (Meter + Description) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Compatibility Meter block (Only if mobile was provided) */}
                {compatibility ? (
                  <div className="glass-panel glass-panel-glow border border-yellow-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    {/* Background glow circle */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-purple-500/5 blur-[50px]"></div>

                    {/* Progress Circle SVG */}
                    <div className="relative shrink-0 flex items-center justify-center w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Track circle */}
                        <circle
                          className="text-purple-950/40"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        {/* Glowing progress circle */}
                        <circle
                          className={`progress-ring__circle ${
                            compatibility.score >= 85 ? 'text-amber-400' :
                            compatibility.score >= 60 ? 'text-emerald-400' :
                            compatibility.score >= 40 ? 'text-sky-400' : 'text-rose-400'
                          }`}
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={((100 - compatibility.score) / 100) * (2 * Math.PI * 40)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      {/* Inside Score Text */}
                      <div className="absolute text-center select-none">
                        <span className="font-display text-4xl font-extrabold text-yellow-100 tracking-tighter">
                          {compatibility.score}%
                        </span>
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${compatibility.color}`}>
                          Score
                        </p>
                      </div>
                    </div>

                    {/* Compatibility Text breakdown */}
                    <div className="flex-1 text-left space-y-3">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${compatibility.borderColor} bg-purple-950/30 text-xs font-bold uppercase tracking-wider select-none`}>
                        <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                        {compatibility.status}
                      </div>

                      <h3 className="font-display font-extrabold text-xl text-yellow-100">
                        Vibrational Diagnostics
                      </h3>
                      
                      <p className={`text-xs md:text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-yellow-100/70' : 'text-purple-900/70'
                      }`}>
                        {compatibility.interpretation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel glass-panel-glow border border-yellow-500/10 rounded-3xl p-6 md:p-8 text-left space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-950/20 text-yellow-400 text-xs font-bold uppercase tracking-wider select-none">
                      <Info className="h-3.5 w-3.5" /> Recommendation Mode
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-yellow-100">
                      Primary Recommendations Generated
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-yellow-100/70' : 'text-purple-900/70'
                    }`}>
                      Since you didn't provide an existing mobile number, we have skipped the baseline compatibility scan and immediately synthesized six premium telephone numbers perfectly balanced to your Life Path frequency. Check the cards below to find your match!
                    </p>
                  </div>
                )}

                {/* 2. Micro-adjustments checklist (Only if mobile was provided and adjustments exist) */}
                {compatibility && compatibility.adjustments.length > 0 && (
                  <div className="glass-panel border border-yellow-500/10 rounded-3xl p-6 md:p-8 text-left space-y-4">
                    <h3 className="font-display font-bold text-lg text-yellow-100 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-yellow-400" /> Harmonic Balance Adjustments
                    </h3>
                    <div className="space-y-3">
                      {compatibility.adjustments.map((adj, index) => (
                        <div 
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed ${
                            adj.type === 'positive' 
                              ? 'bg-emerald-950/15 border-emerald-500/15 text-emerald-400/90' 
                              : 'bg-rose-950/15 border-rose-500/15 text-rose-400/90'
                          }`}
                        >
                          {adj.type === 'positive' ? (
                            <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                          )}
                          <span>{adj.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Column Right (Key Numbers Details Breakdown) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Core Numerology Breakdown Box */}
                <div className="glass-panel border border-yellow-500/15 rounded-3xl p-6 md:p-8 text-left space-y-6">
                  <h3 className="font-display font-extrabold text-lg text-yellow-100 border-b border-yellow-500/10 pb-3">
                    Numerology Profile Breakdown
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Life Path Number Item */}
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-yellow-500/20 shrink-0 flex items-center justify-center font-display font-extrabold text-lg text-yellow-400 select-none shadow-md">
                        {lpn}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-yellow-100">
                          Life Path Number ({lpn})
                        </h4>
                        <p className="text-[11px] text-yellow-500 font-semibold uppercase tracking-wider">
                          Governed by: {NUMBER_INFO[lpn].ruler}
                        </p>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                        }`}>
                          {NUMBER_INFO[lpn].description}
                        </p>
                      </div>
                    </div>

                    {/* Name Number Item */}
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-yellow-500/20 shrink-0 flex items-center justify-center font-display font-extrabold text-lg text-yellow-400 select-none shadow-md">
                        {nn}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-yellow-100">
                          Name Number ({nn})
                        </h4>
                        <p className="text-[11px] text-yellow-500 font-semibold uppercase tracking-wider">
                          Governed by: {NUMBER_INFO[nn].ruler}
                        </p>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                        }`}>
                          {NUMBER_INFO[nn].description}
                        </p>
                      </div>
                    </div>

                    {/* Mobile value Item (Only if mobile provided) */}
                    {mnv && (
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-yellow-500/20 shrink-0 flex items-center justify-center font-display font-extrabold text-lg text-yellow-400 select-none shadow-md">
                          {mnv}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-yellow-100">
                            Mobile Digit Value ({mnv})
                          </h4>
                          <p className="text-[11px] text-yellow-500 font-semibold uppercase tracking-wider">
                            Governed by: {NUMBER_INFO[mnv].ruler}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                          }`}>
                            {NUMBER_INFO[mnv].description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Recommended numbers section */}
            <div className="space-y-6 pt-6 print-page-break">
              <div className="text-center md:text-left space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-yellow-100">
                  Resonant Recommended Numbers
                </h3>
                <p className={`text-xs md:text-sm ${
                  theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                }`}>
                  These numbers sum to <span className="text-yellow-400 font-bold">{lpn}</span>, directly aligning with your Life Path ruler <span className="text-yellow-400 font-bold">{NUMBER_INFO[lpn].ruler}</span>.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print-grid">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="glass-panel border border-yellow-500/10 hover:border-yellow-500/40 rounded-2xl p-5 hover:translate-y-[-3px] transition-all duration-300 text-left flex flex-col justify-between group h-full relative"
                  >
                    <div className="space-y-4">
                      {/* Top banner tag */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 border border-yellow-500/10 text-yellow-300 font-bold uppercase rounded-md">
                          {rec.title}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-yellow-500/20 flex items-center justify-center">
                          {renderRecommendationIcon(rec.icon)}
                        </div>
                      </div>

                      {/* Large styled phone number */}
                      <div className="font-display font-extrabold text-xl md:text-2xl text-yellow-100 select-all group-hover:text-yellow-300 tracking-wider font-mono">
                        {rec.number}
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-yellow-100/80">Properties:</div>
                        <div className={`text-xs leading-relaxed ${
                          theme === 'dark' ? 'text-yellow-100/60' : 'text-purple-900/60'
                        }`}>
                          {rec.trait}
                        </div>
                      </div>
                    </div>

                    {/* Copy Action button */}
                    <div className="mt-5 pt-3 border-t border-yellow-500/5 flex justify-between items-center select-none no-print">
                      <span className="text-[10px] font-semibold text-yellow-500/60 flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-400" /> Digit Sum reduces to {rec.reduction}
                      </span>
                      <button
                        onClick={() => handleCopyToClipboard(rec.rawNumber, index)}
                        className="p-2 rounded-lg hover:bg-yellow-500/15 border border-yellow-500/10 text-yellow-500 hover:text-yellow-400 hover:border-yellow-500/35 active:scale-90 transition-all flex items-center gap-1 text-[11px] font-bold"
                        title="Copy number to clipboard"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Astrological advice disclaimer footer */}
            <div className="rounded-2xl border border-yellow-500/10 bg-purple-950/10 p-5 text-left text-xs leading-relaxed max-w-4xl mx-auto space-y-2 select-none print-glow-off">
              <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                <Info className="h-4 w-4 shrink-0" /> Celestial Advisory:
              </span>
              <p className={theme === 'dark' ? 'text-yellow-100/50' : 'text-purple-900/50'}>
                Numerology is an ancient meta-scientific framework meant to analyze energy blueprints and spiritual codes. While compatible digits can open channels of fluid energy, they work best when coupled with dedicated focus, professional discipline, and active relationship building. Treat predictions as motivational tools.
              </p>
            </div>
            
          </div>
        )}

      </main>

      {/* Modern Footer bar */}
      <footer className="w-full glass-panel border-t border-yellow-500/10 py-6 px-6 md:px-12 mt-auto text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs select-none no-print">
        <span className={theme === 'dark' ? 'text-yellow-100/40' : 'text-purple-900/40'}>
          &copy; {new Date().getFullYear()} AuraMobile. Built for cosmic alignment.
        </span>
        <div className="flex gap-4">
          <span className={`hover:text-yellow-400 cursor-pointer ${
            theme === 'dark' ? 'text-yellow-100/40' : 'text-purple-900/40'
          }`}>Privacy Policy</span>
          <span className={`hover:text-yellow-400 cursor-pointer ${
            theme === 'dark' ? 'text-yellow-100/40' : 'text-purple-900/40'
          }`}>Terms of Service</span>
          <span className={`hover:text-yellow-400 cursor-pointer ${
            theme === 'dark' ? 'text-yellow-100/40' : 'text-purple-900/40'
          }`}>Developer API</span>
        </div>
      </footer>
    </div>
  );
}
