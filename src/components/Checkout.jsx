import React, { useState } from 'react';
import apiService from '../services/api';

const Checkout = ({ items, totalPrice, onClose, onOrderComplete }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Map cart items to backend expected format
      const orderItems = items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        // specialInstructions/customization could be gathered via UI later
      }));

      // Build order payload aligned with backend schema
      const payload = {
        items: orderItems,
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        orderType: 'delivery',
        paymentMethod: paymentMethod,
        specialRequests: '',
        notes: customerInfo.address
      };

      const response = await apiService.createOrder(payload);

      if (response.success) {
        onOrderComplete();
      } else {
        alert(response.error || 'Failed to place order');
      }
    } catch (error) {
      alert(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.address;

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-sections">
            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.name} × {item.quantity}</span>
                    <span className="item-total">₹{(item.price * item.quantity * 83.5).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Total: ₹{(totalPrice * 83.5).toFixed(2)}</strong>
              </div>
            </div>

            {/* Customer Information */}
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Customer Information</h3>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="address"
                    placeholder="Delivery Address *"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💵 Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={!isFormValid || isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order - ₹${(totalPrice * 83.5).toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

