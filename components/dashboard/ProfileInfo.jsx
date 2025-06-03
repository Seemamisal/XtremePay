"use client";

import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FiEdit, FiSave, FiUser, FiBriefcase, FiMapPin, FiMail, FiClock } from 'react-icons/fi';

const ProfileInfo = () => {
  const [profile, setProfile] = useState({
    username: '',
    companyName: '',
    address: '',
    email: '',
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          showNotification('User not logged in', 'error');
          setLoading(false);
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfile({
            username: userData.username || '',
            companyName: userData.companyName || '',
            address: userData.address || '',
            email: userData.email || user.email || '',
            lastUpdated: userData.lastUpdated || null
          });
        } else {
          // Initialize with user email if document doesn't exist
          setProfile(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
        setLoading(false);
      } catch (err) {
        showNotification('Failed to load profile: ' + err.message, 'error');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        showNotification('User not logged in', 'error');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      
      await setDoc(userRef, {
        username: profile.username,
        companyName: profile.companyName,
        address: profile.address,
        email: user.email,
        lastUpdated: new Date()
      }, { merge: true });

      setEditing(false);
      showNotification('Profile updated successfully', 'success');
      
      // Refresh the profile data
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        setProfile(prev => ({
          ...prev,
          lastUpdated: updatedDoc.data().lastUpdated
        }));
      }
    } catch (err) {
      showNotification('Failed to update profile: ' + err.message, 'error');
      console.error('Error details:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile Information</h2>
        {editing ? (
          <button onClick={handleSave} className="btn-save">
            <FiSave className="icon" /> Save Changes
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-edit">
            <FiEdit className="icon" /> Edit Profile
          </button>
        )}
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-field">
          <div className="field-header">
            <FiMail className="field-icon" />
            <span className="field-label">Email</span>
          </div>
          <div className="field-value">{profile.email}</div>
        </div>

        <div className="profile-field">
          <div className="field-header">
            <FiUser className="field-icon" />
            <span className="field-label">Username</span>
          </div>
          {editing ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="field-input"
              required
            />
          ) : (
            <div className="field-value">{profile.username || 'Not set'}</div>
          )}
        </div>

        <div className="profile-field">
          <div className="field-header">
            <FiBriefcase className="field-icon" />
            <span className="field-label">Company Name</span>
          </div>
          {editing ? (
            <input
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              className="field-input"
              required
            />
          ) : (
            <div className="field-value">{profile.companyName || 'Not set'}</div>
          )}
        </div>

        <div className="profile-field">
          <div className="field-header">
            <FiMapPin className="field-icon" />
            <span className="field-label">Address</span>
          </div>
          {editing ? (
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="field-textarea"
              required
              rows={4}
            />
          ) : (
            <div className="field-value">{profile.address || 'Not set'}</div>
          )}
        </div>
 
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .profile-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #2c3e50;
          font-weight: 600;
        }

        .btn-edit, .btn-save {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-edit {
          background: #f8f9fa;
          color: #4a5568;
        }

        .btn-edit:hover {
          background: #e9ecef;
        }

        .btn-save {
          background: #4299e1;
          color: white;
        }

        .btn-save:hover {
          background: #3182ce;
        }

        .icon {
          font-size: 1rem;
        }

        .notification {
          padding: 0.8rem 1rem;
          margin-bottom: 1.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .notification.success {
          background: #f0fff4;
          color: #38a169;
          border: 1px solid #c6f6d5;
        }

        .notification.error {
          background: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fed7d7;
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a5568;
        }

        .field-icon {
          font-size: 1.1rem;
          color: #718096;
        }

        .field-label {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .field-input, .field-textarea {
          padding: 0.8rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .field-input:focus, .field-textarea:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }

        .field-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .field-value {
          padding: 0.8rem;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 0.95rem;
          color: #2d3748;
        }

        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          color: #4a5568;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileInfo;