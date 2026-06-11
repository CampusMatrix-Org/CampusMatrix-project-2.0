/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AdminContext = createContext();

const fallbackAdminData = {
  fullName: 'R M T A P Kumara',
  email: 'admin@campusmatrix.edu',
  role: 'System Administrator',
  bio: 'Lead System Administrator ensuring seamless operations, security, and database management for CampusMatrix.',
  profilePhoto: null
};

export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin/profile');
        setAdminData(response.data);
      } catch (error) {
        console.warn('Failed to fetch admin profile. Using fallback.', error);
        setAdminData(fallbackAdminData);
      }
    };
    fetchAdminData();
  }, []);

  const updateAdminData = async (newData) => {
    try {
      await api.put('/admin/profile', newData);
      setAdminData(newData);
    } catch (error) {
      console.warn('Failed to update admin profile in API. Updating locally.', error);
      setAdminData(newData);
    }
  };

  return (
    <AdminContext.Provider value={{ adminData: adminData || fallbackAdminData, updateAdminData, isMobileMenuOpen, setIsMobileMenuOpen }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
