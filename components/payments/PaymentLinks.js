 
 

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FiLink, FiCopy } from "react-icons/fi";

export default function PaymentLinks() {
  const [paymentLinks, setPaymentLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "paymentLinks"));
        const links = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));     
        setPaymentLinks(links);
      } catch (error) {
        console.error("Error fetching payment links:", error);
      }
    };

    fetchLinks();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="payment-links-container">
      <h2 className="section-title">Payment Links</h2>
      
      {paymentLinks.length === 0 ? (
        <p className="empty-message">No payment links found.</p>
      ) : (
        <div className="table-container">
          <table className="links-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentLinks.map(link => (
                <tr key={link.id} className="table-row">
                  <td className="product-cell">{link.productName}</td>
                  <td className="price-cell">₹{link.price}</td>
                  <td className="link-cell">
                    <a 
                      href={link.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link-url"
                    >
                      {link.link}
                    </a>
                  </td>
                  <td className="action-cell">
                    <button 
                      onClick={() => copyToClipboard(link.link)}
                      className="copy-btn"
                      title="Copy link"
                    >
                      <FiCopy />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .payment-links-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }

        .section-title {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .empty-message {
          color: #718096;
          font-style: italic;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .links-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .links-table th {
          background-color: #f7fafc;
          color: #4a5568;
          font-weight: 600;
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid rgb(184, 201, 224);
        }

        .links-table td {
          padding: 1rem;
          border-bottom: 1px solid rgb(204, 214, 229);
          vertical-align: middle;
        }

        .table-row:hover {
          background-color:rgb(250, 250, 250);
        }

        .product-cell {
          font-weight: 500;
          color: #2d3748;
        }

        .price-cell {
          color: #2f855a;
          font-weight: 500;
        }

        .link-cell {
          min-width: 300px;
        }

        .link-url {
          color: #3182ce;
          text-decoration: none;
          word-break: break-all;
        }

        .link-url:hover {
          text-decoration: underline;
        }

        .action-cell {
          text-align: center;
          width: 60px;
        }

        .copy-btn {
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background-color: #ebf8ff;
          color: #3182ce;
        }

        @media (max-width: 600px) {
          .payment-links-container {
            padding: 1rem;
          }
          
          .links-table th,
          .links-table td {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 600px) {
          .links-table th:nth-child(3),
          .links-table td:nth-child(3) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}