import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [category, setCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const categories = ['Brows', 'Waxing', 'Aesthetics', 'Anti-Wrinkle', 'Facials'];

  const browServices = [
    { id: 1, name: 'Brow Wax', price: 8 },
    { id: 2, name: 'Brow Tint', price: 10 },
    { id: 3, name: 'Brow Wax & Standard Tint', price: 15 },
    { id: 4, name: 'Brow Wax & Hybrid Tint', description: 'Hybrid brows', price: 20 },
    { id: 5, name: 'Brow Lamination without tint', price: 25 },
    { id: 6, name: 'Brow Lamination', description: 'includes wax and standart tint', price: 30 },
    { id: 7, name: 'Hybrid Brow', description: 'includes wax and hybrid tint', price: 35 },
    { id: 8, name: 'Micro/Nanoblading including top up', price: 200 },
  ];

  const waxingServices = [
    { id: 8, name: 'Nose Wax', price: 5 },
    { id: 9, name: 'Upper Lip Wax', price: 5 },
    { id: 10, name: 'Chin Wax', price: 5 },
    { id: 11, name: 'Underarms', price: 10 },
    { id: 12, name: 'Lower Back Wax', price: 10 },
    { id: 13, name: 'Full Back Wax', price: 20 },
    { id: 14, name: '1/2 Leg Wax', description: 'Up to above the knee, including toes', price: 20 },
  ];

  const aestheticsServices = [
    { id: 15, name: 'Under Eyes 1 Session', price: 75, category: 'Polynucleotides' },
    { id: 16, name: 'Under Eyes 3 Sessions', price: 200, category: 'Polynucleotides' },
    { id: 17, name: 'Face/Neck/Chest/Hands 1 Session', price: 90, category: 'Polynucleotides' },
    { id: 18, name: 'Face/Neck/Chest/Hands 3 Sessions', price: 240, category: 'Polynucleotides' },
    { id: 19, name: 'Seventy Hyal', price: 60, category: 'Skin Boosters' },
    { id: 20, name: 'Seventy Hyal 3 Sessions', price: 150, category: 'Skin Boosters' },
    { id: 21, name: 'Profhilo', price: 110, category: 'Skin Boosters' },
    { id: 22, name: 'Profhilo 3 Sessions', price: 290, category: 'Skin Boosters' },
    { id: 23, name: 'Small Area', description: 'Chin/Face/Jaw', price: 60, category: 'Lemon Bottle Fat Dissolve' },
    { id: 24, name: 'Small Area 3 Sessions', description: 'Chin/Face/Jaw', price: 140, category: 'Lemon Bottle Fat Dissolve' },
    { id: 25, name: 'Medium Area', description: 'Arms/Bra Fat/Under Bust/Under Bum', price: 85, category: 'Lemon Bottle Fat Dissolve' },
    { id: 26, name: 'Medium Area 3 Sessions', description: 'Arms/Bra Fat/Under Bust/Under Bum', price: 210, category: 'Lemon Bottle Fat Dissolve' },
    { id: 27, name: 'Large Area', description: 'Hips/Abdomen/Thighs', price: 110, category: 'Lemon Bottle Fat Dissolve' },
    { id: 28, name: 'Large Area 3 Sessions', description: 'Hips/Abdomen/Thighs', price: 290, category: 'Lemon Bottle Fat Dissolve' },
  ];

  const antiWrinkleServices = [
    { id: 29, name: 'Female 1 Area', description: 'Crows Feet', price: 109 },
    { id: 30, name: 'Male 1 Area', description: 'Crows Feet', price: 129 },
  ];

  const antiWrinkleNote = "WHY IS THERE A DIFFERENCE PRICE?";

  const handleSelect = (service) => {
    setSelectedService(selectedService?.id === service.id ? null : service);
  };

  const getServicesForCategory = () => {
    switch (category) {
      case 'Brows':
        return browServices;
      case 'Waxing':
        return waxingServices;
      case 'Aesthetics':
        return aestheticsServices;
      case 'Anti-Wrinkle':
        return antiWrinkleServices;
      default:
        return [];
    }
  };

  const currentServices = getServicesForCategory();

  return (
    <div className="services-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Browse our wide range of beauty services</p>
        </div>
      </div>

      <div className="container">
        <div className="filters">
          <button
            className={`filter-btn ${category === '' ? 'active' : ''}`}
            onClick={() => { setCategory(''); setSelectedService(null); }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => { setCategory(cat); setSelectedService(null); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {category === '' ? (
          <div className="empty-state">
            <h3>Select a category</h3>
            <p>Choose a category above to view available services</p>
          </div>
        ) : currentServices.length === 0 ? (
          <div className="empty-state">
            <h3>Coming Soon</h3>
            <p>Services for this category will be available soon</p>
          </div>
        ) : (
          <div className="services-list">
            {currentServices.map((service, index) => (
              <React.Fragment key={service.id}>
                {service.category && (index === 0 || currentServices[index - 1]?.category !== service.category) && (
                  <h3 className="service-subcategory">{service.category}</h3>
                )}
                <div
                  className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(service)}
                >
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    {service.description && <p className="service-description">{service.description}</p>}
                  </div>
                  <div className="service-price">£{service.price}</div>
                </div>
              </React.Fragment>
            ))}
            {category === 'Anti-Wrinkle' && (
              <p className="service-note">{antiWrinkleNote}</p>
            )}
          </div>
        )}

        {selectedService && (
          <div className="booking-action">
            <Link to={`/book?service=${selectedService.id}`} className="btn btn-primary btn-lg">
              Book {selectedService.name} - £{selectedService.price}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
