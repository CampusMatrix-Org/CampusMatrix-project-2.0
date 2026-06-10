/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
 
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('campusMatrix_theme') === 'dark';
  });

  
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('campusMatrix_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('campusMatrix_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
