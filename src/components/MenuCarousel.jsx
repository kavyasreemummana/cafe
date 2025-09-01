import React, { useState, useEffect } from 'react';

const MenuCarousel = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const menuItems = [
    {
      id: 1,
      name: "Classic Espresso",
      description: "Rich and bold espresso shot with perfect crema",
      price: 3.50,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      category: "Coffee"
    },
    {
      id: 2,
      name: "Cappuccino",
      description: "Espresso with steamed milk and foam art",
      price: 4.25,
      image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      category: "Coffee"
    },
    {
      id: 3,
      name: "Caramel Macchiato",
      description: "Sweet caramel with espresso and steamed milk",
      price: 5.00,
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      category: "Coffee"
    },
    {
      id: 4,
      name: "Chocolate Croissant",
      description: "Buttery croissant filled with rich chocolate",
      price: 3.75,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      category: "Pastry"
    },
    {
      id: 5,
      name: "Blueberry Muffin",
      description: "Fresh baked muffin bursting with blueberries",
      price: 2.95,
      image: "https://thebusybaker.ca/wp-content/uploads/2020/07/blueberry-muffins-3.jpg",
      category: "Pastry"
    },
    {
      id: 6,
      name: "Avocado Toast",
      description: "Smashed avocado on artisan sourdough bread",
      price: 7.50,
             image: "https://www.spendwithpennies.com/wp-content/uploads/2025/03/1200-Avocado-Toast-2-SpendWithPennies-1-800x1200.jpg",
      category: "Food"
    },
    {
      id: 7,
      name: "Iced Vanilla Latte",
      description: "Cold brew with vanilla syrup and milk",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      category: "Cold Drinks"
    },
    {
      id: 8,
      name: "Green Tea",
      description: "Premium organic green tea leaves",
      price: 2.75,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      category: "Tea"
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(menuItems.length / itemsPerSlide);

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
                <img src={item.image} alt={item.name} className="item-image" />
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

