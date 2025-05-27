import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function AddPaymentIntegrationForm() {
  const [gatewayName, setGatewayName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState(""); // ✅ Added
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
        secretKey, // ✅ Added
      });
      setMessage("Payment Integration added successfully!");
      setGatewayName("");
      setEnabled(false);
      setApiKey("");
      setSecretKey(""); // ✅ Reset
      fetchIntegrations(); // Refresh list
    } catch (e) {
      setMessage("Error: " + e.message);
    }
  };

  // ✅ Toggle enabled status
  const toggleIntegrationStatus = async (id, currentStatus) => {
    const integrationRef = doc(db, "paymentIntegrations", id);
    await updateDoc(integrationRef, {
      enabled: !currentStatus
    });
    fetchIntegrations();
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

        <label>Secret Key:</label><br />
        <input
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
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
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Gateway Name</th>
              <th>API Key</th>
              <th>Secret Key</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {integrationList.map((integration) => (
              <tr key={integration.id}>
                <td>{integration.gatewayName}</td>
                <td>{integration.apiKey}</td>
                <td>{integration.secretKey ? integration.secretKey.slice(0, 4) + '****' : 'N/A'}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={() => toggleIntegrationStatus(integration.id, integration.enabled)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
