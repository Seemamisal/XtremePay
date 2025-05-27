import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function AddPaymentIntegrationForm() {
  const [gatewayName, setGatewayName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [integrationList, setIntegrationList] = useState([]);

  // Fetch integrations
  const fetchIntegrations = async () => {
    const querySnapshot = await getDocs(collection(db, "paymentIntegrations"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setIntegrationList(list);
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "paymentIntegrations"), {
        gatewayName,
        enabled,
        apiKey,
      });
      setMessage("Payment Integration added successfully!");
      setGatewayName("");
      setEnabled(false);
      setApiKey("");
      fetchIntegrations(); // Refresh list
    } catch (e) {
      setMessage("Error: " + e.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Payment Integration</h2>

        <label>Gateway Name:</label><br />
        <input
          value={gatewayName}
          onChange={(e) => setGatewayName(e.target.value)}
          required
        /><br />

        <label>Enabled:</label><br />
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        /><br />

        <label>API Key:</label><br />
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        /><br />

        <button type="submit" style={{ marginTop: 10 }}>Add Payment Integration</button>
        {message && <p>{message}</p>}
      </form>

      <hr />
      <h3>Your Payment Integrations</h3>
      {integrationList.length === 0 ? (
        <p>No integrations found.</p>
      ) : (
        <ul>
          {integrationList.map((integration) => (
            <li key={integration.id}>
              <strong>{integration.gatewayName}</strong> – API Key: {integration.apiKey} – Enabled: {integration.enabled ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
