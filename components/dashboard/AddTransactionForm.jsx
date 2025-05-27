import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function AddTransactionForm() {
  const [transactionId, setTransactionId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending");
  const [gateway, setGateway] = useState("Stripe");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);

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
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Add Transaction</h2>
        <label>Transaction ID:</label><br />
        <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required /><br />

        <label>Vendor ID:</label><br />
        <input value={vendorId} onChange={(e) => setVendorId(e.target.value)} required /><br />

        <label>Amount:</label><br />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required /><br />

        <label>Status:</label><br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="success">Success</option>
          <option value="fail">Fail</option>
          <option value="pending">Pending</option>
        </select><br />

        <label>Gateway:</label><br />
        <select value={gateway} onChange={(e) => setGateway(e.target.value)}>
          <option value="Stripe">Stripe</option>
          <option value="Razorpay">Razorpay</option>
        </select><br />

        <button type="submit" style={{ marginTop: 10 }}>Add Transaction</button>
        {message && <p>{message}</p>}
      </form>

      <hr />

      <h3>Transaction List</h3>
      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: 10, width: "100%" }}>
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
                <td>{t.amount}</td>
                <td>{t.status}</td>
                <td>{t.gateway}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
