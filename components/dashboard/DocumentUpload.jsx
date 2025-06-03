 


// import React, { useState } from 'react';
// import { doc, setDoc, collection } from 'firebase/firestore';
// import { db } from '../../firebaseConfig';

// const DocumentUpload = ({ userId }) => {
//   const [formData, setFormData] = useState({
//     personal: {
//       name: '',
//       email: '',
//       address: '',
//       phone: ''
//     },
//     business: {
//       tradeLicense: ''
//     }
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e, section, field) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: e.target.value
//       }
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       console.log('Submitting data:', formData);
      
//       const onboardingRef = doc(collection(db, 'onboardings'), userId);
//       await setDoc(onboardingRef, {
//         userId,
//         ...formData,
//         status: 'pending_review',
//         createdAt: new Date()
//       }, { merge: true });

//       alert('Details submitted successfully! Awaiting admin approval.');
//     } catch (error) {
//       console.error('Full error:', error);
//       console.error('Error details:', {
//         message: error.message,
//         code: error.code,
//         stack: error.stack
//       });
//       alert('Error submitting details. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="onboarding-container">
//       <h2 className="section-title">Onboarding Details</h2>
//       <p className="section-subtitle">Please provide your details</p>

//       <form onSubmit={handleSubmit} className="details-form">
//         <div className="form-section">
//           <h3 className="section-header">Personal Details</h3>
//           <div className="form-group">
//             <label className="form-label">
//               Name
//               <span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               value={formData.personal.name}
//               onChange={(e) => handleChange(e, 'personal', 'name')}
//               className="form-input"
//               placeholder="Enter your full name"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">
//               Email
//               <span className="required">*</span>
//             </label>
//             <input
//               type="email"
//               value={formData.personal.email}
//               onChange={(e) => handleChange(e, 'personal', 'email')}
//               className="form-input"
//               placeholder="Enter your email address"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">
//               Address
//               <span className="required">*</span>
//             </label>
//             <textarea
//               value={formData.personal.address}
//               onChange={(e) => handleChange(e, 'personal', 'address')}
//               className="form-input"
//               placeholder="Enter your complete address"
//               rows={3}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">
//               Phone Number
//               <span className="required">*</span>
//             </label>
//             <input
//               type="tel"
//               value={formData.personal.phone}
//               onChange={(e) => handleChange(e, 'personal', 'phone')}
//               className="form-input"
//               placeholder="Enter your phone number"
//               required
//             />
//           </div>
//         </div>

//         <div className="form-section">
//           <h3 className="section-header">Business Details</h3>
//           <div className="form-group">
//             <label className="form-label">
//               Trade License
//               <span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               value={formData.business.tradeLicense}
//               onChange={(e) => handleChange(e, 'business', 'tradeLicense')}
//               className="form-input"
//               placeholder="Enter your trade license number"
//               required
//             />
//           </div>
//         </div>

//         <button 
//           type="submit" 
//           className="submit-btn"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Details'}
//         </button>
//       </form>

//       <style jsx>{`
//         .onboarding-container {
//           max-width: 800px;
//           margin: 0 auto;
//           padding: 2rem;
//           background: #fff;
//           border-radius: 8px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//         }

//         .section-title {
//           font-size: 1.5rem;
//           color: #2d3748;
//           margin-bottom: 0.5rem;
//         }

//         .section-subtitle {
//           color: #718096;
//           margin-bottom: 2rem;
//         }

//         .details-form {
//           display: flex;
//           flex-direction: column;
//           gap: 2rem;
//         }

//         .form-section {
//           display: flex;
//           flex-direction: column;
//           gap: 1.5rem;
//           padding: 1.5rem;
//           background: #f8fafc;
//           border-radius: 8px;
//         }

//         .section-header {
//           font-size: 1.2rem;
//           color: #2d3748;
//           margin-bottom: 0.5rem;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         .form-label {
//           font-weight: 500;
//           color: #4a5568;
//         }

//         .required {
//           color: #e53e3e;
//           margin-left: 0.25rem;
//         }

//         .form-input {
//           padding: 0.75rem 1rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 6px;
//           font-size: 1rem;
//           background: #f8fafc;
//           color: black;
//           transition: border 0.2s;
//         }

//         .form-input::placeholder {
//           color: #a0aec0;
//           opacity: 1;
//         }

//         .form-input:focus {
//           outline: none;
//           border-color: #4299e1;
//           box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
//         }

//         textarea.form-input {
//           min-height: 100px;
//           resize: vertical;
//         }

//         .submit-btn {
//           padding: 0.75rem 1.5rem;
//           background: #4299e1;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.2s;
//           margin-top: 1rem;
//           align-self: flex-start;
//         }

//         .submit-btn:hover {
//           background: #3182ce;
//         }

//         .submit-btn:disabled {
//           background: #a0aec0;
//           cursor: not-allowed;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DocumentUpload;


import React, { useState } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const DocumentUpload = ({ userId }) => {
  const [formData, setFormData] = useState({
    personal: {
      name: '',
      email: '',
      address: '',
      phone: ''
    },
    business: {
      tradeLicense: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleChange = (e, section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAgreed) {
      alert('Please agree to the terms before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting data:', formData);
      
      const onboardingRef = doc(collection(db, 'onboardings'), userId);
      await setDoc(onboardingRef, {
        userId,
        ...formData,
        status: 'pending_review',
        createdAt: new Date()
      }, { merge: true });

      alert('Details submitted successfully! Awaiting admin approval.');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      alert('Error submitting details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-container">
      <h2 className="section-title">Onboarding Details</h2>
      <p className="section-subtitle">Please provide your details</p>

      <form onSubmit={handleSubmit} className="details-form">
        <div className="form-section">
          <h3 className="section-header">Personal Details</h3>
          <div className="form-group">
            <label className="form-label">
              Name
              <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.personal.name}
              onChange={(e) => handleChange(e, 'personal', 'name')}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email
              <span className="required">*</span>
            </label>
            <input
              type="email"
              value={formData.personal.email}
              onChange={(e) => handleChange(e, 'personal', 'email')}
              className="form-input"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Address
              <span className="required">*</span>
            </label>
            <textarea
              value={formData.personal.address}
              onChange={(e) => handleChange(e, 'personal', 'address')}
              className="form-input"
              placeholder="Enter your complete address"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Phone Number
              <span className="required">*</span>
            </label>
            <input
              type="tel"
              value={formData.personal.phone}
              onChange={(e) => handleChange(e, 'personal', 'phone')}
              className="form-input"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-header">Business Details</h3>
          <div className="form-group">
            <label className="form-label">
              Trade License
              <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.business.tradeLicense}
              onChange={(e) => handleChange(e, 'business', 'tradeLicense')}
              className="form-input"
              placeholder="Enter your trade license number"
              required
            />
          </div>
        </div>

        <div className="agreement-checkbox">
          <input
            type="checkbox"
            id="agree-checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            required
          />
          <label htmlFor="agree-checkbox">
            I agree to the terms and conditions
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting || !isAgreed}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Details'}
        </button>
      </form>

      <style jsx>{`
        .onboarding-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(12, 8, 8, 0.05);
        }

        .section-title {
          font-size: 1.5rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: #718096;
          margin-bottom: 2rem;
        }

        .details-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .section-header {
          font-size: 1.2rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
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

        .required {
          color: #e53e3e;
          margin-left: 0.25rem;
        }

        .form-input {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          background: #f8fafc;
          color: black;
          transition: border 0.2s;
        }

        .form-input::placeholder {
          color: #a0aec0;
          opacity: 1;
        }

        .form-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }

        textarea.form-input {
          min-height: 100px;
          resize: vertical;
        }

        .agreement-checkbox {
          background-color:white;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.5rem 0;
          padding: 0.75rem;
          background:rgb(1, 10, 19);
          border-radius: 6px;
        }

        .agreement-checkbox input {
       
          width: 1.25rem;
          height: 1.25rem;
          accent-color:rgb(52, 137, 203);
        }

        .agreement-checkbox label {
          color:rgb(88, 125, 189);
          font-size: 0.95rem;
        }

        .submit-btn {
          padding: 0.75rem 1.5rem;
          background:rgb(50, 152, 236);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
          align-self: flex-start;
        }

        .submit-btn:hover {
          background: #3182ce;
        }

        .submit-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default DocumentUpload;