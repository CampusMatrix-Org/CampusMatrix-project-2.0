import React, { useState, useMemo, useEffect } from 'react';
import './StudentManagementPage.css';
import api from '../services/api';

// Admin Components Import
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const fallbackStudents = [
  { id: 1, name: 'Alice Johnson', initials: 'AJ', email: 'alice.j@example.com', studentId: 'STU001', joinDate: 'Aug 12, 2023', status: 'Active' },
  { id: 2, name: 'Bob Smith', initials: 'BS', email: 'bob.smith@example.com', studentId: 'STU002', joinDate: 'Sep 05, 2023', status: 'Active' },
  { id: 3, name: 'Charlie Davis', initials: 'CD', email: 'c.davis@example.com', studentId: 'STU003', joinDate: 'Jan 15, 2024', status: 'Inactive' },
  { id: 4, name: 'Diana Prince', initials: 'DP', email: 'diana.p@example.com', studentId: 'STU004', joinDate: 'Oct 20, 2023', status: 'Active' },
  { id: 5, name: 'Ethan Hunt', initials: 'EH', email: 'ethan.h@example.com', studentId: 'STU005', joinDate: 'Nov 11, 2023', status: 'Active' },
];

const StudentManagementPage = () => {
  // Application States
  const [studentsList, setStudentsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete', 'filter', null
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Filter States
  const [filterStatus, setFilterStatus] = useState('all');
  const [tempFilterStatus, setTempFilterStatus] = useState('all'); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calendar States
  const [calendarOpenFor, setCalendarOpenFor] = useState(null);
  const [startDate, setStartDate] = useState('mm/dd/yyyy');
  const [endDate, setEndDate] = useState('mm/dd/yyyy');
  const [tempSelectedDay, setTempSelectedDay] = useState(5);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/admin/students');
        setStudentsList(response.data || []);
      } catch (error) {
        console.warn('Failed to fetch students. Using fallback.', error);
        setStudentsList(fallbackStudents);
      }
    };
    fetchStudents();
  }, []);


  // Handle Search and Filtering
  const filteredStudents = useMemo(() => {
    return studentsList.filter(student => {
      // Search Logic (by Name, ID, or Email)
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter Logic (Status)
      const matchesStatus = filterStatus === 'all' || student.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [studentsList, searchQuery, filterStatus]);

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 when filters or search change
  useMemo(() => { setCurrentPage(1); }, [searchQuery, filterStatus]);

  // Modal Handlers
  const openModal = (type, student = null) => {
    setSelectedStudent(student);
    setModalType(type);
    
    if (type === 'edit' && student) {
      setFormData({ name: student.name, email: student.email });
    } else {
      setFormData({ name: '', email: '' });
    }

    if (type === 'filter') {
      setTempFilterStatus(filterStatus);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedStudent(null);
    setFormData({ name: '', email: '' });
  };

  // Add / Edit Student Logic
  const handleSaveStudent = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    // Generate Initials
    const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    if (modalType === 'add') {
      const newId = studentsList.length > 0 ? Math.max(...studentsList.map(s => s.id)) + 1 : 1;
      const newStudentId = `STU00${newId}`;
      const newJoinDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

      const newStudent = {
        id: newId,
        name: formData.name,
        email: formData.email,
        initials: initials || 'ST',
        studentId: newStudentId,
        joinDate: newJoinDate,
        status: 'Active'
      };

      try {
        await api.post('/admin/students', newStudent);
        setStudentsList([newStudent, ...studentsList]);
      } catch (err) {
        console.warn('Failed to add student to API. Saving locally.', err);
        setStudentsList([newStudent, ...studentsList]);
      }
    } else if (modalType === 'edit') {
      const updatedStudent = { ...selectedStudent, name: formData.name, email: formData.email, initials: initials || 'ST' };
      try {
        await api.put(`/admin/students/${selectedStudent.id}`, updatedStudent);
        setStudentsList(studentsList.map(s => s.id === selectedStudent.id ? updatedStudent : s));
      } catch (err) {
        console.warn('Failed to update student in API. Saving locally.', err);
        setStudentsList(studentsList.map(s => s.id === selectedStudent.id ? updatedStudent : s));
      }
    }
    closeModal();
  };

  // Delete Student Logic
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/students/${selectedStudent.id}`);
      setStudentsList(studentsList.filter(s => s.id !== selectedStudent.id));
    } catch (err) {
      console.warn('Failed to delete student in API. Deleting locally.', err);
      setStudentsList(studentsList.filter(s => s.id !== selectedStudent.id));
    }
    closeModal();
  };

  // Apply Filters Logic
  const handleApplyFilters = () => {
    setFilterStatus(tempFilterStatus);
    closeModal();
  };

  // Export to CSV Logic
  const handleExport = () => {
    const headers = ['STUDENT ID,STUDENT NAME,EMAIL,JOIN DATE,STATUS'];
    const csvRows = filteredStudents.map(s => 
      `${s.studentId},"${s.name}","${s.email}","${s.joinDate}",${s.status}`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CampusMatrix_Students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calendar Handlers
  const handleDateSelect = () => {
    const formattedDate = `10/${tempSelectedDay < 10 ? '0'+tempSelectedDay : tempSelectedDay}/2023`;
    if (calendarOpenFor === 'start') setStartDate(formattedDate);
    if (calendarOpenFor === 'end') setEndDate(formattedDate);
    setCalendarOpenFor(null);
  };

  const renderCalendarDays = () => {
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(
        <span key={i} className={`cal-day ${tempSelectedDay === i ? 'active' : ''}`} onClick={() => setTempSelectedDay(i)}>
          {i}
        </span>
      );
    }
    return days;
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminHeader />
        
        <div className="page-content student-bg">
          <div className="admin-container">
            
            {/* Page Header */}
            <div className="student-page-header">
              <div>
                <h1>Student Management</h1>
                <p>Directory of all registered students in the academy.</p>
              </div>
           
              <button className="btn-orange-solid" onClick={() => openModal('add')} style={{ display: 'flex', alignItems: 'center' }}>
                <svg style={{ marginRight: '8px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Add New Student
              </button>
            </div>

            {/* Main Table Container */}
            <div className="student-table-container">
              
              {/* Search & Actions Row */}
              <div className="table-top-bar">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search by ID, Name, Email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="table-actions">
                  <button className={`btn-outline ${filterStatus !== 'all' ? 'active-filter' : ''}`} onClick={() => openModal('filter')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filters {filterStatus !== 'all' && `(${filterStatus})`}
                  </button>
                  <button className="btn-outline" onClick={handleExport}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="student-table">
                <thead>
                  <tr>
                    <th>STUDENT NAME</th>
                    <th>STUDENT ID</th>
                    <th>JOIN DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.length > 0 ? (
                    currentStudents.map(student => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-name-col">
                            <div className="student-avatar">{student.initials}</div>
                            <div>
                              <div className="s-name">{student.name}</div>
                              <div className="s-email">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="s-id">{student.studentId}</td>
                        <td className="s-date">{student.joinDate}</td>
                        <td>
                          <span className={`status-badge ${student.status.toLowerCase()}`}>
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button onClick={() => openModal('edit', student)} title="Edit">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button onClick={() => openModal('delete', student)} title="Delete">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        No students found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="pagination-bar">
                  <div className="page-info">
                    Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredStudents.length)}</strong> of <strong>{filteredStudents.length}</strong> total results
                  </div>
                  <div className="page-controls">
                    <button 
                      className={`page-nav ${currentPage === 1 ? 'disabled' : ''}`} 
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >&lt;</button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i+1} 
                        className={`page-num ${currentPage === i+1 ? 'active' : ''}`}
                        onClick={() => handlePageClick(i+1)}
                      >
                        {i+1}
                      </button>
                    ))}

                    <button 
                      className={`page-nav ${currentPage === totalPages ? 'disabled' : ''}`} 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >&gt;</button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    

      {/* 1. Add / Edit Student Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="sm-modal-overlay">
          <div className="sm-modal form-modal">
            <div className="sm-modal-header">
              <h3>{modalType === 'add' ? 'Add New Student' : 'Edit Student Details'}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="sm-modal-body">
              <p className="modal-subtitle">
                {modalType === 'add' ? 'Add details to add a new student.' : "Update details to change student's information."}
              </p>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@university.edu" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <button className="btn-orange-full mt-4" onClick={handleSaveStudent}>
                {modalType === 'add' ? 'Add Student' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {modalType === 'delete' && (
        <div className="sm-modal-overlay">
          <div className="sm-modal delete-modal">
            <h3>Are you sure you want to delete {selectedStudent?.name}?</h3>
            <div className="delete-actions">
              <button className="btn-orange-solid" onClick={handleDeleteConfirm}>YES</button>
              <button className="btn-outline" onClick={closeModal}>NO</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Students Modal */}
      {modalType === 'filter' && (
        <div className="sm-modal-overlay">
          <div className="sm-modal filter-modal">
            <div className="sm-modal-header">
              <h3>Filter Students</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="sm-modal-body">
              
              <div className="filter-group">
                <label>Status</label>
                <div className="toggle-group">
                  <button className={tempFilterStatus === 'all' ? 'active' : ''} onClick={() => setTempFilterStatus('all')}>All</button>
                  <button className={tempFilterStatus === 'active' ? 'active' : ''} onClick={() => setTempFilterStatus('active')}>Active</button>
                  <button className={tempFilterStatus === 'inactive' ? 'active' : ''} onClick={() => setTempFilterStatus('inactive')}>Inactive</button>
                </div>
              </div>

              <div className="filter-group">
                <label>Join Date Range (Demo)</label>
                <div className="date-range-inputs">
                  <div className="date-display" onClick={() => setCalendarOpenFor('start')}>{startDate}</div>
                  <div className="date-display" onClick={() => setCalendarOpenFor('end')}>{endDate}</div>
                </div>
              </div>

            </div>
            
            <div className="filter-footer">
              <button className="reset-btn" onClick={() => { setTempFilterStatus('all'); setStartDate('mm/dd/yyyy'); setEndDate('mm/dd/yyyy'); }}>Reset All</button>
              <button className="btn-orange-solid" onClick={handleApplyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Custom Calendar Popup */}
      {calendarOpenFor && (
        <div className="custom-cal-overlay" onClick={() => setCalendarOpenFor(null)}>
          <div className="custom-cal-container" onClick={e => e.stopPropagation()}>
            <div className="custom-cal-header">
              <button className="custom-cal-close" onClick={() => setCalendarOpenFor(null)}>✕</button>
              <span className="custom-cal-subtitle">SELECT A DATE</span>
              <div className="custom-cal-title-row">
                <h2>October 2023</h2>
                <div className="custom-cal-arrows"><span>&lt;</span><span>&gt;</span></div>
              </div>
            </div>
            <div className="custom-cal-body">
              <div className="cal-weekdays">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="cal-days-grid">{renderCalendarDays()}</div>
            </div>
            <div className="custom-cal-footer">
              <button className="cal-btn-cancel" onClick={() => setCalendarOpenFor(null)}>Cancel</button>
              <button className="cal-btn-select" onClick={handleDateSelect}>Select Date</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentManagementPage;