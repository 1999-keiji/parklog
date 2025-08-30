import React, { useState } from 'react';
import { X, Clock, DollarSign, LogIn, LogOut } from 'lucide-react';
import { formatDateTimeLocal, formatDisplayDateTime } from '../utils/parkingUtils';

interface ParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEntry: (entryTime: string) => void;
  onSaveExit: (exitTime: string, amount?: number) => void;
  selectedDateTime?: string;
  isCurrentlyParked: boolean;
}

export function ParkingModal({ 
  isOpen, 
  onClose, 
  onSaveEntry, 
  onSaveExit, 
  selectedDateTime,
  isCurrentlyParked 
}: ParkingModalProps) {
  const [dateTime, setDateTime] = useState<string>(
    selectedDateTime ? formatDateTimeLocal(new Date(selectedDateTime)) : formatDateTimeLocal(new Date())
  );
  const [amount, setAmount] = useState<string>('');

  React.useEffect(() => {
    if (selectedDateTime) {
      setDateTime(formatDateTimeLocal(new Date(selectedDateTime)));
    } else {
      setDateTime(formatDateTimeLocal(new Date()));
    }
  }, [selectedDateTime]);

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isoDateTime = new Date(dateTime).toISOString();
    onSaveEntry(isoDateTime);
    onClose();
    setAmount('');
  };

  const handleExitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isoDateTime = new Date(dateTime).toISOString();
    onSaveExit(isoDateTime, amount ? parseInt(amount) : undefined);
    onClose();
    setAmount('');
  };

  const handleQuickEntry = () => {
    const now = new Date().toISOString();
    onSaveEntry(now);
    onClose();
    setAmount('');
  };

  const handleQuickExit = () => {
    const now = new Date().toISOString();
    onSaveExit(now);
    onClose();
    setAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isCurrentlyParked ? 'バイク出庫記録' : 'バイク入車記録'}
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
          {isCurrentlyParked ? (
            // Exit form
            <form onSubmit={handleExitSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  出庫日時
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4" />
                  支払い金額 (円) - 任意
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="例: 500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                />
              </div>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleQuickExit}
                  className="w-full bg-red-500 text-white px-6 py-4 rounded-xl font-medium hover:bg-red-600 transition-colors text-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  今すぐ出庫記録
                </button>
              </div>
            </form>
          ) : (
            // Entry form
            <form onSubmit={handleEntrySubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  入車日時
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleQuickEntry}
                  className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-600 transition-colors text-lg flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  今すぐ入車記録
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}