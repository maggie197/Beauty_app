import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { id: 1, name: 'Brow Wax', price: 8 },
    { id: 2, name: 'Brow Tint', price: 10 },
    { id: 3, name: 'Brow Wax & Standard Tint', price: 15 },
    { id: 4, name: 'Brow Wax & Hybrid Tint', description: 'Hybrid tint', price: 20 },
    { id: 5, name: 'Brow Lamination', description: 'Includes Wax and Standard Tint', price: 30 },
  ];

  const handleSelect = (service) => {
    setSelectedService(selectedService?.id === service.id ? null : service);
  };

  return (
    <div className="services-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Choose a service to book your appointment</p>
        </div>
      </div>

      <div className="container">
        <div className="services-list">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => handleSelect(service)}
            >
              <div className="service-info">
                <h3>{service.name}</h3>
                {service.description && <p className="service-description">{service.description}</p>}
              </div>
              <div className="service-price">£{service.price}</div>
            </div>
          ))}
        </div>

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
