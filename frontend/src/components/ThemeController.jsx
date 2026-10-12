import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const ThemeController = () => {
  const location = useLocation();
  const { isDarkMode: isAdminDarkMode } = useTheme();
  const { isDarkMode: isUserDarkMode } = useSettings();

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (isAdminRoute) {
      // Remove user dark mode
      document.body.classList.remove('dark-mode');
      
      // Apply admin dark mode if enabled
      if (isAdminDarkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    } else {
      // Remove admin dark mode
      document.body.classList.remove('dark-theme');
      
      // Apply user dark mode if enabled
      if (isUserDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }, [location.pathname, isAdminDarkMode, isUserDarkMode]);

  return null; // This component doesn't render anything
};

export default ThemeController;
