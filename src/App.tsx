import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Zap, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Search,
  Languages
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';
import { getHotSpots, getNews, type NewsItem, type HotSpot } from './services/newsService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Language = 'en' | 'ar';

const translations = {
  en: {
    title: 'Global Pulse',
    subtitle: 'Real-time Intelligence Feed',
    searchPlaceholder: 'Search intelligence...',
    breakingNews: 'BREAKING NEWS',
    fetching: 'FETCHING...',
    activeHotSpots: 'Active Hot Spots',
    latestFrom: 'Latest from',
    globalFeed: 'Global Intelligence Feed',
    shareIntel: 'Share Intel',
    verifySource: 'Verify Source',
    viewSource: 'View Source',
    noMatches: 'No intelligence matches your current filters.',
    liveStatus: 'Live Network Status',
    velocity: 'Global News Velocity',
    activeNodes: 'Active Nodes',
    trendingTopics: 'Trending Topics',
    disclaimer: 'Global Intelligence Feed provides real-time updates from verified global sources. Data is updated periodically.',
    high: 'High',
    urgent: 'Urgent',
    breaking: 'Breaking',
    normal: 'Normal'
  },
  ar: {
    title: 'نبض العالم',
    subtitle: 'خلاصة المعلومات الفورية',
    searchPlaceholder: 'ابحث في المعلومات...',
    breakingNews: 'أخبار عاجلة',
    fetching: 'جاري الجلب...',
    activeHotSpots: 'النقاط الساخنة النشطة',
    latestFrom: 'آخر الأخبار من',
    globalFeed: 'خلاصة المعلومات العالمية',
    shareIntel: 'مشاركة الخبر',
    verifySource: 'التحقق من المصدر',
    viewSource: 'عرض المصدر',
    noMatches: 'لا توجد معلومات تطابق الفلاتر الحالية.',
    liveStatus: 'حالة الشبكة الحية',
    velocity: 'سرعة الأخبار العالمية',
    activeNodes: 'العقد النشطة',
    trendingTopics: 'المواضيع الرائجة',
    disclaimer: 'يوفر نبض العالم تحديثات فورية من مصادر عالمية موثوقة. يتم تحديث البيانات بشكل دوري.',
    high: 'عالية',
    urgent: 'عاجل',
    breaking: 'هام',
    normal: 'عادي'
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [hotSpots, setHotSpots] = useState<HotSpot[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const fetchData = useCallback(async (country?: string, currentLang: Language = lang) => {
    setRefreshing(true);
    try {
      const [spots, newsItems] = await Promise.all([
        getHotSpots(currentLang),
        getNews(country, currentLang)
      ]);
      setHotSpots(spots);
      setNews(newsItems);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchData(undefined, lang);
  }, [lang]);

  const handleCountryClick = (spot: HotSpot) => {
    setSelectedCountry(spot.countryName);
    fetchData(spot.countryName, lang);
  };

  const handleBreakingNewsClick = () => {
    setSelectedCountry(null);
    fetchData(undefined, lang);
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    setSelectedCountry(null);
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={cn(
        "min-h-screen bg-[#0A0A0A] text-[#E4E3E0] font-sans selection:bg-emerald-500/30",
        isRtl ? "font-['Cairo',_sans-serif]" : "font-sans"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Globe className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase italic font-serif">{t.title}</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-mono">{t.subtitle}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-2 w-96 focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white flex items-center gap-2"
            >
              <Languages className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>
            
            <button 
              onClick={handleBreakingNewsClick}
              disabled={refreshing}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className={cn("w-4 h-4", refreshing && "animate-pulse")} />
              {refreshing ? t.fetching : t.breakingNews}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hot Spots Bar */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              {t.activeHotSpots}
            </h2>
            <div className="h-[1px] flex-1 mx-4 bg-white/10" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="min-w-[140px] h-20 bg-white/5 rounded-xl animate-pulse" />
              ))
            ) : (
              hotSpots.map((spot) => (
                <motion.button
                  key={spot.countryCode}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCountryClick(spot)}
                  className={cn(
                    "min-w-[160px] p-3 rounded-xl border transition-all text-start group relative overflow-hidden",
                    selectedCountry === spot.countryName 
                      ? "bg-emerald-500/10 border-emerald-500/50" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={`https://flagcdn.com/w40/${spot.countryCode.toLowerCase()}.png`} 
                      alt={spot.countryName}
                      className="w-6 h-4 object-cover rounded-sm shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-bold truncate">{spot.countryName}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {spot.reason}
                  </p>
                  {selectedCountry === spot.countryName && (
                    <motion.div 
                      layoutId="active-spot"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                    />
                  )}
                </motion.button>
              ))
            )}
          </div>
        </section>

        {/* News Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif italic font-medium">
                {selectedCountry ? `${t.latestFrom} ${selectedCountry}` : t.globalFeed}
              </h3>
              {refreshing && <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />}
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                ))
              ) : filteredNews.length > 0 ? (
                filteredNews.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all hover:border-white/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          item.sentiment === 'urgent' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          item.sentiment === 'breaking' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        )}>
                          {item.sentiment === 'urgent' ? t.urgent : item.sentiment === 'breaking' ? t.breaking : t.normal}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        {item.country}
                      </div>
                    </div>

                    <h4 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors leading-tight">
                      {item.title}
                    </h4>
                    
                    <div className="text-zinc-400 text-sm leading-relaxed mb-6 prose prose-invert prose-sm max-w-none">
                      <Markdown>{item.summary}</Markdown>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                          {t.shareIntel}
                        </button>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                          {t.verifySource}
                        </button>
                      </div>
                      {item.sourceUrl && (
                        <a 
                          href={item.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-emerald-500 hover:underline font-bold"
                        >
                          {t.viewSource} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 font-mono text-sm">{t.noMatches}</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-500 mb-4 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                {t.liveStatus}
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{t.velocity}</span>
                  <span className="text-emerald-400 font-mono">{t.high}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{t.activeNodes}</span>
                  <span className="text-emerald-400 font-mono">1,242</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-6">{t.trendingTopics}</h4>
              <div className="space-y-4">
                {['#GlobalCrisis', '#TechRevolution', '#ClimateAction', '#SpaceRace2026'].map((tag) => (
                  <div key={tag} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">{tag}</span>
                    <ChevronRight className={cn("w-4 h-4 text-zinc-700 group-hover:text-emerald-400 transition-all group-hover:translate-x-1", isRtl && "rotate-180")} />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent">
              <p className="text-[10px] text-zinc-500 leading-relaxed font-mono uppercase tracking-wider">
                {t.disclaimer}
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">{t.title} Intelligence Network © 2026</span>
          </div>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'API', 'Contact'].map(item => (
              <a key={item} href="#" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
