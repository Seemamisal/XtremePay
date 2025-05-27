// src/components/payment/paymentLinks.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

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

  return (
    <div>
      <h2>Payment Links</h2>
      {paymentLinks.length === 0 ? (
        <p>No payment links found.</p>
      ) : (
        <ul>
          {paymentLinks.map(link => (
            <li key={link.id}>
              Product: {link.productName} — ₹{link.price}<br />
              Link: <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
