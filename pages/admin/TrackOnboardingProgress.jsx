import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRouter } from 'next/router';

const TrackOnboardingProgress = () => {
  const [onboardings, setOnboardings] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchOnboardings = async () => {
      try {
        const q = query(
          collection(db, 'onboardings'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const onboardingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to JS Date
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));
        setOnboardings(onboardingsData);
      } catch (error) {
        console.error('Error fetching onboardings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnboardings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'onboardings', id), {
        status: 'approved',
        updatedAt: new Date(),
        step: 'admin_reviewed'
      });

      setOnboardings(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'approved' } : item
        )
      );
      setSuccessMessage('Onboarding approved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error approving onboarding:', error);
      alert('Error approving onboarding. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, 'onboardings', id), {
        status: 'rejected',
        updatedAt: new Date(),
        step: 'admin_reviewed'
      });

      setOnboardings(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: 'rejected' } : item
        )
      );
      setSuccessMessage('Onboarding rejected successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error rejecting onboarding:', error);
      alert('Error rejecting onboarding. Please try again.');
    }
  };

  const goBack = () => {
    router.push('/admin/onboarding');
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleString();
  };

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <h1 className="tracking-title">Onboarding Progress</h1>
        <button onClick={goBack} className="back-btn">
          Back to Onboarding Form
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading...</div>
      ) : onboardings.length === 0 ? (
        <p className="empty-message">No onboarding requests found</p>
      ) : (
        <div className="onboarding-list">
          {onboardings.map((item) => (
            <div key={item.id} className={`onboarding-item ${item.status}`}>
              <div className="item-header">
                <span className="item-name">{item.name}</span>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </div>
              <div className="item-details">
                <div className="detail">
                  <span className="detail-label">Email:</span>
                  <span>{item.email}</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Phone:</span>
                  <span>{item.phone}</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Type:</span>
                  <span>{item.userType}</span>
                </div>
                {item.personal?.address && (
                  <div className="detail">
                    <span className="detail-label">Address:</span>
                    <span>{item.personal.address}</span>
                  </div>
                )}
                {item.business?.tradeLicense && (
                  <div className="detail">
                    <span className="detail-label">Trade License:</span>
                    <span>{item.business.tradeLicense}</span>
                  </div>
                )}
                <div className="detail">
                  <span className="detail-label">Created:</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                {item.updatedAt && (
                  <div className="detail">
                    <span className="detail-label">Updated:</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                )}
              </div>
              {item.status === 'pending_review' && (
                <div className="item-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(item.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(item.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}


 <style jsx>{`
        .tracking-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .tracking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tracking-title {
          font-size: 1.8rem;
          color: #2d3748;
          margin: 0;
        }

        .back-btn {
          padding: 0.75rem 1.5rem;
          background: #718096;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: #4a5568;
        }

        .loading-message,
        .empty-message {
          text-align: center;
          padding: 2rem;
          color: #718096;
          font-style: italic;
        }

        .onboarding-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .onboarding-item {
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          border-left: 4px solid;
        }

        .onboarding-item.pending {
          border-left-color: #f6ad55;
        }

        .onboarding-item.approved {
          border-left-color: #68d391;
        }

        .onboarding-item.rejected {
          border-left-color: #fc8181;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .item-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: #2d3748;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.approved {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .item-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.85rem;
          color: #718096;
        }

        .item-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .approve-btn {
          padding: 0.5rem 1rem;
          background: #68d391;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .approve-btn:hover {
          background: #48bb78;
        }

        .reject-btn {
          padding: 0.5rem 1rem;
          background: #fc8181;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .reject-btn:hover {
          background: #f56565;
        }

        .success-message {
          margin-top: 1rem;
          padding: 1rem;
          background: #f0fff4;
          color: #38a169;
          border-radius: 6px;
          border: 1px solid #c6f6d5;
          text-align: center;
        }

        @media (max-width: 768px) {
          .tracking-container {
            padding: 1.5rem;
          }

          .item-details {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .item-details {
            grid-template-columns: 1fr;
          }

          .item-actions {
            justify-content: stretch;
          }

          .approve-btn,
          .reject-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>

    
  );
};

export default TrackOnboardingProgress;