import React from 'react';
import { Link } from 'react-router-dom';
import './ProviderCard.css';

const ProviderCard = ({ provider }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="provider-card card">
      <div className="provider-image">
        <img
          src={provider.image ? `http://localhost:5000${provider.image}` : defaultImage}
          alt={provider.name}
        />
      </div>
      <div className="provider-content">
        <h3 className="provider-name">{provider.name}</h3>
        {provider.specialties && (
          <p className="provider-specialties">{provider.specialties}</p>
        )}
        <div className="provider-rating">
          <div className="stars">
            {renderStars(provider.rating || 0)}
          </div>
          <span className="rating-text">
            {provider.rating?.toFixed(1) || '0.0'} ({provider.total_reviews || 0} reviews)
          </span>
        </div>
        {provider.bio && (
          <p className="provider-bio">{provider.bio}</p>
        )}
        <Link to={`/providers/${provider.id}`} className="btn btn-primary provider-btn">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ProviderCard;
