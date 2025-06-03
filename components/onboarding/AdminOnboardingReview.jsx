 



// // import React, { useState } from 'react';
// // import { collection, addDoc } from 'firebase/firestore';
// // import { db } from '../../firebaseConfig';

// // const AdminOnboarding = () => {
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     email: '',
// //     phone: '',
// //     userType: 'Vendor' // Default to Vendor
// //   });
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [successMessage, setSuccessMessage] = useState('');

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       // Add the onboarding data to Firestore
// //       await addDoc(collection(db, 'onboardings'), {
// //         ...formData,
// //         status: 'pending',
// //         createdAt: new Date(),
// //         initiatedBy: 'admin'
// //       });

// //       setSuccessMessage('Onboarding initiated successfully!');
// //       // Reset form
// //       setFormData({
// //         name: '',
// //         email: '',
// //         phone: '',
// //         userType: 'Vendor'
// //       });

// //       // Clear success message after 3 seconds
// //       setTimeout(() => setSuccessMessage(''), 3000);
// //     } catch (error) {
// //       console.error('Error submitting onboarding:', error);
// //       alert('Error initiating onboarding. Please try again.');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };


// import React, { useState, useEffect } from 'react';
// import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { db } from '../../firebaseConfig';

// const AdminOnboarding = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     userType: 'Vendor'
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [onboardings, setOnboardings] = useState([]);
//   const [selectedOnboarding, setSelectedOnboarding] = useState(null);

//   // Fetch all onboardings from Firestore
//   useEffect(() => {
//     const fetchOnboardings = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'onboardings'));
//         const onboardingsData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setOnboardings(onboardingsData);
//       } catch (error) {
//         console.error('Error fetching onboardings:', error);
//       }
//     };

//     fetchOnboardings();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const docRef = await addDoc(collection(db, 'onboardings'), {
//         ...formData,
//         status: 'pending',
//         createdAt: new Date(),
//         initiatedBy: 'admin'
//       });

//       // Add the new onboarding to local state
//       setOnboardings(prev => [
//         ...prev,
//         {
//           id: docRef.id,
//           ...formData,
//           status: 'pending',
//           createdAt: new Date(),
//           initiatedBy: 'admin'
//         }
//       ]);

//       setSuccessMessage('Onboarding initiated successfully!');
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         userType: 'Vendor'
//       });

//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       console.error('Error submitting onboarding:', error);
//       alert('Error initiating onboarding. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       await updateDoc(doc(db, 'onboardings', id), {
//         status: 'approved',
//         updatedAt: new Date()
//       });

//       // Update local state
//       setOnboardings(prev =>
//         prev.map(item =>
//           item.id === id ? { ...item, status: 'approved' } : item
//         )
//       );
//       setSuccessMessage('Onboarding approved successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       console.error('Error approving onboarding:', error);
//       alert('Error approving onboarding. Please try again.');
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       await updateDoc(doc(db, 'onboardings', id), {
//         status: 'rejected',
//         updatedAt: new Date()
//       });

//       // Update local state
//       setOnboardings(prev =>
//         prev.map(item =>
//           item.id === id ? { ...item, status: 'rejected' } : item
//         )
//       );
//       setSuccessMessage('Onboarding rejected successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       console.error('Error rejecting onboarding:', error);
//       alert('Error rejecting onboarding. Please try again.');
//     }
//   };

//   const openDetails = (onboarding) => {
//     setSelectedOnboarding(onboarding);
//   };

//   const closeDetails = () => {
//     setSelectedOnboarding(null);
//   };

//   return (
//     <div className="admin-onboarding-container">
//       <h1 className="page-title">Admin Onboarding</h1>
//       <p className="page-description">Initiate new user onboarding process</p>

//       <form onSubmit={handleSubmit} className="onboarding-form">
//         <div className="form-group">
//           <label className="form-label">
//             Full Name *
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="form-input"
//             placeholder="Enter user's full name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label className="form-label">
//             Email *
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="form-input"
//             placeholder="Enter user's email address"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label className="form-label">
//             Phone Number *
//           </label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="form-input"
//             placeholder="Enter user's phone number"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label className="form-label">
//             User Type *
//           </label>
//           <div className="radio-group">
//             <label className="radio-option">
//               <input
//                 type="radio"
//                 name="userType"
//                 value="Vendor"
//                 checked={formData.userType === 'Vendor'}
//                 onChange={handleChange}
//                 required
//               />
//               <span className="radio-label">Vendor</span>
//             </label>
//             <label className="radio-option">
//               <input
//                 type="radio"
//                 name="userType"
//                 value="Sales"
//                 checked={formData.userType === 'Sales'}
//                 onChange={handleChange}
//               />
//               <span className="radio-label">Sales</span>
//             </label>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="submit-btn"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Processing...' : 'Start Onboarding'}
//         </button>

//         {successMessage && (
//           <div className="success-message">
//             {successMessage}
//           </div>
//         )}
//       </form>


//           <div className="tracking-container">
//         <h2 className="tracking-title">Onboarding Progress</h2>
        
//         {onboardings.length === 0 ? (
//           <p className="empty-message">No onboarding requests found</p>
//         ) : (
//           <div className="onboarding-list">
//             {onboardings.map((item) => (
//               <div 
//                 key={item.id} 
//                 className={`onboarding-item ${item.status}`}
//                 onClick={() => openDetails(item)}
//               >
//                 <div className="item-header">
//                   <span className="item-name">{item.name}</span>
//                   <span className={`status-badge ${item.status}`}>
//                     {item.status}
//                   </span>
//                 </div>
//                 <div className="item-details">
//                   <span>{item.email}</span>
//                   <span>{item.userType}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

// {/* 
//       <style jsx>{`
//         .admin-onboarding-container {
//           max-width: 900px;
//           margin: 0 auto;
//           padding: 2rem;
//           background: #fff;
//           border-radius: 8px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//         }

//         .page-title {
//           font-size: 1.8rem;
//           color: #2d3748;
//           margin-bottom: 0.5rem;
//         }

//         .page-description {
//           color: #718096;
//           margin-bottom: 2rem;
//         }

//         .onboarding-form {
//           display: flex;
//           flex-direction: column;
//           gap: 1.5rem;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }
//            .required {
//           color: #e53e3e;
//           margin-left: 0.25rem;
//         }

//         .form-label {
//           font-weight: 500;
//           color: #4a5568;
//         }

//         .form-input {
//           padding: 0.75rem 1rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 6px;
//           font-size: 1rem;
//           transition: border 0.2s;
//           background-color: white;
//          color:black
//         }

//         .form-input:focus {
//           outline: none;
//           border-color: #4299e1;
 
//           box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
//         }

//         .radio-group {
//           display: flex;
//           gap: 1.5rem;
//           margin-top: 0.5rem;
//         }

//         .radio-option {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           cursor: pointer;
//           }

//         .radio-label {
//           color: #4a5568;
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

//         .success-message {
//           margin-top: 1rem;
//           padding: 0.75rem;
//           background: #f0fff4;
//           color: #38a169;
//           border-radius: 6px;
//           border: 1px solid #c6f6d5;
//         }

//         @media (max-width: 600px) {
//           .admin-onboarding-container {
//             padding: 1.5rem;
//             margin: 1rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminOnboarding; */}



//   {/* Modal for onboarding details */}
//       {selectedOnboarding && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button className="close-btn" onClick={closeDetails}>×</button>
//             <h3>Onboarding Details</h3>
            
//             <div className="detail-row">
//               <span className="detail-label">Name:</span>
//               <span>{selectedOnboarding.name}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Email:</span>
//               <span>{selectedOnboarding.email}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Phone:</span>
//               <span>{selectedOnboarding.phone}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">User Type:</span>
//               <span>{selectedOnboarding.userType}</span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Status:</span>
//               <span className={`status-text ${selectedOnboarding.status}`}>
//                 {selectedOnboarding.status}
//               </span>
//             </div>
//             <div className="detail-row">
//               <span className="detail-label">Initiated:</span>
//               <span>{selectedOnboarding.createdAt?.toDate().toLocaleString()}</span>
//             </div>

//             {selectedOnboarding.status === 'pending' && (
//               <div className="action-buttons">
//                 <button 
//                   className="approve-btn"
//                   onClick={() => handleApprove(selectedOnboarding.id)}
//                 >
//                   Approve
//                 </button>
//                 <button 
//                   className="reject-btn"
//                   onClick={() => handleReject(selectedOnboarding.id)}
//                 >
//                   Reject
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {successMessage && (
//         <div className="success-message">
//           {successMessage}
//         </div>
//       )}

//       <style jsx>{`



//    .admin-onboarding-container {
//           max-width: 900px;
//           margin: 0 auto;
//           padding: 2rem;
//           background: #fff;
//           border-radius: 8px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//         }

//         .page-title {
//           font-size: 1.8rem;
//           color: #2d3748;
//           margin-bottom: 0.5rem;
//         }

//         .page-description {
//           color: #718096;
//           margin-bottom: 2rem;
//         }

//         .onboarding-form {
//           display: flex;
//           flex-direction: column;
//           gap: 1.5rem;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }
//            .required {
//           color: #e53e3e;
//           margin-left: 0.25rem;
//         }

//         .form-label {
//           font-weight: 500;
//           color: #4a5568;
//         }

//         .form-input {
//           padding: 0.75rem 1rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 6px;
//           font-size: 1rem;
//           transition: border 0.2s;
//           background-color: white;
//          color:black
//         }

//         .form-input:focus {
//           outline: none;
//           border-color: #4299e1;
 
//           box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
//         }

//         .radio-group {
//           display: flex;
//           gap: 1.5rem;
//           margin-top: 0.5rem;
//         }

//         .radio-option {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           cursor: pointer;
//           }

//         .radio-label {
//           color: #4a5568;
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

//         .success-message {
//           margin-top: 1rem;
//           padding: 0.75rem;
//           background: #f0fff4;
//           color: #38a169;
//           border-radius: 6px;
//           border: 1px solid #c6f6d5;
//         }

//         @media (max-width: 600px) {
//           .admin-onboarding-container {
//             padding: 1.5rem;
//             margin: 1rem;
//           }
//         }



//         .admin-onboarding-container {
//           max-width: 900px;
//           margin: 0 auto;
//           padding: 2rem;
//           background: #fff;
//           border-radius: 8px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//         }

//         /* Previous styles remain the same */
//         /* ... */

//         .tracking-container {
//           margin-top: 3rem;
//           padding: 1.5rem;
//           background: #f8fafc;
//           border-radius: 8px;
//           border: 1px solid #e2e8f0;
//         }

//         .tracking-title {
//           font-size: 1.4rem;
//           color: #2d3748;
//           margin-bottom: 1.5rem;
//         }

//         .onboarding-list {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .onboarding-item {
//           padding: 1rem;
//           background: white;
//           border-radius: 6px;
//           border: 1px solid #e2e8f0;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .onboarding-item:hover {
//           border-color: #4299e1;
//           box-shadow: 0 1px 3px rgba(66, 153, 225, 0.2);
//         }

//         .onboarding-item.pending {
//           border-left: 4px solid #f6ad55;
//         }

//         .onboarding-item.approved {
//           border-left: 4px solid #68d391;
//         }

//         .onboarding-item.rejected {
//           border-left: 4px solid #fc8181;
//         }

//         .item-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 0.5rem;
//         }

//         .item-name {
//           font-weight: 500;
//           color: #2d3748;
//         }

//         .status-badge {
//           padding: 0.25rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.75rem;
//           font-weight: 500;
//         }

//         .status-badge.pending {
//           background: #fef3c7;
//           color: #92400e;
//         }

//         .status-badge.approved {
//           background: #dcfce7;
//           color: #166534;
//         }

//         .status-badge.rejected {
//           background: #fee2e2;
//           color: #991b1b;
//         }

//         .item-details {
//           display: flex;
//           gap: 1rem;
//           color: #4a5568;
//           font-size: 0.9rem;
//         }

//         .empty-message {
//           color: #718096;
//           font-style: italic;
//           text-align: center;
//           padding: 1rem;
//         }

//         /* Modal styles */
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }

//         .modal-content {
//           background: white;
//           padding: 2rem;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 500px;
//           position: relative;
//         }

//         .close-btn {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           background: none;
//           border: none;
//           font-size: 1.5rem;
//           cursor: pointer;
//           color: #718096;
//         }

//         .detail-row {
//           display: flex;
//           margin-bottom: 1rem;
//         }

//         .detail-label {
//           font-weight: 500;
//           color: #4a5568;
//           width: 120px;
//         }

//         .status-text {
//           font-weight: 500;
//         }

//         .status-text.pending {
//           color: #d97706;
//         }

//         .status-text.approved {
//           color: #059669;
//         }

//         .status-text.rejected {
//           color: #dc2626;
//         }

//         .action-buttons {
//           display: flex;
//           gap: 1rem;
//           margin-top: 2rem;
//         }

//         .approve-btn {
//           padding: 0.5rem 1rem;
//           background: #68d391;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }

//         .reject-btn {
//           padding: 0.5rem 1rem;
//           background: #fc8181;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }

//         @media (max-width: 600px) {
//           .admin-onboarding-container {
//             padding: 1rem;
//           }

//           .item-details {
//             flex-direction: column;
//             gap: 0.25rem;
//           }

//           .modal-content {
//             width: 95%;
//             padding: 1.5rem 1rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminOnboarding;





import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRouter } from 'next/router'; // For Next.js
// import { useNavigate } from 'react-router-dom'; // For React Router
// import TrackOnboardingProgress from './TrackOnboardingProgress';
const AdminOnboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Vendor'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // For Next.js:
  const router = useRouter();
  // For React Router: const navigate = useNavigate();

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
      await addDoc(collection(db, 'onboardings'), {
        ...formData,
        status: 'pending',
        createdAt: new Date(),
        initiatedBy: 'admin'
      });

      setSuccessMessage('Onboarding initiated successfully!');
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
    // For Next.js:
        // router.push('/admin/track-onboarding');
        router.push('/admin/TrackOnboardingProgress');

    // router.push('/onboarding/TrackOnboarding');
    // For React Router: navigate('/admin/track-onboarding');
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