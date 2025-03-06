import React, { useState, useEffect } from 'react';
import './PestPurchase.css';

// Updated pesticide data with Rupees and Indian products
const initialProducts = [
  {
    id: 1,
    name: 'Neem-based Bio Pesticide',
    price: 599,
    description: 'Organic pest control for multiple crops',
    image: 'https://example.com/pesticide1.jpg',
    category: 'Organic',
    quantity: '1 Litre'
  },
  {
    id: 2,
    name: 'Rice Fungicide Solution',
    price: 899,
    description: 'Effective against blast and sheath blight',
    image: 'https://example.com/pesticide2.jpg',
    category: 'Fungicide',
    quantity: '500 ml'
  },
  // Add more products...
];

const PesticideShop = () => {
  const [cart, setCart] = useState([]);
  const [products] = useState(initialProducts);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cartNotification, setCartNotification] = useState(false);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 2000);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = (formData) => {
    alert(`Order placed successfully!\nTotal: ₹${calculateTotal().toLocaleString('en-IN')}`);
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className="pesticide-shop">
      <nav className="shop-nav">
        <h1>Pesticide Store 🚜</h1>
        <div className="cart-indicator">
          🛒 {cart.length} Items | ₹{calculateTotal().toLocaleString('en-IN')}
        </div>
      </nav>

      {cartNotification && <div className="notification">Item added to cart!</div>}

      <div className="shop-container">
        <ProductList products={products} addToCart={addToCart} />
        
        {cart.length > 0 && (
          <Cart 
            items={cart} 
            removeItem={removeFromCart} 
            updateQuantity={updateQuantity} 
            total={calculateTotal()}
            onCheckout={() => setShowCheckout(true)}
          />
        )}
      </div>

      {showCheckout && (
        <div className="checkout-modal">
          <CheckoutForm 
            onSubmit={handleCheckout} 
            onCancel={() => setShowCheckout(false)}
          />
        </div>
      )}
    </div>
  );
};

const ProductList = ({ products, addToCart }) => (
  <div className="product-list">
    {products.map(product => (
      <div key={product.id} className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-details">
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-meta">
            <span className="product-quantity">{product.quantity}</span>
            <span className="product-category">{product.category}</span>
          </div>
          <div className="product-footer">
            <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
            <button 
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart 🛒
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Cart = ({ items, removeItem, updateQuantity, total, onCheckout }) => (
  <div className="cart">
    <h2>Your Cart ({items.length})</h2>
    <div className="cart-items">
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <div className="item-info">
            <h4>{item.name}</h4>
            <div className="item-meta">
              <span>{item.quantity}</span>
              <span>₹{item.price.toLocaleString('en-IN')}/unit</span>
            </div>
          </div>
          <div className="item-controls">
            <div className="quantity-control">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <div className="item-total">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeItem(item.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
    
    <div className="cart-summary">
      <div className="total-amount">
        <span>Total:</span>
        <span>₹{total.toLocaleString('en-IN')}</span>
      </div>
      <button className="checkout-btn" onClick={onCheckout}>
        Proceed to Checkout →
      </button>
    </div>
  </div>
);

const CheckoutForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    payment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (/^\d{10}$/.test(formData.phone)) {
      onSubmit(formData);
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Delivery Details</h2>
      <div className="form-group">
        <label>Full Name</label>
        <input 
          type="text" 
          required 
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input 
          type="tel" 
          required
          pattern="[0-9]{10}"
          placeholder="10-digit mobile number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Farm Address</label>
        <textarea 
          required 
          placeholder="Enter complete farm address with landmark"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Payment Method</label>
        <select 
          value={formData.payment}
          onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
          required
        >
          <option value="">Select Payment</option>
          <option value="upi">UPI</option>
          <option value="card">Credit/Debit Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="confirm-btn">
          Confirm Order
        </button>
      </div>
    </form>
  );
};

export default PesticideShop;