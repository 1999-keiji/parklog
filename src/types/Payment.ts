export interface ParkingRecord {
  id: string;
  entryTime: string; // ISO string format
  exitTime?: string; // ISO string format
  paymentAmount?: number;
  isActive: boolean; // true if bike is currently parked
  createdAt: number;
}

export interface ParkingStatus {
  isCurrentlyParked: boolean;
  currentRecord?: ParkingRecord;
  nextPaymentDue?: string;
  isOverdue: boolean;
  hoursUntilDue: number;
  allRecords: ParkingRecord[];
}

export interface Settings {
  maxParkingHours: number; // Maximum hours before payment required
}