import React, { useState, useEffect } from 'react';
import { appointmentsAPI, providersAPI, servicesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [dateFilter, setDateFilter] = useState('');
  const [profile, setProfile] = useState({ bio: '', specialties: '' });
  const [availability, setAvailability] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, servicesRes] = await Promise.all([
        appointmentsAPI.getProviderAppointments(undefined, dateFilter || undefined),
        servicesAPI.getAll()
      ]);
      setAppointments(appointmentsRes.data);
      setAllServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentsAPI.updateStatus(id, status);
      fetchData();
      showMessage('success', 'Status updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update status');
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await providersAPI.updateProfile(profile);
      showMessage('success', 'Profile updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleServicesSave = async () => {
    setSaving(true);
    try {
      await providersAPI.setServices(selectedServices);
      showMessage('success', 'Services updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update services');
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilitySave = async () => {
    setSaving(true);
    try {
      await providersAPI.setAvailability(availability);
      showMessage('success', 'Availability updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const addAvailabilitySlot = () => {
    setAvailability([...availability, { day_of_week: 1, start_time: '09:00', end_time: '17:00' }]);
  };

  const updateAvailabilitySlot = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const removeAvailabilitySlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-error'
    };
    return `badge ${classes[status] || ''}`;
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="container">
          <h1>Provider Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="container dashboard-container">
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            My Services
          </button>
          <button
            className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            Availability
          </button>
        </div>

        <div className="dashboard-content">
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Appointments</h2>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="date-filter"
                />
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="empty-state">
                  <p>No appointments {dateFilter ? 'for this date' : 'yet'}</p>
                </div>
              ) : (
                <div className="appointments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt) => (
                        <tr key={apt.id}>
                          <td>
                            <strong>{apt.client_name}</strong>
                            <br />
                            <small>{apt.client_email}</small>
                          </td>
                          <td>{apt.service_name}</td>
                          <td>{new Date(apt.appointment_date).toLocaleDateString()}</td>
                          <td>{apt.appointment_time}</td>
                          <td>
                            <span className={getStatusBadge(apt.status)}>{apt.status}</span>
                          </td>
                          <td className="actions">
                            {apt.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="btn btn-sm btn-error"
                                  onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {apt.status === 'confirmed' && (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleStatusUpdate(apt.id, 'completed')}
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Edit Profile</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell clients about yourself..."
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Specialties</label>
                  <input
                    type="text"
                    value={profile.specialties}
                    onChange={(e) => setProfile({ ...profile, specialties: e.target.value })}
                    placeholder="e.g., Hair Coloring, Balayage, Bridal Makeup"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleProfileSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="tab-content">
              <h2>My Services</h2>
              <p className="tab-description">Select the services you offer</p>
              <div className="services-checklist">
                {allServices.map((service) => (
                  <label key={service.id} className="service-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                    />
                    <span className="service-info">
                      <strong>{service.name}</strong>
                      <small>{service.duration} min - ${service.price}</small>
                    </span>
                  </label>
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleServicesSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Services'}
              </button>
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="tab-content">
              <h2>Working Hours</h2>
              <p className="tab-description">Set your availability for each day</p>

              <div className="availability-list">
                {availability.map((slot, index) => (
                  <div key={index} className="availability-row">
                    <select
                      value={slot.day_of_week}
                      onChange={(e) => updateAvailabilitySlot(index, 'day_of_week', parseInt(e.target.value))}
                    >
                      {days.map((day, i) => (
                        <option key={i} value={i}>{day}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => updateAvailabilitySlot(index, 'start_time', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => updateAvailabilitySlot(index, 'end_time', e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => removeAvailabilitySlot(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn btn-secondary add-slot-btn" onClick={addAvailabilitySlot}>
                + Add Time Slot
              </button>

              <button
                className="btn btn-primary"
                onClick={handleAvailabilitySave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Availability'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
