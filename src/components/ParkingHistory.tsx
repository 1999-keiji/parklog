import React from 'react';
import { Car, Trash2, LogIn, LogOut, ChevronDown, ChevronUp, Clock, DollarSign } from 'lucide-react';
import { ParkingRecord } from '../types/Payment';
import { formatDisplayDateTime } from '../utils/parkingUtils';

interface ParkingHistoryProps {
  records: ParkingRecord[];
  onRemoveRecord: (id: string) => void;
}

export function ParkingHistory({ records, onRemoveRecord }: ParkingHistoryProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const sortedRecords = [...records].sort((a, b) => b.createdAt - a.createdAt);
  const displayRecords = isExpanded ? sortedRecords : sortedRecords.slice(0, 3);

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">駐車履歴</h3>
        <div className="text-center py-6 sm:py-8">
          <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">駐車記録がありません</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">入車記録を開始してください</p>
        </div>
      </div>
    );
  }

  const calculateDuration = (record: ParkingRecord): string => {
    if (!record.exitTime) return '駐車中';
    
    const entry = new Date(record.entryTime);
    const exit = new Date(record.exitTime);
    const diffMs = exit.getTime() - entry.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}時間${minutes > 0 ? `${minutes}分` : ''}`;
    }
    return `${minutes}分`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          駐車履歴 ({records.length}回)
        </h3>
        {records.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>閉じる</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>すべて表示</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {displayRecords.map((record) => (
          <div
            key={record.id}
            className="p-4 bg-gray-50 rounded-lg group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Entry Info */}
                <div className="flex items-center gap-2 mb-2">
                  <LogIn className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      入車: {formatDisplayDateTime(record.entryTime)}
                    </p>
                  </div>
                </div>
                
                {/* Exit Info */}
                {record.exitTime ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <LogOut className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          出庫: {formatDisplayDateTime(record.exitTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {record.paymentAmount && (
                        <p className="text-xs text-gray-500">
                          支払い金額: ¥{record.paymentAmount.toLocaleString()}
                        </p>
                      )}
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        駐車時間: {calculateDuration(record)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-600 font-medium">駐車中</p>
                  </div>
                )}          
              </div>
              
              <button
                onClick={() => {
                  if (confirm('この駐車記録を削除しますか？')) {
                    onRemoveRecord(record.id);
                  }
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                aria-label="削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}