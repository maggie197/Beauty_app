import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      const allServices = response.data;
      setServices(allServices);

      // Extract unique categories
      const uniqueCategories = [...new Set(allServices.map(s => s.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (service) => {
    setSelectedService(selectedService?.id === service.id ? null : service);
  };

  const filteredServices = category
    ? services.filter(s => s.category === category)
    : services;

  if (loading) {
    return (
      <div className="services-page">
        <div className="page-header">
          <div className="container">
            <h1>Our Services</h1>
            <p>Browse our wide range of beauty services</p>
          </div>
        </div>
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

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

        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <h3>No Services Available</h3>
            <p>Check back soon for our services</p>
          </div>
        ) : (
          <div className="services-list">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                onClick={() => handleSelect(service)}
              >
                <div className="service-info">
                  <h3>{service.name}</h3>
                  {service.description && <p className="service-description">{service.description}</p>}
                  {service.duration && <span className="service-duration">{service.duration} min</span>}
                </div>
                <div className="service-price">£{service.price}</div>
              </div>
            ))}
          </div>
        )}

        {selectedService && (
          <div className="booking-action">
            <Link to={`/book/${selectedService.id}`} className="btn btn-primary btn-lg">
              Book {selectedService.name} - £{selectedService.price}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
