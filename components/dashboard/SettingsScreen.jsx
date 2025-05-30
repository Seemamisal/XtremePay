"use client";

import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  FiLock,
  FiCreditCard,
  FiDollarSign,
  FiSave,
  FiShield,
} from "react-icons/fi";

const SettingsScreen = () => {
  const [paymentKeys, setPaymentKeys] = useState({
    stripePublicKey: "",
    stripeSecretKey: "",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    paypalClientId: "",
    paypalSecret: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          showNotification("User not logged in", "error");
          setLoading(false);
          return;
        }

        const settingsRef = doc(db, "merchantSettings", user.uid);
        const docSnap = await getDoc(settingsRef);

        if (docSnap.exists()) {
          setPaymentKeys(docSnap.data().paymentKeys || {});
        }
        setLoading(false);
      } catch (err) {
        showNotification("Failed to load settings: " + err.message, "error");
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      5000
    );
  };

  const validateInputs = () => {
    const newErrors = {};
    const requiredFields = [
      "stripePublicKey",
      "stripeSecretKey",
      "razorpayKeyId",
      "razorpayKeySecret",
      "paypalClientId",
      "paypalSecret",
    ];

    requiredFields.forEach((field) => {
      if (!paymentKeys[field]) {
        newErrors[field] = "This field is required";
      } else if (field.includes("Secret") || field.includes("Key")) {
        if (paymentKeys[field].length < 32) {
          newErrors[field] = "Key appears too short";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      showNotification("Please fix the errors before saving", "error");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        showNotification("User not logged in", "error");
        return;
      }

      const settingsRef = doc(db, "merchantSettings", user.uid);

      await setDoc(
        settingsRef,
        {
          paymentKeys,
          lastUpdated: new Date(),
        },
        { merge: true }
      );

      showNotification("Payment settings saved successfully", "success");
    } catch (err) {
      showNotification("Failed to save settings: " + err.message, "error");
      console.error("Error details:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentKeys((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const maskSensitiveValue = (value) => {
    if (!value) return "";
    return (
      "•".repeat(Math.min(value.length, 12)) + (value.length > 12 ? "..." : "")
    );
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h2 className="settings-title">
        <FiShield className="icon" /> Payment Gateway Settings
      </h2>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form className="settings-form" onSubmit={handleSave}>
        {/* Stripe Section */}
        <div className="gateway-section">
          <h3 className="gateway-title">
            <FiCreditCard className="icon" /> Stripe Keys
          </h3>

          <div className="form-group">
            <label>Stripe Publishable Key</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="stripePublicKey"
                value={paymentKeys.stripePublicKey}
                onChange={handleChange}
                placeholder="pk_test_..."
                className={errors.stripePublicKey ? "error" : ""}
              />
            </div>
            {errors.stripePublicKey && (
              <span className="error-message">{errors.stripePublicKey}</span>
            )}
            <div className="masked-value">
              Current: {maskSensitiveValue(paymentKeys.stripePublicKey)}
            </div>
          </div>

          <div className="form-group">
            <label>Stripe Secret Key</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="stripeSecretKey"
                value={paymentKeys.stripeSecretKey}
                onChange={handleChange}
                placeholder="sk_test_..."
                className={errors.stripeSecretKey ? "error" : ""}
              />
            </div>
            {errors.stripeSecretKey && (
              <span className="error-message">{errors.stripeSecretKey}</span>
            )}
            <div className="masked-value">
              Current: {maskSensitiveValue(paymentKeys.stripeSecretKey)}
            </div>
          </div>
        </div>

        {/* Razorpay Section */}
        <div className="gateway-section">
          <h3 className="gateway-title">
            <FiDollarSign className="icon" /> Razorpay Keys
          </h3>

          <div className="form-group">
            <label>Razorpay Key ID</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="razorpayKeyId"
                value={paymentKeys.razorpayKeyId}
                onChange={handleChange}
                placeholder="rzp_test_..."
                className={errors.razorpayKeyId ? "error" : ""}
              />
            </div>
            {errors.razorpayKeyId && (
              <span className="error-message">{errors.razorpayKeyId}</span>
            )}
            <div className="masked-value">
              Current: {maskSensitiveValue(paymentKeys.razorpayKeyId)}
            </div>
          </div>

          <div className="form-group">
            <label>Razorpay Key Secret</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="razorpayKeySecret"
                value={paymentKeys.razorpayKeySecret}
                onChange={handleChange}
                placeholder="Razorpay secret key"
                className={errors.razorpayKeySecret ? "error" : ""}
              />
            </div>
            {errors.razorpayKeySecret && (
              <span className="error-message">{errors.razorpayKeySecret}</span>
            )}
            <div className="masked-value">
              Current: {maskSensitiveValue(paymentKeys.razorpayKeySecret)}
            </div>
          </div>
        </div>

        {/* PayPal Section */}
        <div className="gateway-section">
          <h3 className="gateway-title">
            <FiCreditCard className="icon" /> PayPal Keys
          </h3>

          <div className="form-group">
            <label>PayPal Client ID</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="paypalClientId"
                value={paymentKeys.paypalClientId}
                onChange={handleChange}
                placeholder="PayPal client ID"
                className={errors.paypalClientId ? "error" : ""}
              />
            </div>
            {errors.paypalClientId && (
              <span className="error-message">{errors.paypalClientId}</span>
            )}
            <div className="masked-value">
              Current: {maskSensitiveValue(paymentKeys.paypalClientId)}
            </div>
          </div>

          <div className="form-group">
            <label>PayPal Secret</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="paypalSecret"
                value={paymentKeys.paypalSecret}
                onChange={handleChange}
                placeholder="PayPal secret key"
                className={errors.paypalSecret ? "error" : ""}
              />
            </div>
            {errors.paypalSecret && (
              <span className="error-message">{errors.paypalSecret}</span>
            )}
            <div className="masked-value">
              Current: {maskSensitiveValue(paymentKeys.paypalSecret)}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">
            <FiSave className="icon" /> Save All Settings
          </button>
        </div>
      </form>

      <style jsx>{`
        .settings-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .settings-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          color: #2c3e50;
          font-size: 1.5rem;
        }

        .gateway-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .gateway-title {
          display: flex;
          align-items: center;
          text-style: bold;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #4a5568;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 700;
          color: #4a5568;
        }

        .input-with-icon {
          color: #4a5568;

          position: relative;
          border-radius: 1px solid black;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #718096;
        }

        input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
           border-radius: 6px;
          font-size: 0.95rem;
          color:black;
          transition: all 0.2s;
          border: black 1px solid black;
          background-color:white;
        }

        input.error {
          border-color: #e53e3e;
        }

        input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }

        .error-message {
          color: #e53e3e;
          font-size: 0.85rem;
          margin-top: 0.3rem;
          display: block;
        }

        .masked-value {
          color: #718096;
          font-size: 0.85rem;
          margin-top: 0.3rem;
          font-family: monospace;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
         }

        .btn-save {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-save:hover {
          background: #3182ce;
        }

        .notification {
          padding: 0.8rem 1rem;
          margin-bottom: 1.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .notification.success {
          background: #f0fff4;
          color: #38a169;
          border: 1px solid #c6f6d5;
        }

        .notification.error {
          background: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fed7d7;
        }

        .settings-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          color: #4a5568;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4299e1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsScreen;
