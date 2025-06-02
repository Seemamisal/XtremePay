 



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
  FaDochub,
  FaUserCog,
} from 'react-icons/fa';
import AddInvoiceForm from '../../components/dashboard/AddInvoiceForm';
import AddTransactionForm from '../../components/dashboard/AddTransactionForm';
import AddPaymentIntegrationForm from '../../components/dashboard/AddPaymentIntegrationForm';
import ProductCatalog from '../../components/product/ProductCatalog';
import PaymentLinks from '../../components/payments/PaymentLinks';
import ProfileInfo from '../../components/dashboard/ProfileInfo';
import SettingsScreen from '../../components/dashboard/SettingsScreen';
import DocumentUpload from '../../components/dashboard/DocumentUpload';
import AdminOnboardingReview from '../../components/onboarding/AdminOnboardingReview';
import { FaCircleArrowRight } from 'react-icons/fa6';

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
    { id: 'onboardingDocument', icon: <FaDochub />, label: 'Onboarding Process' },
    { id: 'adminPanel', icon: <FaUserCog/>, label: 'Admin Panel' },
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
          {activeTab === 'adminPanel' && <AdminOnboardingReview />}
          {activeTab === 'settings' && <SettingsScreen />}
          {activeTab === 'onboardingDocument' && <DocumentUpload />}
        </div>
      </main>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 250px;
          background-color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          z-index: 100;
          border-right: 1px solid #e2e8f0;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          color: #2d3748;
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: #4a5568;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .sidebar-nav {
          padding: 1rem 0;
        }

        .sidebar-nav li {
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background-color 0.2s;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .sidebar-nav li:hover {
          background-color: #f0f4f8;
        }

        .sidebar-nav li.active {
          background-color: #ebf4ff;
          color: #3182ce;
          border-left: 3px solid #3182ce;
        }

        .sidebar-nav li.active .icon {
          color: #3182ce;
        }

  

        .icon {
          font-size: 1rem;
          color: #718096;
        }

        .label {
          white-space: nowrap;
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          padding: 2rem;
          background-color: #f5f7fa;
        }

        .content-header {
          margin-bottom: 2rem;
        }

        .content-header h1 {
          font-size: 1.75rem;
          color: #2d3748;
          margin: 0;
        }

        /* Invoice List Styles */
        .invoice-list-container {
          background: #ffffff;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .invoice-list-container h2 {
          font-size: 1.25rem;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .invoice-list-header, .invoice-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .invoice-list-header {
          font-weight: 600;
          color: #2d3748;
          border-bottom: 2px solid #e2e8f0;
        }

        .invoice-item:hover {
          background-color: #f8fafc;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          text-align: center;
          width: fit-content;
        }

        .status.paid {
          background-color: #f0fff4;
          color: #38a169;
        }

        .status.pending {
          background-color: #fffaf0;
          color: #dd6b20;
        }

        .status.overdue {
          background-color: #fff5f5;
          color: #e53e3e;
        }

        /* Loading and Error States */
        .loading, .error, .empty-state {
          padding: 2rem;
          text-align: center;
          color: #718096;
          background: #ffffff;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .error {
          background-color: #fff5f5;
          color: #e53e3e;
        }

        /* Mobile Styles */
        .mobile-sidebar-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: #ffffff;
          color: #4a5568;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 600px) {
          .sidebar {
            position: fixed;
            
            left: -250px;
            height: 100vh;
            z-index: 999;
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
            padding: 1.5rem;
          }

          .invoice-list-header, .invoice-item {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .invoice-list-container {
            padding: 1.5rem;
          }
        }

        /* Profile Container */
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .profile-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f4f8;
        }

 .content-header h1 {
        display:none;
         }


      `}</style>
    </div>
  );
}
