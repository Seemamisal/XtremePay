import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FiCheck, FiX, FiDownload, FiUser } from 'react-icons/fi';

const AdminOnboardingReview = () => {
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchPendingOnboardings = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, 'onboardings'), 
          where('status', '==', 'pending_review')
        );
        const onboardingsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOnboardings(onboardingsList);
      } catch (error) {
        console.error('Error fetching onboardings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOnboardings();
  }, []);

  const completeOnboarding = async (userId, approved) => {
    try {
      const onboardingRef = doc(db, 'onboardings', userId);
      await updateDoc(onboardingRef, {
        status: approved ? 'approved' : 'rejected',
        reviewedAt: new Date()
      });

      // Call admin API (mock implementation)
      await fetch('/api/admin/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          status: approved ? 'approved' : 'rejected'
        })
      });

      setOnboardings(prev => prev.filter(item => item.id !== userId));
      alert(`Onboarding ${approved ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating onboarding:', error);
      alert('Failed to update onboarding status.');
    }
  };

  const documentTypes = [
    { id: 'id_proof', label: 'ID Proof' },
    { id: 'address_proof', label: 'Address Proof' },
    { id: 'pan_card', label: 'PAN Card' },
    { id: 'bank_statement', label: 'Bank Statement' },
  ];

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title">Pending Onboarding Reviews</h2>
      
      {onboardings.length === 0 ? (
        <p className="empty-state">No pending onboardings to review.</p>
      ) : (
        <div className="onboarding-list">
          {onboardings.map(onboarding => (
            <div 
              key={onboarding.id} 
              className={`onboarding-item ${selectedUser === onboarding.id ? 'selected' : ''}`}
              onClick={() => setSelectedUser(onboarding.id)}
            >
              <div className="user-header">
                <FiUser className="user-icon" />
                <span className="user-id">{onboarding.userId}</span>
                <span className="date">
                  Submitted: {new Date(onboarding.createdAt).toLocaleDateString()}
                </span>
              </div>

              {selectedUser === onboarding.id && (
                <div className="documents-container">
                  <h3 className="documents-title">Uploaded Documents</h3>
                  <div className="documents-grid">
                    {documentTypes.map(docType => (
                      <div key={docType.id} className="document-card">
                        <h4 className="document-type">{docType.label}</h4>
                        {onboarding.documents[docType.id] ? (
                          <>
                            {onboarding.documents[docType.id].includes('.pdf') ? (
                              <div className="pdf-preview">
                                <FiFile className="file-icon" />
                                <a 
                                  href={onboarding.documents[docType.id]} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="download-link"
                                >
                                  <FiDownload /> Download
                                </a>
                              </div>
                            ) : (
                              <img 
                                src={onboarding.documents[docType.id]} 
                                alt={docType.label} 
                                className="document-image"
                              />
                            )}
                          </>
                        ) : (
                          <div className="missing-doc">Not Provided</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="action-buttons">
                    <button 
                      onClick={() => completeOnboarding(onboarding.id, false)}
                      className="reject-btn"
                    >
                      <FiX /> Reject
                    </button>
                    <button 
                      onClick={() => completeOnboarding(onboarding.id, true)}
                      className="approve-btn"
                    >
                      <FiCheck /> Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .admin-title {
          font-size: 1.5rem;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .loading-spinner {
          text-align: center;
          padding: 2rem;
          color: #718096;
        }

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: #718096;
          background: #f7fafc;
          border-radius: 8px;
        }

        .onboarding-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .onboarding-item {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .onboarding-item:hover {
          border-color: #cbd5e0;
        }

        .onboarding-item.selected {
          border-color: #4299e1;
          box-shadow: 0 0 0 1px #4299e1;
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-icon {
          color: #718096;
        }

        .user-id {
          font-weight: 500;
          flex-grow: 1;
        }

        .date {
          color: #718096;
          font-size: 0.875rem;
        }

        .documents-container {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f4f8;
        }

        .documents-title {
          font-size: 1.125rem;
          color: #4a5568;
          margin-bottom: 1rem;
        }

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .document-card {
          background: #f7fafc;
          border-radius: 6px;
          padding: 1rem;
        }

        .document-type {
          font-size: 0.875rem;
          color: #4a5568;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .document-image {
          max-width: 100%;
          max-height: 200px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .pdf-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
        }

        .file-icon {
          font-size: 2rem;
          color: #e53e3e;
        }

        .download-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4299e1;
          text-decoration: none;
        }

        .download-link:hover {
          text-decoration: underline;
        }

        .missing-doc {
          color: #e53e3e;
          font-size: 0.875rem;
          font-style: italic;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .approve-btn, .reject-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .approve-btn {
          background: #38a169;
          color: white;
        }

        .approve-btn:hover {
          background: #2f855a;
        }

        .reject-btn {
          background: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fed7d7;
        }

        .reject-btn:hover {
          background: #fed7d7;
        }
      `}</style>
    </div>
  );
};

export default AdminOnboardingReview;