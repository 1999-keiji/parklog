import React from 'react';
import { Bike, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  maxHours: number;
}

function formatHoursToDays(hours: number): string {
  if (hours < 24) {
    return `${hours}時間`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return `${days}日間`;
  }
  return `${days}日${remainingHours}時間`;
}

export function Header({ onSettingsClick, maxHours }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Bike className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">バイク駐車場管理</h1>
            <p className="text-sm text-gray-600">最大{formatHoursToDays(maxHours)}駐車管理</p>
          </div>
        </div>
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="設定"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}