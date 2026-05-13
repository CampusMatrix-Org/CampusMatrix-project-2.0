import React, { createContext, useState, useEffect, useContext } from 'react';

// --- Simple Translation Dictionary ---
const translations = {
  en: {
    // Sidebar & Header
    dashboard: "Dashboard", tasks: "Tasks", calendar: "Calendar", studyTools: "Study Tools", aiAssistant: "AI Study Assistant", settings: "Settings", searchPlaceholder: "Search tasks...",
    // Settings Page
    systemPrefs: "System Preferences", sysDesc: "Configure how you interact with the CampusMatrix platform.", appearance: "Appearance & Experience", darkMode: "Dark Mode", darkDesc: "Switch between light and dark themes", primaryLang: "Primary Language", langDesc: "Set your preferred interface language", notifications: "Notification Settings", emailNotifs: "Email Notifications", emailDesc: "Receive summaries and task alerts via email", desktopAlerts: "Desktop Alerts", desktopDesc: "Show push notifications on your device", reset: "Reset to Defaults", save: "Save Changes", saveSuccess: "Settings saved successfully!"
  },
  si: {
    dashboard: "උපකරණ පුවරුව", tasks: "කාර්යයන්", calendar: "දින දර්ශනය", studyTools: "අධ්‍යයන මෙවලම්", aiAssistant: "AI සහායකයා", settings: "සැකසුම්", searchPlaceholder: "සොයන්න...",
    systemPrefs: "පද්ධති සැකසුම්", sysDesc: "ඔබ CampusMatrix භාවිතා කරන ආකාරය සකසන්න.", appearance: "පෙනුම සහ අත්දැකීම", darkMode: "අඳුරු තේමාව", darkDesc: "ආලෝක සහ අඳුරු තේමා අතර මාරු වන්න", primaryLang: "ප්‍රධාන භාෂාව", langDesc: "ඔබ කැමති භාෂාව තෝරන්න", notifications: "දැනුම්දීම් සැකසුම්", emailNotifs: "විද්‍යුත් තැපැල් දැනුම්දීම්", emailDesc: "ඊමේල් හරහා දැනුම්දීම් ලබා ගන්න", desktopAlerts: "ඩෙස්ක්ටොප් දැනුම්දීම්", desktopDesc: "ඔබේ උපාංගයේ දැනුම්දීම් පෙන්වන්න", reset: "යළි පිහිටුවන්න", save: "සුරකින්න", saveSuccess: "සැකසුම් සාර්ථකව සුරැකිණි!"
  },
  ta: {
    dashboard: "டாஷ்போர்டு", tasks: "பணிகள்", calendar: "நாள்காட்டி", studyTools: "ஆய்வு கருவிகள்", aiAssistant: "AI உதவியாளர்", settings: "அமைப்புகள்", searchPlaceholder: "தேடல்...",
    systemPrefs: "கணினி அமைப்புகள்", sysDesc: "க্যাম্পஸ் மேட்ரிக்ஸ் தளத்தை நீங்கள் எவ்வாறு பயன்படுத்துகிறீர்கள் என்பதை உள்ளமைக்கவும்.", appearance: "தோற்றம் மற்றும் அனுபவம்", darkMode: "இருண்ட பயன்முறை", darkDesc: "ஒளி மற்றும் இருண்ட கருப்பொருள்களுக்கு இடையில் மாறுக", primaryLang: "முதன்மை மொழி", langDesc: "உங்கள் விருப்பமான மொழியை அமைக்கவும்", notifications: "அறிவிப்பு அமைப்புகள்", emailNotifs: "மின்னஞ்சல் அறிவிப்புகள்", emailDesc: "மின்னஞ்சல் வழியாக சுருக்கங்களைப் பெறுங்கள்", desktopAlerts: "டெஸ்க்டாப் விழிப்பூட்டல்கள்", desktopDesc: "உங்கள் சாதனத்தில் அறிவிப்புகளைக் காட்டு", reset: "இயல்புநிலைக்கு மீட்டமை", save: "மாற்றங்களை சேமிக்கவும்", saveSuccess: "அமைப்புகள் சேமிக்கப்பட்டன!"
  }
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Load initial states from LocalStorage or set Defaults
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('cm_darkMode')) || false);
  const [language, setLanguage] = useState(() => localStorage.getItem('cm_language') || 'en');
  const [emailNotifs, setEmailNotifs] = useState(() => {
    const saved = localStorage.getItem('cm_emailNotifs');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [desktopAlerts, setDesktopAlerts] = useState(() => JSON.parse(localStorage.getItem('cm_desktopAlerts')) || false);

  // Apply Dark Mode Class to the entire <body>
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Function to get translated text
  const t = (key) => translations[language][key] || translations['en'][key];

  // Save all settings to LocalStorage
  const saveSettings = () => {
    localStorage.setItem('cm_darkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('cm_language', language);
    localStorage.setItem('cm_emailNotifs', JSON.stringify(emailNotifs));
    localStorage.setItem('cm_desktopAlerts', JSON.stringify(desktopAlerts));
    alert(t('saveSuccess'));
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    setIsDarkMode(false);
    setLanguage('en');
    setEmailNotifs(true);
    setDesktopAlerts(false);
  };

  return (
    <SettingsContext.Provider value={{
      isDarkMode, setIsDarkMode,
      language, setLanguage,
      emailNotifs, setEmailNotifs,
      desktopAlerts, setDesktopAlerts,
      saveSettings, resetToDefaults, t
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);