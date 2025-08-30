import { useState, useEffect } from 'react';
import { Settings } from '../types/Payment';
import { DEFAULT_MAX_HOURS } from '../utils/parkingUtils';

const SETTINGS_STORAGE_KEY = 'bike_parking_settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    maxParkingHours: DEFAULT_MAX_HOURS
  });

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings
  };
}