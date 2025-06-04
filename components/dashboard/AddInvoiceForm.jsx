 




import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { FiDollarSign, FiUser, FiFileText, FiCheckCircle } from "react-icons/fi";

export default function AddInvoiceForm() {
  const [vendorId, setVendorId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage("User not logged in.");
        return;
      }

      await addDoc(collection(db, "invoices"), {
        vendorId,
        invoiceId,
        amount: Number(amount),
        status,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      setMessage("Invoice added successfully!");
      setVendorId("");
      setInvoiceId("");
      setAmount("");
      setStatus("unpaid");
    } catch (e) {
      setMessage("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="invoice-form-container">
      <div className="form-header">
        <h2>
          <FiFileText className="header-icon" />
          Add Invoice
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-group">
          <label className="form-label">
            <FiUser className="input-icon" />
            Vendor ID:
          </label>
          <input
            className="form-input" placeholder="Enter Vendor ID"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FiFileText className="input-icon" />
            Invoice ID:
          </label>
          <input
            className="form-input" placeholder="Enter Invoice ID"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FiDollarSign className="input-icon" />
            Amount (₹):
          </label>
          <input
            type="number"
            className="form-input" placeholder="Enter amount" min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FiCheckCircle className="input-icon" />
            Status:
          </label>
          <select 
            className="form-select"
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Invoice'}
        </button>
        
        {message && (
          <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </form>

      <style jsx>{`
        .invoice-form-container {
          background:rgb(255, 255, 255);
          border-radius: 12px;
          padding: 2rem;
          max-width:900px;
          margin: 0 auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .form-header {
          margin-bottom: 1.5rem;
        }

        .form-header h2 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          font-size: 1.5rem;
          color:rgb(1, 5, 12);
         }

        .header-icon {
          color: #4299e1;
        }

        .invoice-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
           max-width:900px;
          margin: 0 auto;
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
          font-weight: 500;
          color:rgb(0, 3, 7);
        }

        .input-icon {
          color: #718096;
          font-size: 1rem;
        }

        .form-input, .form-select {
          padding: 0.75rem 1rem;
          border: 1px solid rgb(11, 2, 2);
          border-radius: 6px;
          font-size: 1rem;
          color: rgb(249, 246, 246);
          background-color: white;
          transition: all 0.2s;
        }

        

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 2px rgba(1, 7, 12, 0.2);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
          color:black;
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

        .message {
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

        @media (max-width: 600px) {
          .invoice-form-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}