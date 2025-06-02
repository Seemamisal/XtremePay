import React, { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection } from 'firebase/firestore';
import { storage, db } from '../../firebaseConfig';
import { FiUpload, FiFile, FiCheck, FiX, FiLoader } from 'react-icons/fi';

const DocumentUpload = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentTypes = [
    { id: 'id_proof', label: 'ID Proof (Aadhaar/Passport)' },
    { id: 'address_proof', label: 'Address Proof' },
    { id: 'pan_card', label: 'PAN Card' },
    { id: 'bank_statement', label: 'Bank Statement' },
  ];

  const handleFileChange = (e, docType) => {
    const newFiles = [...files];
    const fileIndex = newFiles.findIndex(f => f.docType === docType);
    
    if (fileIndex >= 0) {
      newFiles[fileIndex].file = e.target.files[0];
    } else {
      newFiles.push({
        docType,
        file: e.target.files[0],
        name: e.target.files[0].name,
        status: 'pending'
      });
    }
    
    setFiles(newFiles);
  };

  const uploadFile = useCallback(async (fileData) => {
    const { docType, file } = fileData;
    const storageRef = ref(storage, `onboarding/${userId}/${docType}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(prev => ({ ...prev, [docType]: progress }));
        },
        (error) => {
          setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadStatus(prev => ({ ...prev, [docType]: 'success' }));
          resolve({ docType, url: downloadURL });
        }
      );
    });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadPromises = files.map(fileData => uploadFile(fileData));
      const uploadedDocs = await Promise.all(uploadPromises);

      // Save to Firestore
      const onboardingRef = doc(collection(db, 'onboardings'), userId);
      await setDoc(onboardingRef, {
        userId,
        documents: uploadedDocs.reduce((acc, doc) => {
          acc[doc.docType] = doc.url;
          return acc;
        }, {}),
        status: 'pending_review',
        createdAt: new Date()
      }, { merge: true });

      alert('Documents uploaded successfully! Awaiting admin approval.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error uploading documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (docType) => {
    const status = uploadStatus[docType];
    if (!status) return null;
    
    switch (status) {
      case 'success': return <FiCheck className="text-green-500" />;
      case 'error': return <FiX className="text-red-500" />;
      default: return <FiLoader className="animate-spin" />;
    }
  };

  return (
    <div className="onboarding-container">
      <h2 className="section-title">Document Upload</h2>
      <p className="section-subtitle">Please upload the required documents for verification</p>

      <form onSubmit={handleSubmit} className="upload-form">
        {documentTypes.map((docType) => {
          const file = files.find(f => f.docType === docType.id);
          const progress = uploadProgress[docType.id] || 0;

          return (
            <div key={docType.id} className="document-upload-group">
              <label className="document-label">
                {docType.label}
                <span className="required">*</span>
              </label>
              
              <div className="file-input-container">
                <label className="file-input-label">
                  <FiUpload className="upload-icon" />
                  <span>{file ? file.name : 'Choose File'}</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, docType.id)}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </label>
                
                {file && (
                  <div className="file-status">
                    {getStatusIcon(docType.id)}
                    {uploadStatus[docType.id] === 'uploading' && (
                      <span>{progress}%</span>
                    )}
                  </div>
                )}
              </div>

              {file && (
                <div className="preview-container">
                  {file.file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file.file)} 
                      alt="Preview" 
                      className="document-preview"
                    />
                  ) : (
                    <div className="file-preview">
                      <FiFile className="file-icon" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting || files.length !== documentTypes.length}
        >
          {isSubmitting ? 'Uploading...' : 'Submit Documents'}
        </button>
      </form>

      <style jsx>{`
        .onboarding-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .document-upload-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .document-label {
          font-weight: 500;
          color: #4a5568;
        }

        .required {
          color: #e53e3e;
          margin-left: 0.25rem;
        }

        .file-input-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f7fafc;
          border: 1px dashed #cbd5e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          flex-grow: 1;
        }

        .file-input-label:hover {
          background: #edf2f7;
        }

        .upload-icon {
          color: #4299e1;
        }

        .hidden {
          display: none;
        }

        .file-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #718096;
        }

        .preview-container {
          margin-top: 0.5rem;
        }

        .document-preview {
          max-width: 100%;
          max-height: 200px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .file-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f7fafc;
          border-radius: 4px;
        }

        .file-icon {
          color: #718096;
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
          margin-top: 1rem;
          align-self: flex-start;
        }

        .submit-btn:hover {
          background: #3182ce;
        }

        .submit-btn:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default DocumentUpload;