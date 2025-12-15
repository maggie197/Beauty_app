import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Reviews.css';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAll();
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showMessage('error', 'Please log in to leave a review');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsAPI.create({
        provider_id: 1,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      showMessage('success', 'Thank you for your review!');
      setReviewForm({ rating: 5, comment: '' });
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="reviews-page">
      <div className="page-header">
        <div className="container">
          <h1>Client Reviews</h1>
          <p>See what our lovely clients have to say</p>
        </div>
      </div>

      <div className="container reviews-container">
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="reviews-header">
          <div className="reviews-summary">
            <span className="total-reviews">{reviews.length} Reviews</span>
          </div>
          {user ? (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          ) : (
            <p className="login-prompt">Please <a href="/login">log in</a> to leave a review</p>
          )}
        </div>

        {showForm && (
          <div className="review-form-container">
            <h3>Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= reviewForm.rating ? 'active' : ''}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Tell us about your experience..."
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.client_name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <h4>{review.client_name || 'Anonymous'}</h4>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
