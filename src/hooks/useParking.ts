import { useState, useEffect } from 'react';
import { ParkingRecord, ParkingStatus } from '../types/Payment';
import { getParkingStatus, generateId, formatDateTime, DEFAULT_MAX_HOURS } from '../utils/parkingUtils';

const STORAGE_KEY = 'bike_parking_records';

export function useParking(maxHours: number = DEFAULT_MAX_HOURS) {
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [status, setStatus] = useState<ParkingStatus>({
    isCurrentlyParked: false,
    isOverdue: false,
    hoursUntilDue: 0,
    allRecords: []
  });

  // Load records from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedRecords = JSON.parse(stored);
        setRecords(parsedRecords);
      } catch (error) {
        console.error('Error loading parking records:', error);
      }
    }
  }, []);

  // Update status when records change
  useEffect(() => {
    const newStatus = getParkingStatus(records, maxHours);
    setStatus(newStatus);
  }, [records, maxHours]);

  // Save to localStorage when records change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const recordEntry = (entryTime?: string) => {
    // フォームから渡された日時がある場合はそれを使用し、ない場合のみ現在時刻を使用
    let entryDateTime: string;
    if (entryTime) {
      entryDateTime = entryTime;
    } else {
      entryDateTime = formatDateTime(new Date());
    }
    const newRecord: ParkingRecord = {
      id: generateId(),
      entryTime: entryDateTime,
      isActive: true,
      createdAt: Date.now()
    };

    // End any existing active parking
    setRecords(prev => [
      ...prev.map(record => ({ ...record, isActive: false })),
      newRecord
    ]);
    
    return newRecord;
  };

  const recordExit = (exitTime?: string, paymentAmount?: number) => {
    const exitDateTime = exitTime || formatDateTime(new Date());
    
    setRecords(prev => 
      prev.map(record => 
        record.isActive 
          ? { 
              ...record, 
              exitTime: exitDateTime, 
              paymentAmount,
              isActive: false 
            }
          : record
      )
    );
  };

  const removeRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return {
    records,
    status,
    recordEntry,
    recordExit,
    removeRecord
  };
}