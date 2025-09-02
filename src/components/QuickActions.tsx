import React from 'react';
import { LogIn, LogOut } from 'lucide-react';

interface QuickActionsProps {
  onEntry: () => void;
  onExit: () => void;
  isCurrentlyParked: boolean;
}

export function QuickActions({ onEntry, onExit, isCurrentlyParked }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">クイックアクション</h3>
      
      <div className="space-y-3">
        {!isCurrentlyParked ? (
          <button
            onClick={onEntry}
            className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-600 transition-colors text-lg touch-manipulation"
          >
            <LogIn className="w-5 h-5" />
            入車記録
          </button>
        ) : (
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-3 bg-red-500 text-white px-6 py-4 rounded-xl font-medium hover:bg-red-600 transition-colors text-lg touch-manipulation"
          >
            <LogOut className="w-5 h-5" />
            出庫記録
          </button>
        )}
      </div>
    </div>
  );
}