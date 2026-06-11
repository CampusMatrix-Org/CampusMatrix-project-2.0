import React, { useState, useMemo, useEffect } from 'react';
import './ResourceModerationPage.css';
import api from '../services/api';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const fallbackResources = [
  { id: 1, title: 'CS101 Midterm Masterclass', type: 'PDF', uploader: 'Alex Rivera', initials: 'AR', color: '#E6B89C', time: '2 hours ago', status: 'pending', size: '2.4 MB', date: 'Oct 12, 2023', icon: '📄' },
  { id: 2, title: 'Organic Chemistry Reactions', type: 'FLASHCARDS', uploader: 'Sarah Chen', initials: 'SC', color: '#E6D7C3', time: '5 hours ago', status: 'pending', size: '1.1 MB', date: 'Oct 12, 2023', icon: '📇' },
  { id: 3, title: 'Macroeconomics Summary', type: 'DOC', uploader: 'Mike Johnson', initials: 'MJ', color: '#4A6C6F', time: 'Yesterday', status: 'flagged', size: '500 KB', date: 'Oct 11, 2023', icon: '📝' },
  { id: 4, title: 'Linear Algebra Quiz Bank', type: 'PDF', uploader: 'Emily Davis', initials: 'ED', color: '#E29578', time: '2 days ago', status: 'pending', size: '3.2 MB', date: 'Oct 10, 2023', icon: '📄' },
];

const ResourceModerationPage = () => {
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [modalType, setModalType] = useState(null); // 'view', 'delete', 'filter'
  const [selectedRes, setSelectedRes] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Logical Filtering
  const displayedResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.uploader.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' ? true : res.status === 'pending';
      return matchesSearch && matchesTab;
    });
  }, [resources, activeTab, searchQuery]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/admin/resources');
        setResources(response.data || []);
      } catch (err) {
        console.warn('Failed to fetch resources. Using fallback.', err);
        setResources(fallbackResources);
      }
    };
    fetchResources();
  }, []);

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = displayedResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedResources.length / itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 when filters or tabs change
  useMemo(() => { setCurrentPage(1); }, [searchQuery, activeTab]);

  // Actions
  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/resources/${id}/status`, { status: 'approved' });
      setResources(resources.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    } catch (err) {
      console.warn('Failed to approve resource in API. Approving locally.', err);
      setResources(resources.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    }
    if (modalType === 'view') setModalType(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Deleting works similarly to rejecting in this context
      await api.put(`/admin/resources/${selectedRes.id}/status`, { status: 'rejected' });
      setResources(resources.filter(r => r.id !== selectedRes.id));
    } catch (err) {
      console.warn('Failed to delete resource in API. Deleting locally.', err);
      setResources(resources.filter(r => r.id !== selectedRes.id));
    }
    setModalType(null);
    setSelectedRes(null);
  };

  const openModal = (type, resource = null) => {
    setSelectedRes(resource);
    setModalType(type);
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminHeader />
        
        <div className="page-content resource-bg">
          <div className="admin-container">
            
            {/* Header & Search/Filter Row */}
            <div className="res-header-row">
              <div className="res-titles">
                <h1>Resource Moderation</h1>
                <p>Monitor and manage the quality of shared educational materials.</p>
              </div>
              <div className="res-actions">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search resources..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="btn-orange-solid" onClick={() => openModal('filter')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  <span style={{marginLeft: '6px'}}>Filters</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="res-tabs">
              <button className={`res-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Resources</button>
              <button className={`res-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending Review</button>
            </div>

            {/* Resources Grid */}
            <div className="res-grid">
              {currentResources.map(res => (
                <div className="res-card" key={res.id}>
                  {/* Card Preview Area (Clickable to view) */}
                  <div className="res-preview" onClick={() => openModal('view', res)}>
                    <span className="preview-icon">{res.icon}</span>
                    <span className="preview-tag">{res.type}</span>
                  </div>
                  
                  {/* Card Info */}
                  <div className="res-info">
                    <div className="res-title-row">
                      <h3 className="res-title" onClick={() => openModal('view', res)}>{res.title.length > 22 ? res.title.substring(0,22)+'...' : res.title}</h3>
                      <span className="type-badge">{res.type}</span>
                    </div>
                    
                    <div className="res-uploader">
                      <div className="up-avatar" style={{backgroundColor: res.color}}>{res.initials}</div>
                      <div>
                        <div className="up-name">{res.uploader}</div>
                        <div className="up-time">{res.time}</div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="res-card-actions">
                      {res.status === 'pending' ? (
                        <>
                          <button className="btn-approve" onClick={() => handleApprove(res.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Approve
                          </button>
                          <button className="btn-delete-icon" onClick={() => openModal('delete', res)}>
                            🗑️
                          </button>
                        </>
                      ) : (
                        <button className="btn-outline-full">Move to Flagged</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* End of Flagged List Placeholder (Only in 'All' tab to match UI) */}
              {activeTab === 'all' && (
                <div className="res-card placeholder-card">
                  <div className="placeholder-content">
                    <div className="dots">•••</div>
                    <p>End of flagged list</p>
                    <button className="text-btn-orange">View Archived</button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="pagination-bar" style={{marginTop: '30px', background: 'transparent', padding: '0'}}>
                <div className="page-info">
                  Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, displayedResources.length)}</strong> of <strong>{displayedResources.length}</strong> total resources
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

  

      {/* 1. Delete Confirmation Modal */}
      {modalType === 'delete' && (
        <div className="rm-modal-overlay">
          <div className="rm-modal delete-modal">
            <h3>Are You Sure Delete this ?</h3>
            <div className="delete-actions">
              <button className="btn-orange-solid" onClick={handleDeleteConfirm}>YES</button>
              <button className="btn-orange-solid" onClick={() => setModalType(null)}>NO</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Document Overview Modal */}
      {modalType === 'view' && selectedRes && (
        <div className="rm-modal-overlay">
          <div className="rm-modal doc-modal">
            
            <div className="doc-modal-header">
              <div className="doc-title-area">
                <span style={{color: '#E64A19', fontSize: '18px'}}>{selectedRes.icon}</span>
                <h2>{selectedRes.title}.{selectedRes.type.toLowerCase()}</h2>
              </div>
              <div className="doc-header-actions">
                <button className="btn-outline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E64A19" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span style={{color: '#E64A19', marginLeft: '6px', fontWeight: '600'}}>Download</span>
                </button>
                <button className="close-btn" onClick={() => setModalType(null)}>✕</button>
              </div>
            </div>

            <div className="doc-modal-body">
              {/* Left: Document Preview */}
              <div className="doc-preview-area">
                <div className="fake-doc">
                  <div className="fake-line title"></div>
                  <div className="fake-line"></div>
                  <div className="fake-line"></div>
                  <div className="fake-line"></div>
                  <div className="fake-image-box">
                    <span>🖼️</span>
                    <p>Diagram: Central Processing Unit Architecture</p>
                  </div>
                  <div className="fake-line"></div>
                  <div className="fake-line w-70"></div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="doc-details-area">
                <h4 className="detail-heading">RESOURCE DETAILS</h4>
                
                <div className="detail-item">
                  <span className="detail-label">Uploader</span>
                  <div className="up-avatar-small-row">
                    <div className="up-avatar small" style={{backgroundColor: selectedRes.color}}>{selectedRes.initials}</div>
                    <span className="detail-value">{selectedRes.uploader}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Upload Date</span>
                  <span className="detail-value">{selectedRes.date}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">File Size</span>
                  <span className="detail-value">{selectedRes.size}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Format</span>
                  <span className="detail-value">{selectedRes.type} Document</span>
                </div>
              </div>
            </div>

            <div className="doc-modal-footer">
              <button className="btn-outline-red" onClick={() => openModal('delete', selectedRes)}>Reject</button>
              <button className="btn-orange-solid" onClick={() => handleApprove(selectedRes.id)}>Approve Resource</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ResourceModerationPage;