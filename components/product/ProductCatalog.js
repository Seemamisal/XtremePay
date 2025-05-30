import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FiPlus, FiDollarSign, FiShoppingBag, FiLink } from "react-icons/fi";

export default function ProductCatalog() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedProviders, setSelectedProviders] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "products"), {
        productName,
        price: price.trim(),
        createdAt: serverTimestamp(),
      });
      setMessage("Product added successfully!");
      setProductName("");
      setPrice("");
      setProducts((prev) => [
        ...prev,
        {
          id: docRef.id,
          productName,
          price: price.trim(),
        },
      ]);
    } catch (e) {
      setMessage("Error: " + e.message);
    }
  };

  const generateRandomToken = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const generatePaymentLink = async (productId, productName, price, provider) => {
    const domainMap = {
      Stripe: "stripe.spare.example.com",
      Razorpay: "razorpay.spare.example.com",
    };

    const baseUrl = domainMap[provider] || "pay.example.com";
    const paymentLink = `https://${baseUrl}/product/${productId}?token=${generateRandomToken()}`;

    try {
      await setDoc(doc(db, "paymentLinks", productId), {
        productId,
        productName,
        price,
        provider,
        link: paymentLink,
        createdAt: serverTimestamp(),
      });
      alert(`Payment link generated successfully for ${provider}!`);
    } catch (error) {
      console.error("Error generating payment link:", error);
      alert("Failed to generate payment link.");
    }
  };

  return (
    <div className="product-catalog-container">
      <div className="product-header">
        <FiShoppingBag className="header-icon" />
        <h2>Product Catalog</h2>
      </div>

      <form onSubmit={handleAddProduct} className="product-form">
        <div className="form-group">
          <label className="form-label">Product Name:</label>
          <input
            className="form-input" placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Price:</label>
          <div className="price-input-container">
            <FiDollarSign className="price-icon" />
            <input
              type="text"
              className="form-input price-input" placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="add-product-btn">
          <FiPlus className="btn-icon" /> Add Product
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <div className="products-section">
        <h3 className="section-title">Products List</h3>
        {products.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          <ul className="products-list">
            {products.map((p) => (
              <li key={p.id} className="product-item">
                <div className="product-info">
                  <span className="product-name">{p.productName}</span>
                  <span className="product-price">₹{p.price}</span>
                </div>

                <div className="product-actions">
                  <select
                    value={selectedProviders[p.id] || "Stripe"}
                    onChange={(e) =>
                      setSelectedProviders((prev) => ({
                        ...prev,
                        [p.id]: e.target.value,
                      }))
                    }
                    className="provider-select"
                  >
                    <option value="Stripe">Stripe</option>
                    <option value="Razorpay">Razorpay</option>
                  </select>

                  <button
                    onClick={() =>
                      generatePaymentLink(
                        p.id,
                        p.productName,
                        p.price,
                        selectedProviders[p.id] || "Stripe"
                      )
                    }
                    className="generate-link-btn"
                  >
                    <FiLink className="btn-icon" /> Generate Link
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .product-catalog-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .product-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
            color: black;
          margin-bottom: 2rem;
        }

        .product-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #2c3e50;
        }

        .header-icon {
          font-size: 1.5rem;
          color: black;
        }

        .product-form {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 700;
          color: #4a5568;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          background-color:white;
          color:black;
          border :1px solid black;
        }

        .form-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }

        .price-input-container {
          position: relative;
          display: flex;
          align-items: center;
          color:black;
        }

        .price-icon {
          position: absolute;
          left: 12px;
          color:  black;
        }

        .price-input {
          padding-left: 2.5rem;
          background-color:white;
     color:black;
          border: 1px solid black;
        }

        .add-product-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-product-btn:hover {
          background: #3182ce;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .message {
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .message.success {
          background: #f0fff4;
          color: #38a169;
          border: 1px solid #c6f6d5;
        }

        .message.error {
          background: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fed7d7;
        }

        .products-section {
          margin-top: 2rem;
        }

        .section-title {
          margin-bottom: 1rem;
          color: #2c3e50;
          font-size: 1.25rem;
        }

        .no-products {
          color: #718096;
          font-style: italic;
        }

        .products-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          transition: transform 0.2s;
        }

        .product-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
         }

        .product-name {
          font-weight: 500;
          color: #2d3748;
        }

        .product-price {
          font-size: 0.9rem;
          // color: #4a5568;
          color:black;
          font-weight:500;
        }

        .product-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .provider-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid black;
          border-radius: 6px;
          background: white;
          font-size: 0.9rem;
          color:black;
        }

        .generate-link-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          color: #4a5568;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .generate-link-btn:hover {
          background: #e9ecef;
        }
      `}</style>
    </div>
  );
}