import React from 'react';
import { Menu, Sparkles, ShoppingCart, Award } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  credits: number;
  aiTokens: number;
  activePage: string;
  projectName: string;
}

export default function Header({ onToggleMobileMenu, credits, aiTokens, activePage, projectName }: HeaderProps) {
  // Generate human-friendly breadcrumbs based on selected page
  const renderBreadcrumbs = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-[#0035c5] font-semibold">Overview</span>
          </>
        );
      case 'skill-bank':
        return (
          <>
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-[#0035c5] font-semibold">Skill Bank Repository</span>
          </>
        );
      case 'skill-wallet':
        return (
          <>
            <span className="text-gray-400 font-medium">Dashboard</span>
            <span className="text-gray-300 mx-1.5">/</span>
            <span className="text-gray-400 font-medium">Skill Wallet</span>
            <span className="text-gray-300 mx-1.5">/</span>
            <span className="text-[#0035c5] font-bold">Project Details</span>
          </>
        );
      case 'skill-card':
        return (
          <>
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-[#0035c5] font-semibold">Skill Card Passport</span>
          </>
        );
      case 'skill-credits':
        return (
          <>
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-[#0035c5] font-semibold">Accumulated Credits</span>
          </>
        );
      case 'admin':
        return (
          <>
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-indigo-600 font-bold">Admin Console</span>
          </>
        );
      default:
        return (
          <>
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-[#0035c5] font-semibold">{activePage}</span>
          </>
        );
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4 md:pl-[276px]">
      {/* Left side: Hamburger (mobile) or Breadcrumbs (desktop) */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 md:hidden active:scale-95 transition-all cursor-pointer"
        >
          <Menu className="w-6 h-6 text-[#0035c5]" />
        </button>
        
        {/* Mobile Logo */}
        <div className="flex items-center gap-1.5 md:hidden">
          <span className="text-xl font-black font-headline tracking-tight text-[#0035c5]">SkillWallet</span>
        </div>

        {/* Desktop Breadcrumbs */}
        <nav className="hidden md:flex items-center text-xs tracking-wide font-medium">
          {renderBreadcrumbs()}
        </nav>
      </div>

      {/* Right side: Wallet, Credit Indicators & User Badge */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* AI Tokens widget */}
        <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span className="hidden sm:inline">AI Token:</span>
          <span>{aiTokens}</span>
        </div>

        {/* Credits Badge */}
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 px-3 py-1 rounded-full text-green-700 text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-green-600" />
          <span>{credits} Credits</span>
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* User initials / Avatar circle */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:block text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
            ramyamenti59@gmail.com
          </span>
          <div className="w-8 h-8 rounded-full bg-[#6aff88] text-[#002108] border border-green-300 flex items-center justify-center font-extrabold text-xs shadow-sm shadow-green-200/50">
            MR
          </div>
        </div>
      </div>
    </header>
  );
}
