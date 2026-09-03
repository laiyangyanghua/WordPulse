import React from 'react';
import { 
  Gamepad2, 
  Layers, 
  BookOpen, 
  BookmarkCheck, 
  Flame, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Server, 
  Languages,
  MoreVertical,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { sound } from '../services/sound';
import { UserStats } from '../types';

export type TabType = 'match' | 'flashcards' | 'stories' | 'vault';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userStats: UserStats;
  isMuted: boolean;
  onToggleMute: () => void;
  accent: 'en-US' | 'en-GB';
  onToggleAccent: () => void;
  onOpenDeployModal: () => void;
  bookmarkedCount?: number;
  isPhoneFrame?: boolean;
  onTogglePhoneFrame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userStats,
  isMuted,
  onToggleMute,
  accent,
  onToggleAccent,
  onOpenDeployModal,
  bookmarkedCount = 0,
  isPhoneFrame = false,
  onTogglePhoneFrame,
}) => {
  const tabs = [
    { id: 'match' as TabType, label: '消消乐', icon: Gamepad2, badge: 'HOT' },
    { id: 'flashcards' as TabType, label: '3D词卡', icon: Layers },
    { id: 'stories' as TabType, label: '场景短剧', icon: BookOpen, badge: 'AI' },
    { id: 'vault' as TabType, label: '生词本', icon: BookmarkCheck, count: bookmarkedCount },
  ];

  return (
    <>
      {/* Top Mobile App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 select-none">
        <div className="w-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-2">
          
          {/* Left: App Logo & Title */}
          <div 
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" 
            onClick={() => onSelectTab('match')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-sm sm:text-base tracking-tight text-white font-outfit">
                  WordPulse
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  App
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right Stats & Quick Action Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Streak flame badge */}
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold"
              title={`已连续打卡 ${userStats.streakDays} 天`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{userStats.streakDays}d</span>
            </div>

            {/* Points badge */}
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold font-mono"
              title={`当前总积分: ${userStats.totalPoints}`}
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{userStats.totalPoints}</span>
            </div>

            {/* Accent US/UK Switcher */}
            <button
              onClick={() => {
                sound.playSelect();
                onToggleAccent();
              }}
              title={`发音: ${accent === 'en-US' ? '美式英语 (US)' : '英式英语 (UK)'}`}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-cyan-400 text-[11px] font-bold flex items-center gap-0.5 transition-all"
            >
              <Languages className="w-3 h-3" />
              <span>{accent === 'en-US' ? 'US' : 'UK'}</span>
            </button>

            {/* Audio Mute Switcher */}
            <button
              onClick={() => {
                onToggleMute();
                if (isMuted) sound.playSelect();
              }}
              title={isMuted ? '点击开启音效' : '点击静音'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>

            {/* Phone Frame Mockup Toggle (Desktop only) */}
            {onTogglePhoneFrame && (
              <button
                onClick={() => {
                  sound.playSelect();
                  onTogglePhoneFrame();
                }}
                title={isPhoneFrame ? '切换为自适应全屏' : '切换为真实手机模型外观'}
                className="hidden md:flex p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 transition-all"
              >
                <Smartphone className={`w-3.5 h-3.5 ${isPhoneFrame ? 'text-indigo-400' : 'text-slate-400'}`} />
              </button>
            )}

            {/* Deploy Modal trigger */}
            <button
              onClick={() => {
                sound.playSelect();
                onOpenDeployModal();
              }}
              title="云服务器部署指南"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 transition-all"
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Mobile App Navigation Bar (Dock) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 pb-safe select-none">
        <div className="max-w-md md:max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playSelect();
                  onSelectTab(tab.id);
                }}
                className={`flex-1 relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
                  isActive
                    ? 'text-indigo-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                {/* Active Pill Glow */}
                {isActive && (
                  <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}

                {/* Icon with badges */}
                <div className="relative">
                  <div className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-indigo-600/20 text-indigo-300' : ''
                  }`}>
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  </div>

                  {/* Badge */}
                  {tab.badge && (
                    <span className={`absolute -top-1 -right-2 text-[8px] font-black px-1 py-0.2 rounded-full uppercase leading-none shadow-sm ${
                      tab.badge === 'AI'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}

                  {/* Count badge */}
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold px-0.5 rounded-full bg-indigo-600 text-white leading-none">
                      {tab.count > 99 ? '99+' : tab.count}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
