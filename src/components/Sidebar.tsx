import React from 'react';
import { 
  LayoutDashboard, 
  Library, 
  Wallet, 
  CreditCard, 
  Award, 
  HelpCircle,
  Menu,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  credits: number;
}

export default function Sidebar({ activePage, setActivePage, credits }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skill-bank', label: 'Skill Bank', icon: Library },
    { id: 'skill-wallet', label: 'Skill Wallet', icon: Wallet },
    { id: 'skill-card', label: 'Skill Card', icon: CreditCard },
    { id: 'skill-credits', label: 'Skill Credits', icon: Award },
    { id: 'admin', label: 'Admin Console', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] bg-[#003bff] text-white h-screen fixed left-0 top-0 z-40 transition-all shadow-xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-blue-600/30">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-xl tracking-tight">
          S
        </div>
        <div>
          <h1 className="text-xl font-black font-headline tracking-wide leading-none">SkillWallet</h1>
          <span className="text-[10px] text-blue-200/80 font-medium">A SmartBridge Product</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider font-bold text-blue-200/60 px-3 mb-2">
          Core Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left cursor-pointer group ${
                isActive 
                  ? 'bg-white text-[#003bff] font-bold shadow-md shadow-blue-800/10' 
                  : 'hover:bg-white/10 text-blue-100 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-[#003bff]' : 'text-blue-200 group-hover:text-white'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-6 bg-[#003bff] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Credits Tracker */}
      <div className="p-4 bg-blue-800/40 border-t border-blue-600/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-blue-200 font-medium">Credits Balance</span>
          <span className="bg-white/20 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">MR</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black font-headline text-white">{credits}</span>
          <span className="text-xs text-blue-200 font-semibold">Credits</span>
        </div>
        <div className="mt-3 text-[11px] text-blue-200/80 bg-blue-900/30 p-2 rounded border border-blue-600/20 leading-snug">
          Complete project tasks to earn bonus credits.
        </div>
      </div>
    </aside>
  );
}
