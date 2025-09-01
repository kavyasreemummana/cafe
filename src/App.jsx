import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import MenuCarousel from './components/MenuCarousel';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    alert('Order placed successfully! Thank you for your purchase.');
  };

  return (
    <AuthProvider>
      <div className="App">
      <Header 
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className="main-content">
        <section id="home" className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Brew & Beans</h1>
            <p className="hero-subtitle">Experience the perfect blend of coffee and comfort</p>
          </div>
        </section>

        <section id="menu" className="menu-section">
          <h2 className="section-title">Our Menu</h2>
          <MenuCarousel onAddToCart={addToCart} />
        </section>

        <section id="about" className="about-section">
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Our Story</h3>
              <p>Founded in 2020, Brew & Beans began as a small coffee cart with a big dream - to serve the perfect cup of coffee to our community. What started as a passion project has grown into a beloved local cafe where friends gather, ideas brew, and memories are made.</p>
              
              <h3>Our Philosophy</h3>
              <p>We believe that great coffee is more than just a beverage - it's an experience. From carefully selected beans to expertly crafted drinks, every element is designed to create moments of joy and connection.</p>
              
              <h3>Our Commitment</h3>
              <p>We're committed to sustainability, sourcing our beans from ethical farms and using eco-friendly packaging. Every cup supports our mission to make the world a better place, one sip at a time.</p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="Coffee Shop Interior" />
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <h3>📍 Location</h3>
                <p>123 Coffee Street<br />Brew City, BC 12345</p>
              </div>
              <div className="contact-item">
                <h3>📞 Phone</h3>
                <p>(555) 123-4567</p>
              </div>
              <div className="contact-item">
                <h3>✉️ Email</h3>
                <p>hello@brewandbeans.com</p>
              </div>
              <div className="contact-item">
                <h3>🕒 Hours</h3>
                <p>Monday - Friday: 7:00 AM - 8:00 PM<br />
                Saturday - Sunday: 8:00 AM - 9:00 PM</p>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          totalPrice={getTotalPrice()}
        />
      )}

      {isCheckoutOpen && (
        <Checkout
          items={cartItems}
          totalPrice={getTotalPrice()}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}
      </div>
    </AuthProvider>
  );
}

export default App;

