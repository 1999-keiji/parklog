import { ParkingRecord, ParkingStatus } from '../types/Payment';

export const DEFAULT_MAX_HOURS = 168; // 7 days = 168 hours

export function formatDateTime(date: Date): string {
  return date.toISOString();
}

export function formatDateTimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().slice(0, 16);
}

export function parseDateTime(dateTimeString: string): Date {
  return new Date(dateTimeString);
}

export function calculatePaymentDue(entryTime: string, maxHours: number): string {
  const entry = parseDateTime(entryTime);
  const due = new Date(entry.getTime() + (maxHours * 60 * 60 * 1000));
  return formatDateTime(due);
}

export function getHoursUntilDue(dueTime: string): number {
  const now = new Date();
  const due = parseDateTime(dueTime);
  const diffMs = due.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60));
}

export function isOverdue(dueTime: string): boolean {
  return getHoursUntilDue(dueTime) < 0;
}

export function isPaymentDue(entryTime: string, maxHours: number): boolean {
  const dueTime = calculatePaymentDue(entryTime, maxHours);
  return isOverdue(dueTime);
}

export function getPaymentDueDate(entryTime: string, maxHours: number): Date {
  const dueTimeString = calculatePaymentDue(entryTime, maxHours);
  return parseDateTime(dueTimeString);
}

export function getParkingStatus(records: ParkingRecord[], maxHours: number): ParkingStatus {
  const activeRecord = records.find(record => record.isActive);
  
  if (!activeRecord) {
    return {
      isCurrentlyParked: false,
      isOverdue: false,
      hoursUntilDue: 0,
      allRecords: records.sort((a, b) => b.createdAt - a.createdAt)
    };
  }

  const nextPaymentDue = calculatePaymentDue(activeRecord.entryTime, maxHours);
  const hoursUntilDue = getHoursUntilDue(nextPaymentDue);
  
  return {
    isCurrentlyParked: true,
    currentRecord: activeRecord,
    nextPaymentDue,
    isOverdue: isOverdue(nextPaymentDue),
    hoursUntilDue,
    allRecords: records.sort((a, b) => b.createdAt - a.createdAt)
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDisplayDateTime(dateTimeString: string): string {
  const date = parseDateTime(dateTimeString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDisplayDate(dateTimeString: string): string {
  const date = parseDateTime(dateTimeString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDisplayTime(dateTimeString: string): string {
  const date = parseDateTime(dateTimeString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
}