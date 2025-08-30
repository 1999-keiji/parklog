import React from 'react';
import { ChevronLeft, ChevronRight, Car, Clock, AlertTriangle } from 'lucide-react';
import { ParkingRecord } from '../types/Payment';
import { formatTime, isPaymentDue, getPaymentDueDate } from '../utils/parkingUtils';

interface CalendarProps {
  records: ParkingRecord[];
  onDateClick: (date: Date) => void;
  maxParkingHours: number;
}

export function Calendar({ records, onDateClick, maxParkingHours }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getRecordsForDate = (date: Date) => {
    return records.filter(record => {
      const recordDate = new Date(record.entryTime);
      return recordDate.toDateString() === date.toDateString();
    });
  };

  const getCurrentParking = () => {
    return records.find(record => record.entryTime && !record.exitTime);
  };

  const getDayStatus = (date: Date) => {
    const dayRecords = getRecordsForDate(date);
    const currentParking = getCurrentParking();
    
    if (currentParking) {
      const entryDate = new Date(currentParking.entryTime);
      if (entryDate.toDateString() === date.toDateString()) {
        const dueDate = getPaymentDueDate(currentParking.entryTime, maxParkingHours);
        if (isPaymentDue(currentParking.entryTime, maxParkingHours)) {
          return 'overdue';
        } else if (new Date().getTime() > dueDate.getTime() - 24 * 60 * 60 * 1000) {
          return 'warning';
        }
        return 'current';
      }
    }

    if (dayRecords.length > 0) {
      return 'completed';
    }

    return 'normal';
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayRecords = getRecordsForDate(date);
      const status = getDayStatus(date);
      const isToday = date.toDateString() === today.toDateString();

      let dayClasses = 'h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 relative ';
      
      switch (status) {
        case 'current':
          dayClasses += 'bg-blue-100 border-2 border-blue-500 text-blue-700 hover:bg-blue-200';
          break;
        case 'warning':
          dayClasses += 'bg-orange-100 border-2 border-orange-500 text-orange-700 hover:bg-orange-200';
          break;
        case 'overdue':
          dayClasses += 'bg-red-100 border-2 border-red-500 text-red-700 hover:bg-red-200 animate-pulse';
          break;
        case 'completed':
          dayClasses += 'bg-green-100 text-green-700 hover:bg-green-200';
          break;
        default:
          dayClasses += 'hover:bg-gray-100 text-gray-700';
      }

      if (isToday) {
        dayClasses += ' ring-2 ring-indigo-400';
      }

      days.push(
        <div
          key={day}
          className={dayClasses}
          onClick={() => onDateClick(date)}
        >
          <span className="text-sm font-medium">{day}</span>
          {dayRecords.length > 0 && (
            <div className="flex items-center space-x-1 mt-1">
              {status === 'current' && <Car className="w-3 h-3" />}
              {status === 'warning' && <Clock className="w-3 h-3" />}
              {status === 'overdue' && <AlertTriangle className="w-3 h-3" />}
              {dayRecords.length > 1 && (
                <span className="text-xs bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {dayRecords.length}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          {year}年 {monthNames[month]}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
          <span className="text-gray-600">駐車中</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-500 rounded"></div>
          <span className="text-gray-600">期限間近</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-500 rounded animate-pulse"></div>
          <span className="text-gray-600">期限超過</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span className="text-gray-600">出庫済み</span>
        </div>
      </div>
    </div>
  );
}