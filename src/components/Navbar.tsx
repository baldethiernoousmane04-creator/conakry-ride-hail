import React from 'react';
import { Menu, User, Bell, ChevronDown, MapPin } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 md:p-2 rounded-2xl shadow-xl border border-white/50 ring-1 ring-gray-900/5">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-2 px-2">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-indigo-600">WONGAYE</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 ring-1 ring-gray-900/5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-gray-700">Guinée-Conakry</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/50 ring-1 ring-gray-900/5 hover:bg-gray-50 transition-all relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 md:p-2 rounded-2xl shadow-xl border border-white/50 ring-1 ring-gray-900/5 hover:bg-gray-50 transition-all">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden border border-indigo-200 transition-all">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="hidden md:flex items-center gap-1 pr-1">
               <span className="text-sm font-bold text-gray-800">Moussa</span>
               <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};