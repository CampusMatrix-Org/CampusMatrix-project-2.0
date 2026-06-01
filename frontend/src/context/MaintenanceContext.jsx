import React, { createContext, useState, useContext, useEffect } from 'react';

const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {
  // Check local storage for initial state to persist across refreshes
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
    const saved = localStorage.getItem('campusMatrix_maintenance');
    return saved === 'true';
  });

  // Update local storage when state changes
  useEffect(() => {
    localStorage.setItem('campusMatrix_maintenance', isMaintenanceMode);
  }, [isMaintenanceMode]);

  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, setIsMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);