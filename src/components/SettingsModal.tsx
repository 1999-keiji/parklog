import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Calendar } from 'lucide-react';
import { Settings } from '../types/Payment';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [maxHours, setMaxHours] = useState(settings.maxParkingHours.toString());

  React.useEffect(() => {
    setMaxHours(settings.maxParkingHours.toString());
  }, [settings.maxParkingHours]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseInt(maxHours);
    if (hours > 0 && hours <= 8760) { // Max 1 year
      onSave({ maxParkingHours: hours });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            設定
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                最大駐車時間（時間）
              </label>
              <input
                type="number"
                value={maxHours}
                onChange={(e) => setMaxHours(e.target.value)}
                min="1"
                max="8760"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                1〜8760時間の範囲で設定してください
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-medium text-blue-900 mb-2">プリセット</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMaxHours('24')}
                  className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                >
                  1日 (24時間)
                </button>
                <button
                  type="button"
                  onClick={() => setMaxHours('168')}
                  className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                >
                  1週間 (168時間)
                </button>
                <button
                  type="button"
                  onClick={() => setMaxHours('720')}
                  className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                >
                  1ヶ月 (720時間)
                </button>
                <button
                  type="button"
                  onClick={() => setMaxHours('12')}
                  className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                >
                  半日 (12時間)
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-600 transition-colors text-lg"
            >
              設定を保存
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}