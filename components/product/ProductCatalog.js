// src/components/product/productCatalog.js
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

export default function ProductCatalog() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch existing products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
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

  // Add new product
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

      // Update products list after adding new product
      setProducts(prev => [...prev, {
        id: docRef.id,
        productName,
        price: price.trim(),
      }]);
    } catch (e) {
      setMessage("Error: " + e.message);
    }
  };

  // Generate random token for payment link
  const generateRandomToken = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Generate payment link and save to Firestore
  const generatePaymentLink = async (productId, productName, price) => {
    const paymentLink = `https://pay.example.com/product/${productId}?token=${generateRandomToken()}`;
    try {
      await setDoc(doc(db, "paymentLinks", productId), {
        productId,
        productName,
        price,
        link: paymentLink,
        createdAt: serverTimestamp(),
      });
      alert("Payment link generated successfully!");
    } catch (error) {
      console.error("Error generating payment link:", error);
      alert("Failed to generate payment link.");
    }
  };

  return (
    <div>
      <h2>Product Catalog</h2>
      <form onSubmit={handleAddProduct}>
        <label>Product Name:</label><br />
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        /><br />

        <label>Price:</label><br />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /><br />

        <button type="submit" style={{ marginTop: 10 }}>Add Product</button>
      </form>
      {message && <p>{message}</p>}

      <h3>Products List:</h3>
      <ul>
        {products.length === 0 ? (
          <li>No products found.</li>
        ) : (
          products.map(p => (
            <li key={p.id}>
              {p.productName} - ₹{p.price}{" "}
              <button
                onClick={() => generatePaymentLink(p.id, p.productName, p.price)}
                style={{ marginLeft: "10px" }}
              >
                Generate Payment Link
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
