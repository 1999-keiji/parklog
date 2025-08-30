import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Car, Timer } from 'lucide-react';
import { ParkingStatus as ParkingStatusType } from '../types/Payment';
import { formatDisplayDateTime } from '../utils/parkingUtils';

interface ParkingStatusProps {
  status: ParkingStatusType;
}

export function ParkingStatus({ status }: ParkingStatusProps) {
  const { isCurrentlyParked, currentRecord, nextPaymentDue, isOverdue, hoursUntilDue } = status;

  const getStatusDisplay = () => {
    if (!isCurrentlyParked) {
      return {
        icon: <Car className="w-6 h-6 text-gray-500" />,
        title: '未駐車',
        message: '現在は駐車されていません',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800'
      };
    }

    if (isOverdue) {
      return {
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        title: '支払い期限超過！',
        message: `${Math.abs(hoursUntilDue)}時間超過 - 至急支払いが必要です`,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      };
    }

    if (hoursUntilDue <= 2) {
      return {
        icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
        title: '支払い期限が迫っています！',
        message: hoursUntilDue <= 0 ? '今すぐ支払いが必要です' : `あと${hoursUntilDue}時間`,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800'
      };
    }

    if (hoursUntilDue <= 24) {
      return {
        icon: <Clock className="w-6 h-6 text-yellow-500" />,
        title: '支払い期限が近づいています',
        message: `あと${hoursUntilDue}時間`,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      };
    }

    return {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: '駐車中',
      message: `支払い期限まであと${hoursUntilDue}時間`,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className={`p-4 sm:p-6 rounded-xl border-2 ${statusDisplay.bgColor} ${statusDisplay.borderColor} transition-all duration-300`}>
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        {statusDisplay.icon}
        <div>
          <h2 className={`text-base sm:text-lg font-semibold ${statusDisplay.textColor}`}>
            {statusDisplay.title}
          </h2>
          <p className={`text-sm sm:text-base ${statusDisplay.textColor} opacity-80`}>
            {statusDisplay.message}
          </p>
        </div>
      </div>

      {currentRecord && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-gray-600">入車時刻</p>
              <p className="font-medium text-gray-800 text-base">
                {formatDisplayDateTime(currentRecord.entryTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-gray-600">支払い期限</p>
              <p className="font-medium text-gray-800 text-base">
                {nextPaymentDue ? formatDisplayDateTime(nextPaymentDue) : '未設定'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}