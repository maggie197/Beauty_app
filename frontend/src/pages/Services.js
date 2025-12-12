import React, { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import { servicesAPI } from '../services/api';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  const categories = ['Hair', 'Nails', 'Makeup', 'Skincare', 'Massage', 'Other'];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await servicesAPI.getAll(category || undefined);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

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
            onClick={() => setCategory('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <h3>No services found</h3>
            <p>Try selecting a different category</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
