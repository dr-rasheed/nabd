export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  country: string;
  timestamp: string;
  sourceUrl?: string;
  sentiment: 'urgent' | 'breaking' | 'normal';
}

export interface HotSpot {
  countryCode: string;
  countryName: string;
  reason: string;
}

const staticHotSpots: { [key: string]: HotSpot[] } = {
  en: [
    { countryCode: 'US', countryName: 'USA', reason: 'Major tech policy shifts trending.' },
    { countryCode: 'UA', countryName: 'Ukraine', reason: 'Ongoing regional developments.' },
    { countryCode: 'JP', countryName: 'Japan', reason: 'Economic updates and market shifts.' },
    { countryCode: 'BR', countryName: 'Brazil', reason: 'Environmental summit discussions.' },
    { countryCode: 'GB', countryName: 'UK', reason: 'Political leadership debates.' },
    { countryCode: 'FR', countryName: 'France', reason: 'Cultural events and protests.' },
    { countryCode: 'DE', countryName: 'Germany', reason: 'Industrial innovation news.' },
    { countryCode: 'IN', countryName: 'India', reason: 'Space mission success reports.' }
  ],
  ar: [
    { countryCode: 'SA', countryName: 'السعودية', reason: 'تطورات رؤية 2030 والمشاريع الكبرى.' },
    { countryCode: 'EG', countryName: 'مصر', reason: 'مشاريع البنية التحتية الجديدة.' },
    { countryCode: 'AE', countryName: 'الإمارات', reason: 'قمة التكنولوجيا العالمية في دبي.' },
    { countryCode: 'PS', countryName: 'فلسطين', reason: 'تطورات الأوضاع الميدانية.' },
    { countryCode: 'LB', countryName: 'لبنان', reason: 'أخبار اقتصادية واجتماعية.' },
    { countryCode: 'MA', countryName: 'المغرب', reason: 'استعدادات كأس العالم والرياضة.' },
    { countryCode: 'QA', countryName: 'قطر', reason: 'فعاليات دبلوماسية دولية.' },
    { countryCode: 'JO', countryName: 'الأردن', reason: 'مبادرات سياحية وبيئية.' }
  ]
};

const staticNews: { [key: string]: NewsItem[] } = {
  en: [
    { id: '1', title: 'Global Tech Summit 2026 Begins', summary: 'Leaders from across the globe gather to discuss the future of decentralized intelligence and robotics.', country: 'USA', timestamp: '2m ago', sentiment: 'breaking' },
    { id: '2', title: 'New Energy Source Discovered', summary: 'Scientists in Europe report a breakthrough in clean fusion energy, potentially solving the energy crisis.', country: 'France', timestamp: '15m ago', sentiment: 'urgent' },
    { id: '3', title: 'Market Volatility Hits Asia', summary: 'Stock markets in Tokyo and Hong Kong see sharp movements following new trade regulations.', country: 'Japan', timestamp: '1h ago', sentiment: 'normal' }
  ],
  ar: [
    { id: '1', title: 'انطلاق قمة التكنولوجيا العالمية 2026', summary: 'قادة من جميع أنحاء العالم يجتمعون لمناقشة مستقبل الذكاء اللامركزي والروبوتات.', country: 'الإمارات', timestamp: 'منذ دقيقتين', sentiment: 'breaking' },
    { id: '2', title: 'اكتشاف مصدر طاقة جديد', summary: 'علماء في أوروبا يعلنون عن طفرة في طاقة الاندماج النظيف، مما قد يحل أزمة الطاقة العالمية.', country: 'فرنسا', timestamp: 'منذ 15 دقيقة', sentiment: 'urgent' },
    { id: '3', title: 'تقلبات في الأسواق الآسيوية', summary: 'أسواق الأسهم في طوكيو وهونج كونج تشهد تحركات حادة عقب لوائح تجارية جديدة.', country: 'اليابان', timestamp: 'منذ ساعة', sentiment: 'normal' }
  ]
};

export async function getHotSpots(lang: string = 'en'): Promise<HotSpot[]> {
  return staticHotSpots[lang] || staticHotSpots['en'];
}

export async function getNews(country?: string, lang: string = 'en'): Promise<NewsItem[]> {
  const news = staticNews[lang] || staticNews['en'];
  if (country) {
    // In a real static app, you'd filter or fetch a specific JSON file
    return news.filter(n => n.country.includes(country) || country.includes(n.country));
  }
  return news;
}
