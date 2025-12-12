import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { providersAPI, reviewsAPI } from '../services/api';
import './ProviderDetail.css';

const ProviderDetail = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providerRes, reviewsRes] = await Promise.all([
          providersAPI.getById(id),
          reviewsAPI.getProviderReviews(id)
        ]);
        setProvider(providerRes.data);
        setReviews(reviewsRes.data.reviews);
      } catch (error) {
        console.error('Error fetching provider:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'full' : 'empty'}`}>★</span>
      );
    }
    return stars;
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Provider not found</h2>
        <Link to="/providers" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Providers
        </Link>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';

  return (
    <div className="provider-detail-page">
      <div className="provider-hero">
        <div className="container">
          <div className="provider-hero-content">
            <div className="provider-avatar">
              <img
                src={provider.image ? `http://localhost:5000${provider.image}` : defaultImage}
                alt={provider.name}
              />
            </div>
            <div className="provider-info">
              <h1>{provider.name}</h1>
              {provider.specialties && (
                <p className="specialties">{provider.specialties}</p>
              )}
              <div className="rating-info">
                <div className="stars">
                  {renderStars(Math.round(provider.rating || 0))}
                </div>
                <span>{provider.rating?.toFixed(1) || '0.0'}</span>
                <span>({provider.total_reviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container provider-content">
        <div className="provider-main">
          {provider.bio && (
            <section className="provider-section">
              <h2>About</h2>
              <p>{provider.bio}</p>
            </section>
          )}

          {provider.services && provider.services.length > 0 && (
            <section className="provider-section">
              <h2>Services Offered</h2>
              <div className="services-list">
                {provider.services.map((service) => (
                  <div key={service.id} className="service-item">
                    <div className="service-info">
                      <h4>{service.name}</h4>
                      <span className="duration">{service.duration} min</span>
                    </div>
                    <div className="service-actions">
                      <span className="price">${service.price}</span>
                      <Link
                        to={`/book/${service.id}?provider=${id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="provider-section">
            <h2>Reviews</h2>
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.client_name}</span>
                      <div className="stars small">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    {review.comment && <p className="review-comment">{review.comment}</p>}
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="provider-sidebar">
          <div className="booking-card card">
            <h3>Book an Appointment</h3>
            <p>Select a service to get started</p>
            <Link to={`/book?provider=${id}`} className="btn btn-primary btn-block">
              Book Now
            </Link>
          </div>

          {provider.availability && provider.availability.length > 0 && (
            <div className="availability-card card">
              <h3>Working Hours</h3>
              <ul className="availability-list">
                {provider.availability.map((slot) => (
                  <li key={slot.id}>
                    <span className="day">{getDayName(slot.day_of_week)}</span>
                    <span className="time">
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="contact-card card">
            <h3>Contact</h3>
            {provider.email && <p>Email: {provider.email}</p>}
            {provider.phone && <p>Phone: {provider.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
