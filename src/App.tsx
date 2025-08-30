import React, { useState } from 'react';
import { Header } from './components/Header';
import { ParkingStatus } from './components/ParkingStatus';
import { QuickActions } from './components/QuickActions';
import { Calendar } from './components/Calendar';
import { ParkingHistory } from './components/ParkingHistory';
import { ParkingModal } from './components/ParkingModal';
import { SettingsModal } from './components/SettingsModal';
import { useParking } from './hooks/useParking';
import { useSettings } from './hooks/useSettings';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const { settings, updateSettings } = useSettings();
  const { records, status, recordEntry, recordExit, removeRecord } = useParking(settings.maxParkingHours);
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<string>();

  useNotifications(status);

  const handleDateClick = (date: Date) => {
    setSelectedDateTime(date.toISOString());
    setIsParkingModalOpen(true);
  };

  const handleQuickAction = () => {
    setSelectedDateTime(undefined);
    setIsParkingModalOpen(true);
  };

  const handleSaveEntry = (entryTime: string) => {
    recordEntry(entryTime);
  };

  const handleSaveExit = (exitTime: string, amount?: number) => {
    recordExit(exitTime, amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        maxHours={settings.maxParkingHours}
      />
      
      <main className="px-4 py-6 space-y-6 pb-safe">
        <ParkingStatus status={status} />
        
        <QuickActions
          onEntry={handleQuickAction}
          onExit={handleQuickAction}
          isCurrentlyParked={status.isCurrentlyParked}
        />
        
        <Calendar
          records={records}
          onDateClick={handleDateClick}
          maxParkingHours={settings.maxParkingHours}
        />
        
        <ParkingHistory
          records={records}
          onRemoveRecord={removeRecord}
        />
      </main>

      <ParkingModal
        isOpen={isParkingModalOpen}
        onClose={() => setIsParkingModalOpen(false)}
        onSaveEntry={handleSaveEntry}
        onSaveExit={handleSaveExit}
        selectedDateTime={selectedDateTime}
        isCurrentlyParked={status.isCurrentlyParked}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </div>
  );
}

export default App;