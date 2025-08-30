import { useEffect } from 'react';
import { ParkingStatus } from '../types/Payment';

export function useNotifications(status: ParkingStatus) {
  useEffect(() => {
    if (!status.isCurrentlyParked || !status.nextPaymentDue) return;

    const checkNotifications = () => {
      const { hoursUntilDue, isOverdue } = status;
      
      if ('Notification' in window && Notification.permission === 'granted') {
        // Overdue notification
        if (isOverdue) {
          new Notification('🚨 バイク駐車期限超過！', {
            body: `支払い期限を${Math.abs(hoursUntilDue)}時間超過しています。至急対応が必要です。`,
            icon: '/bike-icon-192.png',
            tag: 'overdue'
          });
        }
        // 2 hours before due
        else if (hoursUntilDue <= 2 && hoursUntilDue > 0) {
          new Notification('⚠️ バイク駐車期限まもなく！', {
            body: `支払い期限まであと${hoursUntilDue}時間です。`,
            icon: '/bike-icon-192.png',
            tag: 'urgent'
          });
        }
        // 24 hours before due (1 day)
        else if (hoursUntilDue <= 24 && hoursUntilDue > 2) {
          new Notification('📅 バイク駐車期限通知', {
            body: `支払い期限まであと${hoursUntilDue}時間です。`,
            icon: '/bike-icon-192.png',
            tag: 'reminder'
          });
        }
      }
    };

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check immediately
    checkNotifications();

    // Set up periodic checks every hour
    const interval = setInterval(checkNotifications, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [status.isCurrentlyParked, status.nextPaymentDue, status.hoursUntilDue, status.isOverdue]);
}