import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState({
    fullName: 'H M N R Nisitha',
    email: 'admin@campusmatrix.edu',
    role: 'System Administrator',
    bio: 'Lead System Administrator ensuring seamless operations, security, and database management for CampusMatrix.',
    profilePhoto: null 
  });

  const updateAdminData = (newData) => {
    setAdminData(newData);
  };

  return (
    <AdminContext.Provider value={{ adminData, updateAdminData }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);