import React, { useEffect, useState } from 'react';
import { useStore } from '../stores/useStore';
import { ProductDetector } from '../services/productDetector';
import './popup.css';

export const Popup: React.FC = () => {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentProduct } = useStore();

  useEffect(() => {
    const detectProduct = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          const result = await chrome.tabs.sendMessage(tab.id, {
            type: 'GET_PRODUCT',
          });
          if (result?.product) {
            setProduct(result.product);
            setCurrentProduct(result.product);
          }
        }
      } catch (err) {
        console.error('Failed to detect product:', err);
      } finally {
        setLoading(false);
      }
    };

    detectProduct();
  }, [setCurrentProduct]);

  if (loading) {
    return (
      <div className="popup-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="popup-container">
        <div className="no-product">
          <h2>No Product Detected</h2>
          <p>Navigate to a product page to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="product-header">
        <h1>{product.title}</h1>
        {product.imageUrl && <img src={product.imageUrl} alt={product.title} />}
      </div>

      <div className="product-details">
        <div className="detail-row">
          <span>Brand:</span>
          <strong>{product.brand}</strong>
        </div>
        <div className="detail-row">
          <span>Price:</span>
          <strong>${product.price?.toFixed(2)}</strong>
        </div>
        {product.salePrice && (
          <div className="detail-row">
            <span>Sale Price:</span>
            <strong className="discount">${product.salePrice.toFixed(2)}</strong>
          </div>
        )}
        {product.sku && (
          <div className="detail-row">
            <span>SKU:</span>
            <code>{product.sku}</code>
          </div>
        )}
      </div>

      <button className="btn btn-primary" onClick={() => chrome.runtime.openOptionsPage()}>
        Open Dashboard
      </button>
    </div>
  );
};
