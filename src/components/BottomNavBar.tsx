import React from 'react';
import { Home, Wallet, Award, User } from 'lucide-react';

interface BottomNavBarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function BottomNavBar({ activePage, setActivePage }: BottomNavBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'skill-wallet', label: 'Wallet', icon: Wallet },
    { id: 'skill-bank', label: 'Projects', icon: Award },
    { id: 'skill-credits', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2 pb-safe z-40 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all cursor-pointer ${
              isActive 
                ? 'text-[#0035c5] font-bold' 
                : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110 text-[#0035c5]' : ''}`} />
            <span className="text-[10px] tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
