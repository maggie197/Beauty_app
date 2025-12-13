import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Services state
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  });

  // Reviews state
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const servicesRes = await servicesAPI.getAll();
      setServices(servicesRes.data);
      fetchReviews();
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getProviderReviews(1);
      setReviews(response.data.reviews || response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Service handlers
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, serviceForm);
        showMessage('success', 'Service updated successfully');
      } else {
        await servicesAPI.create(serviceForm);
        showMessage('success', 'Service created successfully');
      }
      resetServiceForm();
      fetchData();
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      category: service.category || ''
    });
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      showMessage('success', 'Service deleted successfully');
      fetchData();
    } catch (error) {
      showMessage('error', 'Failed to delete service');
    }
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: ''
    });
  };

  // Review handlers
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsAPI.delete(id);
      showMessage('success', 'Review deleted successfully');
      fetchReviews();
    } catch (error) {
      showMessage('error', 'Failed to delete review');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Manage services and reviews</p>
        </div>
      </div>

      <div className="container admin-container">
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        <div className="admin-content">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="tab-content">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>

              <form onSubmit={handleServiceSubmit} className="service-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Service Name *</label>
                    <input
                      type="text"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      placeholder="e.g., Brow Wax"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      placeholder="e.g., Brows, Waxing"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Service description..."
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (£) *</label>
                    <input
                      type="number"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes) *</label>
                    <input
                      type="number"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      placeholder="30"
                      min="5"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                  </button>
                  {editingService && (
                    <button type="button" className="btn btn-secondary" onClick={resetServiceForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <h2>All Services</h2>
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : services.length === 0 ? (
                <div className="empty-state">
                  <p>No services found. Add your first service above.</p>
                </div>
              ) : (
                <div className="services-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id}>
                          <td>
                            <strong>{service.name}</strong>
                            {service.description && (
                              <small className="service-desc">{service.description}</small>
                            )}
                          </td>
                          <td>{service.category || '-'}</td>
                          <td>£{service.price}</td>
                          <td>{service.duration} min</td>
                          <td className="actions">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEditService(service)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="tab-content">
              <h2>Manage Reviews</h2>
              <p className="tab-description">View and manage customer reviews</p>

              {reviews.length === 0 ? (
                <div className="empty-state">
                  <p>No reviews yet</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="review-info">
                          <strong>{review.client_name || 'Anonymous'}</strong>
                          <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="review-rating">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete Review
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
