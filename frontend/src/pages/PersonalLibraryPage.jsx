import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './PersonalLibraryPage.css';

// --- Dummy Data ---
const initialFolders = [
  { id: 1, name: 'Semester 1', files: 42, size: '5.4 MB' },
  { id: 2, name: 'Mathematics', files: 16, size: '5.1 MB' },
  { id: 3, name: 'Physics', files: 28, size: '18.2 MB' },
  { id: 4, name: 'Computer Science', files: 31, size: '6.7 MB' }
];

const initialDocuments = [
  { id: 1, name: 'Calculus_Cheat_Sheet.pdf', size: '2.4 MB', modified: '2 hours ago', owner: 'Me', type: 'pdf' },
  { id: 2, name: 'Assignment_Draft_v2.docx', size: '842 KB', modified: 'Yesterday, 4:12 PM', owner: 'Me', type: 'word' },
  { id: 3, name: 'Lab_Experiment_Photo.png', size: '4.1 MB', modified: 'Oct 24, 2023', owner: 'Prof. Miller', type: 'image' },
  { id: 4, name: 'Thesis_Presentation.pptx', size: '12.8 MB', modified: 'Oct 21, 2023', owner: 'Me', type: 'powerpoint' }
];

function PersonalLibraryPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [viewMode, setViewMode] = useState('list'); 
  const [documents, setDocuments] = useState(initialDocuments);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  
  // Upload Files State (Dummy initial files to show UI)
  const [uploadFiles, setUploadFiles] = useState([
    { name: 'Chemistry_Notes.pdf', size: '2.4 MB' },
    { name: 'Lab_Report_v1.pdf', size: '1.1 MB' }
  ]);

  // --- Handlers ---
  const handleUploadClick = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const toggleMenu = (id) => {
    if (menuOpenId === id) setMenuOpenId(null);
    else setMenuOpenId(id);
  };

  const openDeleteModal = (doc) => {
    setDocToDelete(doc);
    setIsDeleteModalOpen(true);
    setMenuOpenId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDocToDelete(null);
  };

  const confirmDelete = () => {
    setDocuments(documents.filter(doc => doc.id !== docToDelete.id));
    closeDeleteModal();
  };

  // --- File Upload Handlers ---
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB'
      }));
      setUploadFiles([...uploadFiles, ...newFiles]);
    }
  };

  const removeUploadFile = (indexToRemove) => {
    setUploadFiles(uploadFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadSubmit = () => {
    // In a real app, send files to backend here.
    alert(`${uploadFiles.length} files uploaded successfully!`);
    setUploadFiles([]);
    closeUploadModal();
  };

  // Helper for icons
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📕';
      case 'word': return '📘';
      case 'powerpoint': return '📙';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        
        <div className="page-content">
          <div className="library-workspace">
            
            {/* Breadcrumbs */}
            <div className="study-breadcrumb">
              <span className="sb-link" onClick={() => navigate('/study-tools')}>Study Tools</span>
              <span className="sb-separator"> &gt; </span>
              <span className="sb-current">Personal Library</span>
            </div>

            <div className="library-content-area">
              {/* Left Column: Folders & Documents */}
              <div className="library-main-section">
                
                <div className="section-header">
                  <h3>Folders</h3>
                  <button className="view-all-btn">View all</button>
                </div>
                <div className="folders-grid">
                  {initialFolders.map(folder => (
                    <div className="folder-card" key={folder.id}>
                      <div className="folder-icon">📁</div>
                      <div className="folder-info">
                        <h4>{folder.name}</h4>
                        <p>{folder.files} files • {folder.size}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="section-header doc-header">
                  <h3>Recent Documents</h3>
                  <div className="doc-controls">
                    <span className="sort-label">Sort by: <select><option>Last Modified</option></select></span>
                  </div>
                </div>

                <div className="view-toggle-container">
                    <div className="view-toggles">
                      <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                      </button>
                      <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                      </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                  <div className="doc-list">
                    <div className="doc-list-header">
                      <div className="col-name">NAME</div>
                      <div className="col-size">SIZE</div>
                      <div className="col-modified">MODIFIED</div>
                      <div className="col-owner">OWNER</div>
                      <div className="col-actions">ACTIONS</div>
                    </div>
                    {documents.map(doc => (
                      <div className="doc-list-item" key={doc.id}>
                        <div className="col-name doc-name-wrap">
                          <span className="doc-icon">{getFileIcon(doc.type)}</span>
                          <span className="doc-name">{doc.name}</span>
                        </div>
                        <div className="col-size">{doc.size}</div>
                        <div className="col-modified">{doc.modified}</div>
                        <div className="col-owner">
                          {doc.owner === 'Me' ? <span className="owner-avatar me">Me</span> : <span className="owner-avatar other">PM</span>}
                          {doc.owner}
                        </div>
                        <div className="col-actions relative">
                          <button className="action-menu-btn" onClick={() => toggleMenu(doc.id)}>⋮</button>
                          {menuOpenId === doc.id && (
                            <div className="action-dropdown">
                              <button>Update</button>
                              <button onClick={() => openDeleteModal(doc)} className="delete-text">Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="doc-grid">
                    {documents.map(doc => (
                      <div className="doc-grid-card" key={doc.id}>
                         <div className="doc-grid-header">
                            <span className="doc-icon">{getFileIcon(doc.type)}</span>
                            <div className="relative">
                              <button className="action-menu-btn" onClick={() => toggleMenu(doc.id)}>⋮</button>
                              {menuOpenId === doc.id && (
                                <div className="action-dropdown">
                                  <button>Update</button>
                                  <button onClick={() => openDeleteModal(doc)} className="delete-text">Delete</button>
                                </div>
                              )}
                            </div>
                         </div>
                         <div className="doc-grid-body">
                            <h4 className="doc-name">{doc.name}</h4>
                            <p className="doc-meta">{doc.modified} • {doc.size}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Right Column: Labels & Storage */}
              <div className="library-side-section">
                <div className="labels-widget">
                  <h3>Labels</h3>
                  <ul className="labels-list">
                    <li><span className="label-dot orange"></span> Exam Notes</li>
                    <li><span className="label-dot blue"></span> Assignments</li>
                    <li><span className="label-dot green"></span> Projects</li>
                  </ul>
                </div>
              </div>
            </div>

            <button className="fab-button" onClick={handleUploadClick}>+</button>

          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      
      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="upload-modal-header">
              <h3>Upload Documents</h3>
              <button className="close-btn" onClick={closeUploadModal}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            <div className="upload-modal-body">
              <div className="upload-dropzone">
                <div className="dropzone-icon">☁️</div>
                <h4>Upload Zone</h4>
                <p>Drag and drop your files here or browse your computer</p>
                <p className="sub-text">Accepting PDF, DOCX, PPTX files up to 50MB</p>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  multiple 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                />
                <button className="browse-btn" onClick={handleBrowseClick}>Browse Files</button>
              </div>
              
              <div className="selected-files">
                <h4>Selected Files ({uploadFiles.length})</h4>
                {uploadFiles.length === 0 ? (
                  <p className="no-files-text">No files selected.</p>
                ) : (
                  <div className="files-scroll-area">
                    {uploadFiles.map((file, idx) => (
                      <div className="file-item" key={idx}>
                        <div className="file-info">
                          <span className="file-icon">📄</span>
                          <div>
                            <p className="f-name">{file.name}</p>
                            <p className="f-size">{file.size}</p>
                          </div>
                        </div>
                        <button className="remove-file-btn" onClick={() => removeUploadFile(idx)}>🗑️</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="upload-modal-footer">
              <button className="btn-cancel" onClick={closeUploadModal}>Cancel</button>
              <button className="btn-upload" onClick={handleUploadSubmit} disabled={uploadFiles.length === 0}>
                Upload Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Delete Document?</h3>
            <p>Are you sure you want to delete <strong>{docToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="del-btn del-cancel" onClick={closeDeleteModal}>Cancel</button>
              <button className="del-btn del-confirm" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PersonalLibraryPage;