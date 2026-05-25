import React, { createContext, useState, useEffect, useContext } from 'react';

// --- Simple Translation Dictionary ---
const translations = {
  en: {
    // Sidebar & Header
    dashboard: "Dashboard", tasks: "Tasks", calendar: "Calendar", studyTools: "Study Tools", aiAssistant: "AI Study Assistant", settings: "Settings", searchPlaceholder: "Search tasks...",
    // Settings Page
    systemPrefs: "System Preferences", sysDesc: "Configure how you interact with the CampusMatrix platform.", appearance: "Appearance & Experience", darkMode: "Dark Mode", darkDesc: "Switch between light and dark themes", primaryLang: "Primary Language", langDesc: "Set your preferred interface language", notifications: "Notification Settings", emailNotifs: "Email Notifications", emailDesc: "Receive summaries and task alerts via email", desktopAlerts: "Desktop Alerts", desktopDesc: "Show push notifications on your device", reset: "Reset to Defaults", save: "Save Changes", saveSuccess: "Settings saved successfully!",
    // Dashboard Core
    welcomeTitle: "Welcome back, Jeewantha! 👋", welcomeSubtitle1: "You have ", welcomeSubtitle2: " pending assignments", welcomeSubtitle3: " due within the next 48 hours.", welcomeGpa: "Your semester GPA is currently ", welcomeGpaEnd: " — keep up the great work!", viewExamSchedule: "View Exam Schedule", courseMaterials: "Course Materials",
    todaySchedule: "Today's Schedule", seeFull: "See Full", noEvents: "No events for today!", dragEvent: "(Drag an event to today in the Calendar to see it here)",
    pendingAssignments: "Pending Assignments", addNewTask: "+ Add New Task",
    semesterGoals: "Semester Goals", spring2026: "Spring 2026", currentGpa: "CURRENT GPA", credits: "CREDITS",
    // AddTaskModal
    addTaskTitle: "Add New Task", addTaskDesc: "Add details to create a new task.", taskNameLabel: "Task Name", taskNamePlaceholder: "Task Name", descLabel: "Description", descPlaceholder: "Description (e.g., Chapter 4 homework)", eventTypeLabel: "Event Type", eventTypeTask: "Personal Study (Task)", eventTypeExam: "Exam", eventTypeLecture: "Lecture / Class", targetGradeLabel: "Target Grade", priorityLabel: "Priority Level", priorityHigh: "High Priority", priorityMedium: "Medium Priority", priorityLow: "Low Priority", dateLabel: "Date", createTaskBtn: "Create Task", creatingBtn: "Creating...",
    // Exam Countdown
    allExams: "All Exams", upcoming: "Upcoming", completed: "Completed", targetGrade: "Target", timeRemaining: "Time Remaining", days: "DAYS", hours: "HOURS", mins: "MINS", secs: "SECS", editBtn: "Edit", deleteBtn: "Delete", studyTip: "Study Tip", studyTipDesc: "Active recall and spaced repetition are your best friends.", studyGroups: "Study Groups", studyGroupsDesc: "Join the active study group for your upcoming exams.", overallProgress: "Overall Progress", overallProgressDesc: "65% of course materials covered.", addExamBtn: "Add New Exam", deleteExamConfirmTitle: "Delete Exam?", deleteExamConfirmDesc: "Are you sure you want to delete this exam? This action cannot be undone.", cancelBtn: "Cancel", deleteConfirmBtn: "Yes, Delete",
    // Task Management
    todo: "To Do", inProgress: "In Progress", done: "Done", taskManagerDesc: "Organize your academic tasks efficiently.",
    // Personal Library
    libraryTitle: "Personal Library", libraryDesc: "All your study materials in one place.", uploadBtn: "Upload Material", folders: "Folders", recentFiles: "Recent Files", size: "Size",
    // Study Tools
    studyToolsTitle: "Study Tools", studyToolsSubtitle: "Powerful tools to boost your productivity and focus.", focusTimer: "Focus Timer", flashcards: "Smart Flashcards", studyPlan: "Study Plan Generator", academicAnalytics: "Academic Analytics", examCountdown: "Exam Countdown",
    flashcardsDesc: "Spaced-repetition systems that adapt to your specific learning pace.", focusTimerDesc: "Pomodoro techniques and LoFi audio to keep you in the deep work zone.", academicAnalyticsDesc: "Visual feedback on your study patterns and grade projections.", libraryDesc2: "High-end file management for your academic resources.", examCountdownDesc: "Stay ahead with smart, color-coded urgency timers for major exams.", studyPlanDesc: "Transform your course materials into a structured academic schedule tailored to your pace and goals."
  },
  si: {
    dashboard: "උපකරණ පුවරුව", tasks: "කාර්යයන්", calendar: "දින දර්ශනය", studyTools: "අධ්‍යයන මෙවලම්", aiAssistant: "AI සහායකයා", settings: "සැකසුම්", searchPlaceholder: "සොයන්න...",
    systemPrefs: "පද්ධති සැකසුම්", sysDesc: "ඔබ CampusMatrix භාවිතා කරන ආකාරය සකසන්න.", appearance: "පෙනුම සහ අත්දැකීම", darkMode: "අඳුරු තේමාව", darkDesc: "ආලෝක සහ අඳුරු තේමා අතර මාරු වන්න", primaryLang: "ප්‍රධාන භාෂාව", langDesc: "ඔබ කැමති භාෂාව තෝරන්න", notifications: "දැනුම්දීම් සැකසුම්", emailNotifs: "විද්‍යුත් තැපැල් දැනුම්දීම්", emailDesc: "ඊමේල් හරහා දැනුම්දීම් ලබා ගන්න", desktopAlerts: "ඩෙස්ක්ටොප් දැනුම්දීම්", desktopDesc: "ඔබේ උපාංගයේ දැනුම්දීම් පෙන්වන්න", reset: "යළි පිහිටුවන්න", save: "සුරකින්න", saveSuccess: "සැකසුම් සාර්ථකව සුරැකිණි!",
    // Dashboard Core
    welcomeTitle: "නැවත සාදරයෙන් පිළිගනිමු, ජිවන්ත! 👋", welcomeSubtitle1: "ඉදිරි පැය 48 තුළ සම්පූර්ණ කළ යුතු ", welcomeSubtitle2: " පවරා ඇති කාර්යයන් ", welcomeSubtitle3: " ක් ඇත.", welcomeGpa: "ඔබගේ වත්මන් GPA අගය ", welcomeGpaEnd: " වේ — විශිෂ්ටයි!", viewExamSchedule: "විභාග කාලසටහන බලන්න", courseMaterials: "පාඨමාලා ද්‍රව්‍ය",
    todaySchedule: "අද කාලසටහන", seeFull: "සම්පූර්ණ බලන්න", noEvents: "අද දිනය සඳහා සිදුවීම් නොමැත!", dragEvent: "(මෙය දැකීමට දින දර්ශනයෙන් සිදුවීමක් අද දිනයට අදින්න)",
    pendingAssignments: "පොරොත්තු කාර්යයන්", addNewTask: "+ නව කාර්යයක් එක් කරන්න",
    semesterGoals: "අර්ධ වාර්ෂික අරමුණු", spring2026: "වසන්ත 2026", currentGpa: "වත්මන් GPA", credits: "ක්‍රෙඩිට්",
    // AddTaskModal
    addTaskTitle: "නව කාර්යයක් එක් කරන්න", addTaskDesc: "නව කාර්යයක් සෑදීමට විස්තර එක් කරන්න.", taskNameLabel: "කාර්යයේ නම", taskNamePlaceholder: "කාර්යයේ නම", descLabel: "විස්තරය", descPlaceholder: "විස්තරය (උදා: පරිච්ඡේදය 4 ගෙදර වැඩ)", eventTypeLabel: "සිදුවීම් වර්ගය", eventTypeTask: "පුද්ගලික අධ්‍යයනය (කාර්යය)", eventTypeExam: "විභාගය", eventTypeLecture: "දේශනය / පන්තිය", targetGradeLabel: "ඉලක්කගත ශ්‍රේණිය", priorityLabel: "ප්‍රමුඛතා මට්ටම", priorityHigh: "ඉහළ ප්‍රමුඛතාව", priorityMedium: "මධ්‍යම ප්‍රමුඛතාව", priorityLow: "අඩු ප්‍රමුඛතාව", dateLabel: "දිනය", createTaskBtn: "කාර්යය සාදන්න", creatingBtn: "සාදමින්...",
    // Exam Countdown
    allExams: "සියලුම විභාග", upcoming: "ඉදිරි", completed: "අවසන් කළ", targetGrade: "ඉලක්කය", timeRemaining: "ඉතිරි කාලය", days: "දින", hours: "පැය", mins: "මිනිත්තු", secs: "තත්පර", editBtn: "සංස්කරණය", deleteBtn: "මකන්න", studyTip: "අධ්‍යයන ඉඟිය", studyTipDesc: "ක්‍රියාකාරී මතක තබා ගැනීම සහ කාලාන්තර පුනරාවර්තනය ඔබේ හොඳම මිතුරන් වේ.", studyGroups: "අධ්‍යයන කණ්ඩායම්", studyGroupsDesc: "ඔබගේ ඉදිරි විභාග සඳහා සක්‍රීය අධ්‍යයන කණ්ඩායමට එක්වන්න.", overallProgress: "සමස්ත ප්‍රගතිය", overallProgressDesc: "පාඨමාලා ද්‍රව්‍යවලින් 65%ක් ආවරණය කර ඇත.", addExamBtn: "නව විභාගයක් එක් කරන්න", deleteExamConfirmTitle: "විභාගය මකා දමන්නද?", deleteExamConfirmDesc: "ඔබට මෙම විභාගය මකා දැමීමට අවශ්‍ය බව විශ්වාසද? මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.", cancelBtn: "අවලංගු කරන්න", deleteConfirmBtn: "ඔව්, මකන්න",
    // Task Management
    todo: "කළ යුතු", inProgress: "සිදුවෙමින් පවතී", done: "අවසන්", taskManagerDesc: "ඔබේ අධ්‍යයන කාර්යයන් කාර්යක්ෂමව සංවිධානය කරන්න.",
    // Personal Library
    libraryTitle: "පුද්ගලික පුස්තකාලය", libraryDesc: "ඔබේ සියලුම අධ්‍යයන ද්‍රව්‍ය එකම තැනක.", uploadBtn: "ද්‍රව්‍ය උඩුගත කරන්න", folders: "ලිපිගොනු", recentFiles: "මෑත ගොනු", size: "ප්‍රමාණය",
    // Study Tools
    studyToolsTitle: "අධ්‍යයන මෙවලම්", studyToolsSubtitle: "ඔබේ ඵලදායිතාව සහ අවධානය වැඩි කිරීම සඳහා ප්‍රබල මෙවලම්.", focusTimer: "අවධානය ටයිමරය", flashcards: "ස්මාර්ට් ෆ්ලෑෂ් කාඩ්පත්", studyPlan: "අධ්‍යයන සැලසුම් උත්පාදකය", academicAnalytics: "ශාස්ත්‍රීය විශ්ලේෂණ", examCountdown: "විභාග ගණන් කිරීම",
    flashcardsDesc: "ඔබේ ඉගෙනුම් වේගයට අනුවර්තනය වන පරතර පුනරාවර්තන පද්ධති.", focusTimerDesc: "ඔබව ගැඹුරු වැඩ කලාපයක තබා ගැනීමට Pomodoro ශිල්පක්‍රම සහ LoFi ශ්‍රව්‍ය.", academicAnalyticsDesc: "ඔබේ අධ්‍යයන රටා සහ ශ්‍රේණි ප්‍රක්ෂේපණ පිළිබඳ දෘශ්‍ය ප්‍රතිපෝෂණ.", libraryDesc2: "ඔබේ අධ්‍යයන සම්පත් සඳහා ඉහළ මට්ටමේ ගොනු කළමනාකරණය.", examCountdownDesc: "ප්‍රධාන විභාග සඳහා ස්මාර්ට්, වර්ණ සංකේතාත්මක හදිසි ටයිමර් සමඟ ඉදිරියෙන් සිටින්න.", studyPlanDesc: "ඔබේ පාඨමාලා ද්‍රව්‍ය ඔබේ වේගයට සහ අරමුණු වලට සරිලන පරිදි ව්‍යුහගත අධ්‍යයන කාලසටහනක් බවට පරිවර්තනය කරන්න."
  },
  ta: {
    dashboard: "டாஷ்போர்டு", tasks: "பணிகள்", calendar: "நாள்காட்டி", studyTools: "ஆய்வு கருவிகள்", aiAssistant: "AI உதவியாளர்", settings: "அமைப்புகள்", searchPlaceholder: "தேடல்...",
    systemPrefs: "கணினி அமைப்புகள்", sysDesc: "க্যাম্পஸ் மேட்ரிக்ஸ் தளத்தை நீங்கள் எவ்வாறு பயன்படுத்துகிறீர்கள் என்பதை உள்ளமைக்கவும்.", appearance: "தோற்றம் மற்றும் அனுபவம்", darkMode: "இருண்ட பயன்முறை", darkDesc: "ஒளி மற்றும் இருண்ட கருப்பொருள்களுக்கு இடையில் மாறுக", primaryLang: "முதன்மை மொழி", langDesc: "உங்கள் விருப்பமான மொழியை அமைக்கவும்", notifications: "அறிவிப்பு அமைப்புகள்", emailNotifs: "மின்னஞ்சல் அறிவிப்புகள்", emailDesc: "மின்னஞ்சல் வழியாக சுருக்கங்களைப் பெறுங்கள்", desktopAlerts: "டெஸ்க்டாப் விழிப்பூட்டல்கள்", desktopDesc: "உங்கள் சாதனத்தில் அறிவிப்புகளைக் காட்டு", reset: "இயல்புநிலைக்கு மீட்டமை", save: "மாற்றங்களை சேமிக்கவும்", saveSuccess: "அமைப்புகள் சேமிக்கப்பட்டன!",
    // Dashboard Core
    welcomeTitle: "மீண்டும் வருக, ஜீவந்த! 👋", welcomeSubtitle1: "அடுத்த 48 மணிநேரத்தில் முடிக்க வேண்டிய ", welcomeSubtitle2: " பணிகள் ", welcomeSubtitle3: " உள்ளன.", welcomeGpa: "உங்கள் தற்போதைய GPA ", welcomeGpaEnd: " ஆகும் — சிறப்பாக செயல்படுகிறீர்கள்!", viewExamSchedule: "தேர்வு அட்டவணையைப் காண்க", courseMaterials: "பாடக் குறிப்புகள்",
    todaySchedule: "இன்றைய அட்டவணை", seeFull: "முழுமையாகக் காண்க", noEvents: "இன்று நிகழ்வுகள் எதுவும் இல்லை!", dragEvent: "(இதைக் காண ஒரு நிகழ்வை நாள்காட்டியிலிருந்து இன்றுக்கு இழுக்கவும்)",
    pendingAssignments: "நிலுவையிலுள்ள பணிகள்", addNewTask: "+ புதிய பணியைச் சேர்",
    semesterGoals: "பருவக்கால இலக்குகள்", spring2026: "வசந்தம் 2026", currentGpa: "தற்போதைய GPA", credits: "கிரெடிட்",
    // AddTaskModal
    addTaskTitle: "புதிய பணியைச் சேர்", addTaskDesc: "புதிய பணியை உருவாக்க விவரங்களைச் சேர்க்கவும்.", taskNameLabel: "பணியின் பெயர்", taskNamePlaceholder: "பணியின் பெயர்", descLabel: "விளக்கம்", descPlaceholder: "விளக்கம் (எ.கா: அத்தியாயம் 4 வீட்டுப்பாடம்)", eventTypeLabel: "நிகழ்வு வகை", eventTypeTask: "தனிப்பட்ட ஆய்வு (பணி)", eventTypeExam: "தேர்வு", eventTypeLecture: "விரிவுரை / வகுப்பு", targetGradeLabel: "இலக்கு தரம்", priorityLabel: "முன்னுரிமை நிலை", priorityHigh: "அதிக முன்னுரிமை", priorityMedium: "நடுத்தர முன்னுரிமை", priorityLow: "குறைந்த முன்னுரிமை", dateLabel: "தேதி", createTaskBtn: "பணியை உருவாக்கு", creatingBtn: "உருவாக்கப்படுகிறது...",
    // Exam Countdown
    allExams: "அனைத்து தேர்வுகள்", upcoming: "வரவிருக்கும்", completed: "முடிந்தது", targetGrade: "இலக்கு", timeRemaining: "மீதமுள்ள நேரம்", days: "நாட்கள்", hours: "மணி", mins: "நிமிடம்", secs: "விநாடி", editBtn: "திருத்து", deleteBtn: "நீக்கு", studyTip: "படிப்புக் குறிப்பு", studyTipDesc: "செயலூக்கமான நினைவுகூருதல் மற்றும் இடைவெளி পুনরাবৃত্তি உங்கள் சிறந்த நண்பர்கள்.", studyGroups: "ஆய்வுக் குழுக்கள்", studyGroupsDesc: "உங்கள் வரவிருக்கும் தேர்வுகளுக்கான செயலில் உள்ள ஆய்வுக் குழுவில் சேரவும்.", overallProgress: "ஒட்டுமொத்த முன்னேற்றம்", overallProgressDesc: "படிப்புகளில் 65% முடிக்கப்பட்டுள்ளது.", addExamBtn: "புதிய தேர்வைச் சேர்", deleteExamConfirmTitle: "தேர்வை நீக்கவா?", deleteExamConfirmDesc: "இந்தத் தேர்வை நீக்க விரும்புகிறீர்களா? இதை செயல்தவிர்க்க முடியாது.", cancelBtn: "ரத்துசெய்", deleteConfirmBtn: "ஆம், நீக்கு",
    // Task Management
    todo: "செய்ய வேண்டியவை", inProgress: "செயலிலுள்ளது", done: "முடிந்தது", taskManagerDesc: "உங்கள் கல்வி பணிகளை திறமையாக ஒழுங்கமைக்கவும்.",
    // Personal Library
    libraryTitle: "தனிப்பட்ட நூலகம்", libraryDesc: "உங்கள் அனைத்து ஆய்வுப் பொருட்களும் ஒரே இடத்தில்.", uploadBtn: "பொருளைப் பதிவேற்று", folders: "கோப்புறைகள்", recentFiles: "சமீபத்திய கோப்புகள்", size: "அளவு",
    // Study Tools
    studyToolsTitle: "ஆய்வு கருவிகள்", studyToolsSubtitle: "உங்கள் உற்பத்தித்திறன் மற்றும் கவனத்தை அதிகரிக்க சக்திவாய்ந்த கருவிகள்.", focusTimer: "கவன நேரமாக்கி", flashcards: "ஸ்மார்ட் ஃபிளாஷ் கார்டுகள்", studyPlan: "ஆய்வுத் திட்ட உருவாக்கி", academicAnalytics: "கல்வி பகுப்பாய்வு", examCountdown: "தேர்வு கவுண்ட்டவுன்",
    flashcardsDesc: "உங்கள் குறிப்பிட்ட கற்றல் வேகத்திற்கு ஏற்ப இடைவெளி-மறுபடியும் சொல்லும் அமைப்புகள்.", focusTimerDesc: "போமோடோரோ நுட்பங்கள் மற்றும் லோஃபை ஆடியோ உங்களை ஆழ்ந்த வேலை மண்டலத்தில் வைத்திருக்க.", academicAnalyticsDesc: "உங்கள் ஆய்வு முறைகள் மற்றும் தர கணிப்புகளின் காட்சி பின்னூட்டம்.", libraryDesc2: "உங்கள் கல்வி வளங்களுக்கான உயர்தர கோப்பு மேலாண்மை.", examCountdownDesc: "முக்கிய தேர்வுகளுக்கான ஸ்மார்ட், வண்ண-குறியிடப்பட்ட அவசர டைமர்களுடன் முன்னே இருங்கள்.", studyPlanDesc: "உங்கள் பாடக் குறிப்புகளை உங்கள் வேகம் மற்றும் இலக்குகளுக்கு ஏற்ப கட்டமைக்கப்பட்ட கல்வி அட்டவணையாக மாற்றவும்."
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