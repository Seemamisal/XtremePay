 

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  FiCreditCard,
  FiKey,
  FiToggleLeft,
  FiToggleRight,
  FiPlus,
  FiCheck,
  FiX,
} from "react-icons/fi";

export default function AddPaymentIntegrationForm() {
  const [gatewayName, setGatewayName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [message, setMessage] = useState("");
  const [integrationList, setIntegrationList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIntegrations = async () => {
    const querySnapshot = await getDocs(collection(db, "paymentIntegrations"));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setIntegrationList(list);
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "paymentIntegrations"), {
        gatewayName,
        enabled,
        apiKey,
        secretKey,
      });
      setMessage("Payment Integration added successfully!");
      setGatewayName("");
      setEnabled(false);
      setApiKey("");
      setSecretKey("");
      fetchIntegrations();
    } catch (e) {
      setMessage("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleIntegrationStatus = async (id, currentStatus) => {
    const integrationRef = doc(db, "paymentIntegrations", id);
    await updateDoc(integrationRef, {
      enabled: !currentStatus,
    });
    fetchIntegrations();
  };

  return (
    <div className="integration-container">
      <div className="form-section">
        <div className="form-header">
          <h2>
            <FiCreditCard className="header-icon" />
            Add Payment Integration
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="integration-form">
          <div className="form-group">
            <label className="form-label">
              <FiCreditCard className="input-icon" />
              Gateway Name:
            </label>
            <select
              className="form-select"
              value={gatewayName}
              onChange={(e) => setGatewayName(e.target.value)}
              required
            >
              <option value="">Select Gateway</option>
              <option value="Stripe">Stripe</option>
              <option value="Razorpay">Razorpay</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiToggleLeft className="input-icon" />
              Enabled:
            </label>
            <div className="toggle-switch">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">
                {enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiKey className="input-icon" />
              API Key:
            </label>
            <input
              type="password"
              className="form-input" placeholder="Enter API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiKey className="input-icon" />
              Secret Key:
            </label>
            <input
              type="password"
              className="form-input" placeholder="Enter Secret Key" 
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            <FiPlus className="btn-icon" />
            {isSubmitting ? "Adding..." : "Add Integration"}
          </button>

          {message && (
            <div
              className={`message ${
                message.includes("Error") ? "error" : "success"
              }`}
            >
              {message.includes("Error") ? <FiX /> : <FiCheck />}
              {message}
            </div>
          )}
        </form>
      </div>

      <div className="list-section">
        <div className="section-header">
          <h3>
            <FiCreditCard className="header-icon" />
            Your Payment Integrations
          </h3>
        </div>

        {integrationList.length === 0 ? (
          <div className="empty-state">
            <p>No integrations found.</p>
          </div>
        ) : (
          <div className="integration-table-container">
            <table className="integration-table">
              <thead>
                <tr>
                  <th>Gateway Name</th>
                  <th>API Key</th>
                  <th>Secret Key</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {integrationList.map((integration) => (
                  <tr key={integration.id}>
                    <td>{integration.gatewayName}</td>
                    <td>
                      {integration.apiKey
                        ? integration.apiKey.slice(0, 4) + "****"
                        : "N/A"}
                    </td>
                    <td>
                      {integration.secretKey
                        ? integration.secretKey.slice(0, 4) + "****"
                        : "N/A"}
                    </td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={integration.enabled}
                          onChange={() =>
                            toggleIntegrationStatus(
                              integration.id,
                              integration.enabled
                            )
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="status-label">
                        {integration.enabled ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .integration-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width:900px;
          margin: 0 auto;
        }

        .form-section,
        .list-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .form-header,
        .section-header {
          margin-bottom: 1.5rem;
        }

        .form-header h2,
        .section-header h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          color: #2d3748;
        }

        .form-header h2 {
          font-size: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.25rem;
        }

        .header-icon {
          color: #4299e1;
        }

        .integration-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #4a5568;
        }

        .input-icon {
          color: #718096;
          font-size: 1rem;
        }

        .form-input,
        .form-select {
          padding: 0.75rem 1rem;
          border: 1px solid rgb(3, 5, 7);
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s;
          background-color: white;
          color: black;
          
          
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
          background-color: white;
          color: black;
        }

        /* Toggle Switch Styles */
        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgb(170, 213, 211);
          transition: 0.4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #4299e1;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .toggle-label {
          font-size: 0.875rem;
          color: #4a5568;
        }

        .status-label {
          margin-left: 0.75rem;
          font-size: 0.875rem;
          color: #4a5568;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          align-self: flex-start;
          margin-top: 0.5rem;
        }

        .submit-btn:hover {
          background: #3182ce;
        }

        .submit-btn:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .message.success {
          background: #f0fff4;
          color: #38a169;
          border: 1px solid #c6f6d5;
        }

        .message.error {
          background: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fed7d7;
        }

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: #718096;
        }

        .integration-table-container {
          overflow-x: auto;
        }

        .integration-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .integration-table th {
          background-color: #f7fafc;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
        }

        .integration-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .integration-table tr:hover {
          background-color: #f8fafc;
        }

        @media (max-width: 768px) {
          .form-section,
          .list-section {
            padding: 1.5rem;
          }

          .integration-table th,
          .integration-table td {
            padding: 0.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
