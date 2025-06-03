 





import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { 
  FiDollarSign, 
  FiUser, 
  FiCreditCard, 
  FiCheckCircle,
  FiList,
  FiLoader,
  FiX,
  FiCheck
} from "react-icons/fi";

export default function AddTransactionForm() {
  const [transactionId, setTransactionId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending");
  const [gateway, setGateway] = useState("Stripe");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(list);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "transactions"), {
        transactionId,
        vendorId,
        amount: Number(amount),
        status,
        gateway,
        createdAt: serverTimestamp(),
      });
      setMessage("Transaction added successfully!");
      setTransactionId("");
      setVendorId("");
      setAmount("");
      setStatus("pending");
      setGateway("Stripe");
    } catch (e) {
      setMessage("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <FiCheck className="text-green-500" />;
      case 'fail': return <FiX className="text-red-500" />;
      default: return <FiLoader className="text-yellow-500 animate-spin" />;
    }
  };

  return (
    <div className="transaction-container">
      <div className="form-section">
        <div className="form-header">
          <h2>
            <FiCreditCard className="header-icon" />
            Add Transaction
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label className="form-label">
              <FiList className="input-icon" />
              Transaction ID:
            </label>
            <input
              className="form-input" placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
          </div>

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
              <FiDollarSign className="input-icon" />
              Amount (₹):
            </label>
            <input
              type="number"
              className="form-input" placeholder="Enter amount"
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
              <option value="success">Success</option>
              <option value="fail">Fail</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiCreditCard className="input-icon" />
              Gateway:
            </label>
            <select 
              className="form-select"
              value={gateway} 
              onChange={(e) => setGateway(e.target.value)}
            >
              <option value="Stripe">Stripe</option>
              <option value="Razorpay">Razorpay</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
          
          {message && (
            <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      <div className="list-section">
        <div className="section-header">
          <h3>
            <FiList className="header-icon" />
            Transaction List
          </h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="transaction-table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Vendor ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Gateway</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.transactionId}</td>
                    <td>{t.vendorId}</td>
                    <td>₹{t.amount}</td>
                    <td className={`status-${t.status}`}>
                      {getStatusIcon(t.status)} {t.status}
                    </td>
                    <td>{t.gateway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .transaction-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section, .list-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .form-header, .section-header {
          margin-bottom: 1.5rem;
        }

        .form-header h2, .section-header h3 {
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

        .transaction-form {
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
          font-weight: 500;
          color: #4a5568;
        }

        .input-icon {
          color: #718096;
          font-size: 1rem;
        }

        .form-input, .form-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s;
          background-color:white;
          color:black;
        }

        .form-input:focus, .form-select:focus {
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
          background-color:white;
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

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: #718096;
        }

        .transaction-table-container {
          overflow-x: auto;
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .transaction-table th {
          background-color: #f7fafc;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
        }

        .transaction-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .transaction-table tr:hover {
          background-color: #f8fafc;
        }

        .status-success {
          color: #38a169;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-fail {
          color: #e53e3e;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-pending {
          color: #d69e2e;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 600px) {
          .form-section, .list-section {
            padding: 1.5rem;
          }

          .transaction-table th,
          .transaction-table td {
            padding: 0.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}