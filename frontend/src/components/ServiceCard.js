import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400';

  return (
    <div className="service-card card">
      <div className="service-image">
        <img
          src={service.image ? `http://localhost:5000${service.image}` : defaultImage}
          alt={service.name}
        />
        {service.category && (
          <span className="service-category">{service.category}</span>
        )}
      </div>
      <div className="service-content">
        <h3 className="service-name">{service.name}</h3>
        <p className="service-description">{service.description}</p>
        <div className="service-details">
          <span className="service-duration">{service.duration} min</span>
          <span className="service-price">${service.price}</span>
        </div>
        <Link to={`/book/${service.id}`} className="btn btn-primary service-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
