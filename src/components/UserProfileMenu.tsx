import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Building,
  Key,
  Users,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Shield
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface UserProfileMenuProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenTwoFactorSetup: () => void;
  onSignOut: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenTwoFactorSetup,
  onSignOut,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        id="user-profile-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all text-left shadow-sm hover:border-slate-600"
      >
        <div className={`w-8 h-8 rounded-xl ${currentUser.avatarColor || 'bg-orange-500'} text-white font-bold text-xs flex items-center justify-center shadow-inner`}>
          {currentUser.avatarInitials || 'U'}
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white max-w-[120px] truncate">
              {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1]?.[0]}.
            </span>
            {currentUser.twoFactorEnabled ? (
              <span title="2FA Active" className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ) : (
              <span title="2FA Disabled" className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
            {currentUser.role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl p-4 z-50 animate-fadeIn space-y-4">
          {/* User Details Header */}
          <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-2xl ${currentUser.avatarColor || 'bg-orange-500'} text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-md`}>
              {currentUser.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">{currentUser.name}</h4>
              <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* 2FA Security Status Card */}
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {currentUser.twoFactorEnabled ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                )}
                <span className="font-semibold text-slate-200">
                  {currentUser.twoFactorEnabled ? '2FA Shield Active' : '2FA Protection Off'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentUser.twoFactorEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {currentUser.twoFactorEnabled ? 'Protected' : 'Action Needed'}
              </span>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenTwoFactorSetup();
              }}
              className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Key className="w-3.5 h-3.5 text-orange-400" />
              <span>{currentUser.twoFactorEnabled ? 'Manage 2FA & Backup Codes' : 'Enable 2FA Protection'}</span>
            </button>
          </div>

          {/* Quick Switch Accounts */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              Switch University Account
            </span>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    user.id === currentUser.id
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-5 h-5 rounded-lg ${user.avatarColor} text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0`}>
                      {user.avatarInitials}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold block truncate">{user.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{user.role}</span>
                    </div>
                  </div>
                  {user.id === currentUser.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-1 border-t border-slate-800">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Lock Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
