import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { appointmentsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Appointments.css';

const Appointments = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Appointment booked successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? undefined : filter;
      const response = await appointmentsAPI.getMy(status);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await appointmentsAPI.cancel(id);
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const openReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setReview({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      await reviewsAPI.create({
        provider_id: selectedAppointment.provider_id,
        appointment_id: selectedAppointment.id,
        rating: review.rating,
        comment: review.comment
      });
      setShowReviewModal(false);
      setSuccessMessage('Review submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-error'
    };
    return `badge ${statusClasses[status] || 'badge-default'}`;
  };

  const isPast = (date, time) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return appointmentDate < new Date();
  };

  if (!user) {
    return (
      <div className="appointments-page">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Please login to view your appointments</h2>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="container">
          <h1>My Appointments</h1>
          <p>View and manage your bookings</p>
        </div>
      </div>

      <div className="container">
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="appointments-controls">
          <div className="filter-tabs">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Link to="/services" className="btn btn-primary">
            Book New Appointment
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <h3>No appointments found</h3>
            <p>You haven't booked any appointments yet</p>
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card card">
                <div className="appointment-main">
                  <div className="appointment-service">
                    <h3>{appointment.service_name}</h3>
                    <p className="provider-name">with {appointment.provider_name}</p>
                  </div>
                  <div className="appointment-datetime">
                    <div className="date">
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="time">{appointment.appointment_time}</div>
                  </div>
                  <div className="appointment-details">
                    <span className="duration">{appointment.duration} min</span>
                    <span className="price">${appointment.price}</span>
                  </div>
                  <div className="appointment-status">
                    <span className={getStatusBadge(appointment.status)}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                <div className="appointment-actions">
                  {appointment.status === 'pending' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                  )}
                  {appointment.status === 'completed' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openReviewModal(appointment)}
                    >
                      Leave Review
                    </button>
                  )}
                  {isPast(appointment.appointment_date, appointment.appointment_time) &&
                    appointment.status === 'confirmed' && (
                      <span className="past-note">Awaiting completion</span>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave a Review</h3>
            <p>How was your experience with {selectedAppointment?.provider_name}?</p>

            <div className="rating-input">
              <label>Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${star <= review.rating ? 'active' : ''}`}
                    onClick={() => setReview({ ...review, rating: star })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="Share your experience..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
