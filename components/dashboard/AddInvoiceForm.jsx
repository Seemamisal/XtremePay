import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";

export default function AddInvoiceForm() {
  const [vendorId, setVendorId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        createdBy: user.uid, // 👈 This is critical
      });

      setMessage("Invoice added successfully!");
      setVendorId("");
      setInvoiceId("");
      setAmount("");
      setStatus("unpaid");
    } catch (e) {
      setMessage("Error: " + e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Invoice</h2>
      <label>Vendor ID:</label><br />
      <input
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
        required
      /><br />

      <label>Invoice ID:</label><br />
      <input
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        required
      /><br />

      <label>Amount:</label><br />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      /><br />

      <label>Status:</label><br />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
        <option value="failed">Failed</option>
      </select><br />

      <button type="submit" style={{ marginTop: 10 }}>Add Invoice</button>
      {message && <p>{message}</p>}
    </form>
  );
}
