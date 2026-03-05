import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Zap, 
  RefreshCw, 
  Clock, 
  TrendingUp,
  Search,
  Languages,
  Twitter,
  MapPin,
  BarChart3
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchLiveTweets, type Tweet } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Language = 'en' | 'ar';

const COUNTRIES = [
  { code: 'SA', name: { en: 'Saudi Arabia', ar: 'السعودية' } },
  { code: 'EG', name: { en: 'Egypt', ar: 'مصر' } },
  { code: 'AE', name: { en: 'UAE', ar: 'الإمارات' } },
  { code: 'PS', name: { en: 'Palestine', ar: 'فلسطين' } },
  { code: 'US', name: { en: 'USA', ar: 'أمريكا' } },
  { code: 'GB', name: { en: 'UK', ar: 'بريطانيا' } },
  { code: 'TR', name: { en: 'Turkey', ar: 'تركيا' } },
  { code: 'JP', name: { en: 'Japan', ar: 'اليابان' } },
  { code: 'DE', name: { en: 'Germany', ar: 'ألمانيا' } },
  { code: 'FR', name: { en: 'France', ar: 'فرنسا' } },
];

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isRtl = lang === 'ar';

  const fetchUpdates = useCallback(async (countryName: string) => {
    setRefreshing(true);
    const newTweets = await fetchLiveTweets(countryName, lang);
    if (newTweets.length > 0) {
      setTweets(prev => {
        const combined = [...newTweets, ...prev];
        return combined.slice(0, 50); // Keep last 50
      });
    }
    setRefreshing(false);
    setLoading(false);
    setCountdown(5);
  }, [lang]);

  useEffect(() => {
    fetchUpdates(selectedCountry.name[lang]);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchUpdates(selectedCountry.name[lang]);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedCountry, lang, fetchUpdates]);

  const toggleLanguage = () => setLang(l => l === 'en' ? 'ar' : 'en');

  return (
    <div 
      className={cn(
        "min-h-screen bg-[#050505] text-[#E4E3E0] font-mono selection:bg-emerald-500/30 text-[13px]",
        isRtl ? "font-['Cairo',_sans-serif]" : "font-mono"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Navigation - Ultra Compact */}
      <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-sm border-b border-white/5 px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span className="font-bold uppercase tracking-tighter text-sm">NABD.INTEL</span>
          </div>
          
          <div className="h-4 w-[1px] bg-white/10" />
          
          <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[50vw]">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setSelectedCountry(c);
                  setTweets([]);
                  setLoading(true);
                }}
                className={cn(
                  "px-2 py-1 rounded flex items-center gap-1.5 transition-all whitespace-nowrap",
                  selectedCountry.code === c.code ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <img 
                  src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                  alt={c.code}
                  className="w-4 h-2.5 object-cover rounded-[1px]"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] uppercase font-bold">{c.name[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
            <span className="animate-pulse text-emerald-500">●</span>
            LIVE: {countdown}S
          </div>
          <button onClick={toggleLanguage} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase">
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto border-x border-white/5 min-h-screen">
        {/* Status Bar */}
        <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                {isRtl ? 'النبض المباشر' : 'LIVE PULSE'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[11px] font-bold text-emerald-500">{selectedCountry.name[lang]}</span>
            </div>
          </div>
          {refreshing && <RefreshCw className="w-3 h-3 animate-spin text-emerald-500" />}
        </div>

        {/* Feed */}
        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(10).fill(0).map((_, i) => (
                <div key={i} className="p-4 space-y-2 animate-pulse">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                    <div className="w-24 h-3 bg-white/5 rounded" />
                  </div>
                  <div className="w-full h-12 bg-white/5 rounded" />
                </div>
              ))
            ) : tweets.length > 0 ? (
              tweets.map((tweet) => (
                <motion.div
                  key={tweet.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 hover:bg-white/[0.02] transition-colors group relative"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                        <Twitter className="w-4 h-4 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-zinc-200 truncate">{tweet.author}</span>
                          <span className="text-zinc-600 truncate">@{tweet.handle}</span>
                          <span className="text-zinc-700">·</span>
                          <span className="text-zinc-600 whitespace-nowrap">{tweet.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <BarChart3 className="w-3 h-3 text-zinc-600" />
                          <span className="text-[10px] text-zinc-700">INTEL</span>
                        </div>
                      </div>
                      <p className="text-zinc-300 leading-relaxed break-words">
                        {tweet.content}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-zinc-600">
                        <div className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer transition-colors">
                          <Zap className="w-3 h-3" />
                          <span className="text-[10px] font-bold">VERIFY</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer transition-colors">
                          <RefreshCw className="w-3 h-3" />
                          <span className="text-[10px] font-bold">RE-PULSE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 text-center text-zinc-600 uppercase tracking-widest text-[10px]">
                No intelligence found for this sector.
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="p-4 text-center border-t border-white/5 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[9px] uppercase tracking-[0.4em]">
          NABD.INTEL // GLOBAL PULSE NETWORK // ENCRYPTED FEED
        </p>
      </footer>
    </div>
  );
}
