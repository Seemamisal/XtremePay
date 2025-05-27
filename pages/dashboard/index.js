import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfig';

import AddInvoiceForm from '../../components/dashboard/AddInvoiceForm';
import AddTransactionForm from '../../components/dashboard/AddTransactionForm';
import AddPaymentIntegrationForm from '../../components/dashboard/AddPaymentIntegrationForm';
import ProductCatalog from '../../components/product/ProductCatalog';

import { FaFileInvoice, FaExchangeAlt, FaCreditCard, FaBoxOpen, FaLink } from 'react-icons/fa';
import PaymentLinks from '../../components/payments/PaymentLinks';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('invoice');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'invoice') {
      const fetchInvoices = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;

          if (!user) {
            setError('User not logged in');
            setLoading(false);
            return;
          }

          const q = query(
            collection(db, 'invoices'),
            where('createdBy', '==', user.uid)
          );

          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setInvoices(data);
          setLoading(false);
        } catch (err) {
          setError('Failed to load invoices: ' + err.message);
          setLoading(false);
        }
      };

      setLoading(true);
      setError('');
      fetchInvoices();
    }
  }, [activeTab]);

  const tabStyle = {
    cursor: 'pointer',
    padding: '10px 20px',
    borderBottom: '3px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 'bold',
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '3px solid #1E3A8A', // Navy Blue underline
    color: '#1E3A8A',
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginBottom: 20 }}>
        <div
          style={activeTab === 'invoice' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('invoice')}
        >
          <FaFileInvoice size={20} />
          Invoice
        </div>
        <div
          style={activeTab === 'transaction' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('transaction')}
        >
          <FaExchangeAlt size={20} />
          Transaction
        </div>
        <div
          style={activeTab === 'payment' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('payment')}
        >
          <FaCreditCard size={20} />
          Payment Integration
        </div>
        <div
          style={activeTab === 'product' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('product')}
        >
          <FaBoxOpen size={20} />
          Product Catalog
        </div>
        <div
          style={activeTab === 'paymentlinks' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('paymentlinks')}
        >
          <FaLink size={20} />
          Payment Links
        </div>
      </div>

      <hr />

      {/* Tab content */}
      {activeTab === 'invoice' && (
        <>
          <AddInvoiceForm />
          <div style={{ marginTop: 20 }}>
            <h2>Your Invoices</h2>
            {loading && <p>Loading invoices...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && invoices.length === 0 && <p>No invoices found.</p>}
            {!loading && invoices.length > 0 && (
              <ul>
                {invoices.map((inv) => (
                  <li key={inv.id}>
                    Vendor: {inv.vendorId} | Invoice: {inv.invoiceId} | Amount: ₹{inv.amount} | Status: {inv.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {activeTab === 'transaction' && <AddTransactionForm />}
      {activeTab === 'payment' && <AddPaymentIntegrationForm />}
      {activeTab === 'product' && <ProductCatalog />}
      {activeTab === 'paymentlinks' && <PaymentLinks />}
    </div>
  );
}
