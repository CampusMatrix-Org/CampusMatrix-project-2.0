/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState({
    fullName: 'R M T A P Kumara',
    email: 'admin@campusmatrix.edu',
    role: 'System Administrator',
    bio: 'Lead System Administrator ensuring seamless operations, security, and database management for CampusMatrix.',
    profilePhoto: null
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateAdminData = (newData) => {
    setAdminData(newData);
  };

  return (
    <AdminContext.Provider value={{ adminData, updateAdminData, isMobileMenuOpen, setIsMobileMenuOpen }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
