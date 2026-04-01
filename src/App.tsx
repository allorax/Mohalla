import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Shield, 
  BookOpen, 
  Wind, 
  Zap, 
  TrainFront, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  Share2, 
  Lock, 
  TrendingUp,
  Info,
  Star,
  History,
  LayoutDashboard,
  FileText,
  ArrowLeftRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { cn } from './lib/utils';

// --- Components ---

const HoodScoreGauge = ({ score }: { score: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return '#10B981'; // Green
    if (s >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const color = getColor(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="#E2E8F0"
          strokeWidth="12"
          fill="transparent"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold font-display" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">HoodScore</span>
      </div>
    </div>
  );
};

const PillarCard = ({ 
  title, 
  icon: Icon, 
  score, 
  metrics, 
  isLocked, 
  chartData 
}: { 
  title: string; 
  icon: any; 
  score: number; 
  metrics: string[]; 
  isLocked?: boolean;
  chartData?: any[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "mb-4 rounded-2xl overflow-hidden transition-all duration-300",
      isLocked ? "bg-slate-50 border border-slate-100" : "bg-white shadow-sm border border-slate-100"
    )}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => !isLocked && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl",
            isLocked ? "bg-slate-200 text-slate-400" : "bg-blue-50 text-blue-600"
          )}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  className={cn(
                    "h-full rounded-full",
                    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"
                  )}
                />
              </div>
              <span className="text-xs font-bold text-slate-500">{score}/100</span>
            </div>
          </div>
        </div>
        
        {isLocked ? (
          <Lock size={16} className="text-slate-400" />
        ) : (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronRight size={20} className="text-slate-400" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && !isLocked && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 border-t border-slate-50 pt-4"
          >
            <div className="grid grid-cols-2 gap-3 mb-4">
              {metrics.map((m, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Metric</p>
                  <p className="text-sm font-semibold text-slate-700">{m}</p>
                </div>
              ))}
            </div>
            
            {chartData && (
              <div className="h-32 w-full mt-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">30-Day Trend</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <p className="text-xs text-slate-500 mt-4 leading-relaxed italic">
              "This area shows consistent performance in {title.toLowerCase()} compared to regional averages."
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Mock Data ---

const MOCK_CHART_DATA = [
  { name: '1', value: 45 }, { name: '2', value: 52 }, { name: '3', value: 48 },
  { name: '4', value: 61 }, { name: '5', value: 55 }, { name: '6', value: 67 },
  { name: '7', value: 72 },
];

const COMPARISON_DATA = [
  { subject: 'Environment', A: 85, B: 60, fullMark: 100 },
  { subject: 'Education', A: 90, B: 75, fullMark: 100 },
  { subject: 'Safety', A: 70, B: 80, fullMark: 100 },
  { subject: 'Utilities', A: 80, B: 65, fullMark: 100 },
  { subject: 'Infrastructure', A: 95, B: 70, fullMark: 100 },
];

// --- Screens ---

const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(0);
  const slides = [
    {
      title: "Trustworthy Neighborhood Insights",
      desc: "Get standardized reports for Delhi-NCR localities before you invest your hard-earned money.",
      img: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Data-Driven HoodScore",
      desc: "We analyze 5 key pillars: Environment, Education, Safety, Utilities, and Future Value.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="h-screen bg-white flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.img 
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={slides[step].img} 
          className="w-full h-64 object-cover rounded-3xl mb-8 shadow-xl"
        />
        <h1 className="text-2xl font-bold font-display text-slate-800 mb-4">{slides[step].title}</h1>
        <p className="text-slate-500 leading-relaxed">{slides[step].desc}</p>
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-8 bg-blue-600" : "w-2 bg-slate-200")} />
          ))}
        </div>
        <button 
          onClick={() => step < slides.length - 1 ? setStep(step + 1) : onFinish()}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          {step === slides.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
};

const HomeScreen = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <div className="pb-24">
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-bold font-display text-slate-800 mb-2">Mohalla</h1>
        <p className="text-slate-500">Find your perfect neighborhood in Delhi-NCR</p>
      </header>
      
      <div className="px-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search Sector 57 Gurgaon, Pincode..." 
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            onKeyDown={(e) => e.key === 'Enter' && onSearch(e.currentTarget.value)}
          />
        </div>
      </div>

      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Popular Localities</h2>
          <button className="text-blue-600 text-sm font-bold">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {['Sector 57, Gurgaon', 'Noida Extension', 'Dwarka Sector 10', 'Vasant Kunj'].map((loc) => (
            <div 
              key={loc} 
              onClick={() => onSearch(loc)}
              className="min-w-[160px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                <MapPin size={20} />
              </div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{loc}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-500">82 HoodScore</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6">
        <h2 className="font-bold text-slate-800 mb-4">Recent Searches</h2>
        <div className="space-y-3">
          {['Indirapuram, Ghaziabad', 'Sushant Lok 1'].map((loc) => (
            <div key={loc} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
              <History size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">{loc}</span>
              <ChevronRight size={16} className="ml-auto text-slate-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ReportScreen = ({ locality, onBack, onCompare }: { locality: string; onBack: () => void; onCompare: () => void }) => {
  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="pb-24 bg-mohalla-bg min-h-screen">
      <div className="bg-white p-6 pt-12 rounded-b-[40px] shadow-sm mb-6">
        <button onClick={onBack} className="mb-6 p-2 bg-slate-50 rounded-full active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold font-display text-slate-800 mb-1">{locality}</h1>
          <p className="text-slate-400 text-sm mb-6 flex items-center gap-1">
            <MapPin size={14} /> Gurgaon, Haryana
          </p>
          
          <HoodScoreGauge score={84} />
          
          <div className="mt-6 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <TrendingUp size={16} />
            Better than 78% of Delhi-NCR
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-slate-800">Neighborhood Pillars</h2>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Info size={12} />
            Updated 2 days ago
          </div>
        </div>

        <PillarCard 
          title="Environment" 
          icon={Wind} 
          score={88} 
          metrics={['AQI: 45 (Good)', 'Green Cover: 22%', 'Noise Level: Low']}
          chartData={MOCK_CHART_DATA}
        />
        
        <PillarCard 
          title="Education" 
          icon={BookOpen} 
          score={92} 
          metrics={['School Density: High', 'Top Rated: 5 Schools', 'Pre-school: 12']}
          chartData={MOCK_CHART_DATA}
        />

        {!isPaid && (
          <div className="relative mt-8 p-6 bg-blue-600 rounded-3xl overflow-hidden shadow-xl shadow-blue-200">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-white font-bold text-lg mb-2">Unlock Full Report</h3>
            <p className="text-blue-100 text-sm mb-6">Get Safety, Utilities, and Future Value insights + PDF Export.</p>
            <button 
              onClick={() => setIsPaid(true)}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Unlock for ₹299
            </button>
          </div>
        )}

        <PillarCard 
          title="Safety" 
          icon={Shield} 
          score={76} 
          metrics={['CCTV Coverage: 80%', 'Police Patrolling: Regular', 'Safety Index: 7.8/10']}
          isLocked={!isPaid}
        />
        
        <PillarCard 
          title="Utilities" 
          icon={Zap} 
          score={82} 
          metrics={['Power Backup: 99%', 'Water Supply: 24/7', 'Waste Mgmt: A+']}
          isLocked={!isPaid}
        />
        
        <PillarCard 
          title="Infrastructure" 
          icon={TrainFront} 
          score={95} 
          metrics={['Metro: 500m', 'Expressway: 2km', 'Future: New Mall']}
          isLocked={!isPaid}
        />

        <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3">Interactive Map</h3>
          <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 relative overflow-hidden">
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover opacity-50" />
             <div className="relative z-10 flex flex-col items-center">
               <MapPin className="text-blue-600 mb-2" />
               <span className="text-xs font-bold text-slate-600">Explore Neighborhood Layers</span>
             </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={onCompare}
            className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <ArrowLeftRight size={18} /> Compare
          </button>
          <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Download size={18} /> PDF
          </button>
        </div>

        <footer className="py-12 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Data Sources</p>
          <p className="text-[10px] text-slate-400 px-8 leading-relaxed">
            CPCB, Ministry of Education, Local Municipal Records, and Mohalla Proprietary Safety Index.
          </p>
        </footer>
      </div>
    </div>
  );
};

const ComparisonScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pb-24 bg-white min-h-screen">
      <header className="p-6 pt-12 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold font-display text-slate-800">Compare Localities</h1>
      </header>

      <div className="px-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Locality A</p>
            <p className="font-bold text-blue-900">Sector 57, Gurgaon</p>
          </div>
          <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Locality B</p>
            <p className="font-bold text-slate-900">Sector 150, Noida</p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full px-6 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={COMPARISON_DATA}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Gurgaon" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
            <Radar name="Noida" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex items-center justify-between font-bold text-sm text-slate-400 uppercase tracking-widest">
          <span>Pillar</span>
          <div className="flex gap-12">
            <span>A</span>
            <span>B</span>
          </div>
        </div>
        
        {COMPARISON_DATA.map((item) => (
          <div key={item.subject} className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">{item.subject}</span>
            <div className="flex gap-12 font-bold">
              <span className={cn(item.A > item.B ? "text-blue-600" : "text-slate-400")}>{item.A}</span>
              <span className={cn(item.B > item.A ? "text-emerald-600" : "text-slate-400")}>{item.B}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<'onboarding' | 'home' | 'report' | 'compare'>('onboarding');
  const [selectedLocality, setSelectedLocality] = useState('');

  const handleSearch = (query: string) => {
    setSelectedLocality(query);
    setScreen('report');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-mohalla-bg relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {screen === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            <Onboarding onFinish={() => setScreen('home')} />
          </motion.div>
        )}

        {screen === 'home' && (
          <motion.div 
            key="home"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            <HomeScreen onSearch={handleSearch} />
          </motion.div>
        )}

        {screen === 'report' && (
          <motion.div 
            key="report"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            <ReportScreen 
              locality={selectedLocality} 
              onBack={() => setScreen('home')} 
              onCompare={() => setScreen('compare')}
            />
          </motion.div>
        )}

        {screen === 'compare' && (
          <motion.div 
            key="compare"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <ComparisonScreen onBack={() => setScreen('report')} />
          </motion.div>
        )}
      </AnimatePresence>

      {screen !== 'onboarding' && (
        <nav className="thumb-nav shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button onClick={() => setScreen('home')} className={cn("flex flex-col items-center gap-1", screen === 'home' ? "text-blue-600" : "text-slate-400")}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <FileText size={20} />
            <span className="text-[10px] font-bold uppercase">Reports</span>
          </button>
          <button onClick={() => setScreen('compare')} className={cn("flex flex-col items-center gap-1", screen === 'compare' ? "text-blue-600" : "text-slate-400")}>
            <ArrowLeftRight size={20} />
            <span className="text-[10px] font-bold uppercase">Compare</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <User size={20} />
            <span className="text-[10px] font-bold uppercase">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
}
