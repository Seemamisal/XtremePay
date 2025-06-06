 




import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRouter } from 'next/router';

const AdminOnboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Vendor'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add a new document with generated ID
      const docRef = await addDoc(collection(db, 'onboardings'), {
        ...formData,
        status: 'pending',
        createdAt: new Date(),
        initiatedBy: 'admin',
        step: 'admin_initiated' // Track which step we're at
      });

      setSuccessMessage('Onboarding initiated successfully!');
      
      // Store the document ID in localStorage for the onboarding process
      localStorage.setItem('currentOnboardingId', docRef.id);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        userType: 'Vendor'
      });
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      alert('Error initiating onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToTracking = () => {
    router.push('/admin/TrackOnboardingProgress');
  };



  return (
    <div className="admin-onboarding-container">
      <h1 className="page-title">Admin Onboarding</h1>
      <p className="page-description">Initiate new user onboarding process</p>

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-group">
          <label className="form-label">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter user's full name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter user's email address"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter user's phone number"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            User Type *
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="userType"
                value="Vendor"
                checked={formData.userType === 'Vendor'}
                onChange={handleChange}
                required
              />
              <span className="radio-label">Vendor</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="userType"
                value="Sales"
                checked={formData.userType === 'Sales'}
                onChange={handleChange}
              />
              <span className="radio-label">Sales</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Start Onboarding'}
          </button>
          <button
            type="button"
            className="tracking-btn"
            onClick={goToTracking}
          >
            Track Onboarding Progress
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <style jsx>{`
        .admin-onboarding-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .page-description {
          color: #718096;
          margin-bottom: 2rem;
        }

        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 500;
          color: #4a5568;
        }

        .form-input {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          transition: border 0.2s;
          background-color: white;
          color: black;
        }

        .form-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }

        .radio-group {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .radio-label {
          color: #4a5568;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .submit-btn {
          padding: 0.75rem 1.5rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #3182ce;
        }

        .submit-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }

        .tracking-btn {
          padding: 0.75rem 1.5rem;
          background: #4c51bf;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .tracking-btn:hover {
          background: #434190;
        }

        .success-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #f0fff4;
          color: #38a169;
          border-radius: 6px;
          border: 1px solid #c6f6d5;
        }

        @media (max-width: 600px) {
          .admin-onboarding-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOnboarding;