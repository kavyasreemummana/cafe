import React, { useState, useEffect } from 'react';
import apiService from '../services/api.js';

const MenuCarousel = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMenuItems({ limit: 100, available: true, sortBy: 'name', sortOrder: 'asc' });
        const items = Array.isArray(response?.data) ? response.data : [];
        const normalized = items.map((it) => ({
          ...it,
          id: it.id || it._id || `${it.name}-${it.category}`
        }));
        setMenuItems(normalized);
      } catch (err) {
        setError(err?.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const itemsPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(menuItems.length / itemsPerSlide));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };



  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return menuItems.slice(startIndex, startIndex + itemsPerSlide);
  };

  if (loading) {
    return (
      <div className="menu-carousel">
        <div className="carousel-container">
          <div className="menu-cards">Loading menu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-carousel">
        <div className="carousel-container">
          <div className="menu-cards">{error}</div>
        </div>
      </div>
    );
  }

  if (!menuItems.length) {
    return (
      <div className="menu-carousel">
        <div className="carousel-container">
          <div className="menu-cards">No items available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-carousel">
      <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
        ‹
      </button>
      
      <div className="carousel-container">
        <div className="menu-cards">
          {getCurrentItems().map((item, index) => (
            <div key={item.id} className="menu-card" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="card-image">
                <img src={item.image || ''} alt={item.name} className="item-image" />
              </div>
              <div className="card-content">
                <span className="item-category">{item.category}</span>
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="card-footer">
                                     <span className="item-price">₹{(item.price * 83.5).toFixed(2)}</span>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => onAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
        ›
      </button>

      <div className="carousel-indicators">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuCarousel;

