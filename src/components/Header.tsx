import React from 'react';
import { 
  Search, 
  Bell, 
  Users, 
  MapPin, 
  Smartphone, 
  Maximize2, 
  Radio,
  X 
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenFriends: () => void;
  onOpenProfile: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  friendCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  unreadCount,
  onOpenNotifications,
  onOpenFriends,
  onOpenProfile,
  isMobileFrame,
  onToggleMobileFrame,
  friendCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Top Utility Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 border-b border-zinc-100 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
          <span className="font-semibold">LocalPulse Live</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-600 truncate max-w-[140px] sm:max-w-none">{user.location}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Frame Toggle */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? "Switch to Responsive View" : "Switch to Mobile Frame"}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors font-medium text-[11px]"
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Wide View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Title & Action Row */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-1.5">
              <span>LocalPulse</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                Events
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-zinc-400" />
            <span>Curated from news, notes & community</span>
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Friends button */}
          <button
            id="friends-btn"
            onClick={onOpenFriends}
            className="relative p-2 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors flex items-center gap-1"
            title="Friends & Connections"
          >
            <Users className="w-5 h-5 text-zinc-700" />
            <span className="hidden xs:inline-block text-xs font-semibold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded-full">
              {friendCount}
            </span>
          </button>

          {/* Notifications bell with badge */}
          <button
            id="notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors"
            title="Notifications & Friend RSVPs"
          >
            <Bell className="w-5 h-5 text-zinc-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User profile avatar */}
          <button
            id="profile-btn"
            onClick={onOpenProfile}
            className="relative rounded-full ring-2 ring-zinc-200 hover:ring-zinc-400 transition-all p-0.5"
            title="Profile & Preferences"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
        </div>
      </div>

      {/* Global Search Bar (searches events and friends) */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events, venues, music, food, or friends..."
            className="w-full pl-9 pr-9 py-2 bg-zinc-100 hover:bg-zinc-150 focus:bg-white text-sm text-zinc-800 placeholder-zinc-400 rounded-xl border border-transparent focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
