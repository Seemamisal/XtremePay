import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import {
  FaFileInvoice,
  FaExchangeAlt,
  FaCreditCard,
  FaBoxOpen,
  FaLink,
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import AddInvoiceForm from '../../components/dashboard/AddInvoiceForm';
import AddTransactionForm from '../../components/dashboard/AddTransactionForm';
import AddPaymentIntegrationForm from '../../components/dashboard/AddPaymentIntegrationForm';
import ProductCatalog from '../../components/product/ProductCatalog';
import PaymentLinks from '../../components/payments/PaymentLinks';
import ProfileInfo from '../../components/dashboard/ProfileInfo';
import SettingsScreen from '../../components/dashboard/SettingsScreen';


 
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('invoice');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const mainLinks = [
    { id: 'home', icon: <FaHome />, label: 'Home' },
    { id: 'invoice', icon: <FaFileInvoice />, label: 'Invoices' },
    { id: 'transaction', icon: <FaExchangeAlt />, label: 'Transactions' },
    { id: 'payment', icon: <FaCreditCard />, label: 'Payments' },
    { id: 'product', icon: <FaBoxOpen />, label: 'Products' },
    { id: 'paymentlinks', icon: <FaLink />, label: 'Payment Links' },
  ];

  const secondaryLinks = [
    { id: 'profile', icon: <FaUser />, label: 'Profile' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
    { id: 'logout', icon: <FaSignOutAlt />, label: 'Logout' },
  ];

  return (
    <div className="dashboard-container">
      <button className="mobile-sidebar-toggle" onClick={toggleMobileSidebar}>
        {mobileSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Xtreme Pay</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="main-links">
            {mainLinks.map((link) => (
              <li
                key={link.id}
                className={activeTab === link.id ? 'active' : ''}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileSidebarOpen(false);
                }}
              >
                <span className="icon">{link.icon}</span>
                {sidebarOpen && <span className="label">{link.label}</span>}
              </li>
            ))}
          </ul>

          <ul className="secondary-links">
            {secondaryLinks.map((link) => (
              <li
                key={link.id}
                onClick={() => {
                  if (link.id === 'logout') {
                    const auth = getAuth();
                    signOut(auth).then(() => {
                      window.location.href = '/auth/Login';
                    });
                  } else {
                    setActiveTab(link.id);
                    setMobileSidebarOpen(false);
                  }
                }}
              >
                <span className="icon">{link.icon}</span>
                {sidebarOpen && <span className="label">{link.label}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </div>

        <div className="content-body">
          {activeTab === 'invoice' && (
            <>
              <AddInvoiceForm />
              <div className="invoice-list-container">
                <h2>Your Invoices</h2>
                {loading && <div className="loading">Loading invoices...</div>}
                {error && <div className="error">{error}</div>}
                {!loading && invoices.length === 0 && (
                  <div className="empty-state"><p>No invoices found.</p></div>
                )}
                {!loading && invoices.length > 0 && (
                  <div className="invoice-list">
                    <div className="invoice-list-header">
                      <div>Vendor</div>
                      <div>Invoice</div>
                      <div>Amount</div>
                      <div>Status</div>
                    </div>
                    {invoices.map((inv) => (
                      <div key={inv.id} className="invoice-item">
                        <div>{inv.vendorId}</div>
                        <div>{inv.invoiceId}</div>
                        <div>₹{inv.amount}</div>
                        <div className={`status ${inv.status.toLowerCase()}`}>{inv.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'transaction' && <AddTransactionForm />}
          {activeTab === 'payment' && <AddPaymentIntegrationForm />}
          {activeTab === 'product' && <ProductCatalog />}
          {activeTab === 'paymentlinks' && <PaymentLinks />}
            {activeTab === 'profile' && <ProfileInfo />}
          {activeTab==='settings' && <SettingsScreen/>}
        </div>



 


      </main>

      <style jsx>{`



  .profile-container {
          max-width: 800px;
          margin: 2rem auto ;
          padding: 2rem;
           background: #ffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Add this new style for actions */
        .profile-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }


        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #0f172a;
          color: #e2e8f0;
        }
        .sidebar {
          width: 250px;
          background-color: #1e293b;
          transition: all 0.3s ease;
          position: relative;
          z-index: 100;
        }
        .sidebar.collapsed {
          width: 70px;
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #334155;
          color: #f8fafc;
        }
        .sidebar-toggle {
          background: none;
          border: none;
          color: #f1f5f9;
          cursor: pointer;
          font-size: 1.2rem;
        }
        .sidebar-nav li {
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background-color 0.2s;
          color: #f1f5f9;
        }
        .sidebar-nav li:hover {
          background-color: #334155;
        }
        .sidebar-nav li.active {
          background-color: #2563eb;
        }
        .main-content {
          flex: 1;
          padding: 20px;
        }
        .content-header h1 {
          color: #f8fafc;
        }
        .invoice-list-container {
          background: #1e293b;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(255, 255, 255, 0.05);
        }
        .invoice-list-header, .invoice-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          padding: 12px 0;
          border-bottom: 1px solid #334155;
          color: #f8fafc;
        }
        .invoice-item:hover {
          background-color: #334155;
        }
        .status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          text-align: center;
          width: fit-content;
        }
        .status.paid {
          background-color: #064e3b;
          color: #34d399;
        }
        .status.pending {
          background-color: #78350f;
          color: #fbbf24;
        }
        .status.overdue {
          background-color: #7f1d1d;
          color: #f87171;
        }
        .loading, .error, .empty-state {
          padding: 20px;
          text-align: center;
          color: #f1f5f9;
        }
        .error {
          background-color: #7f1d1d;
          border-radius: 4px;
        }
        .mobile-sidebar-toggle {
          display: none;
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 1000;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -250px;
            height: 100vh;
          }
          .sidebar.mobile-open {
            left: 0;
          }
          .sidebar.collapsed {
            left: -70px;
          }
          .mobile-sidebar-toggle {
            display: block;
          }
          .main-content {
            margin-left: 0 !important;
          }
          .invoice-list-header, .invoice-item {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
