import React from 'react';

const Cart = ({ items, onClose, onRemoveItem, onUpdateQuantity, onCheckout, totalPrice }) => {
  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-icon">🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <span className="item-price">₹{(item.price * 83.5).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="total-price">
                  <strong>Total: ₹{(totalPrice * 83.5).toFixed(2)}</strong>
                </div>
                <button className="checkout-btn" onClick={onCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

