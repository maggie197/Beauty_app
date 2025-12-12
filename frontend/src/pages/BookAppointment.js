import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { servicesAPI, providersAPI, appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './BookAppointment.css';

const BookAppointment = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [booking, setBooking] = useState({
    service_id: serviceId || '',
    provider_id: searchParams.get('provider') || '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const servicesRes = await servicesAPI.getAll();
        setServices(servicesRes.data);

        if (booking.service_id) {
          const providersRes = await providersAPI.getByService(booking.service_id);
          setProviders(providersRes.data);
          setStep(booking.provider_id ? 3 : 2);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [booking.service_id, booking.provider_id]);

  const handleServiceSelect = async (id) => {
    setBooking({ ...booking, service_id: id, provider_id: '' });
    setLoading(true);
    try {
      const response = await providersAPI.getByService(id);
      setProviders(response.data);
      setStep(2);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (id) => {
    setBooking({ ...booking, provider_id: id });
    setStep(3);
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setBooking({ ...booking, appointment_date: date, appointment_time: '' });

    if (date && booking.provider_id) {
      setLoading(true);
      try {
        const response = await appointmentsAPI.getAvailableSlots(booking.provider_id, date);
        setAvailableSlots(response.data.slots || []);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTimeSelect = (time) => {
    setBooking({ ...booking, appointment_time: time });
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await appointmentsAPI.create(booking);
      navigate('/appointments?success=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === parseInt(booking.service_id));
  const selectedProvider = providers.find(p => p.id === parseInt(booking.provider_id));

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading && step === 1) {
    return (
      <div className="loading-container" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="book-page">
      <div className="page-header">
        <div className="container">
          <h1>Book Appointment</h1>
          <p>Select your service, provider, and preferred time</p>
        </div>
      </div>

      <div className="container booking-container">
        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Service</span>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Provider</span>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Date & Time</span>
          </div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        <div className="booking-content">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="booking-step">
              <h2>Select a Service</h2>
              <div className="options-grid">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`option-card ${booking.service_id === service.id.toString() ? 'selected' : ''}`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <h4>{service.name}</h4>
                    <p>{service.duration} min</p>
                    <span className="price">${service.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Provider */}
          {step === 2 && (
            <div className="booking-step">
              <h2>Select a Provider</h2>
              <button className="back-btn" onClick={() => setStep(1)}>← Back to Services</button>
              {providers.length === 0 ? (
                <p className="no-options">No providers available for this service</p>
              ) : (
                <div className="options-grid">
                  {providers.map((provider) => (
                    <div
                      key={provider.id}
                      className={`option-card provider ${booking.provider_id === provider.id.toString() ? 'selected' : ''}`}
                      onClick={() => handleProviderSelect(provider.id)}
                    >
                      <h4>{provider.name}</h4>
                      <p>{provider.specialties}</p>
                      <div className="provider-rating">
                        <span className="stars">★</span>
                        <span>{provider.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <div className="booking-step">
              <h2>Select Date & Time</h2>
              <button className="back-btn" onClick={() => setStep(2)}>← Back to Providers</button>

              <div className="date-picker">
                <label>Select Date</label>
                <input
                  type="date"
                  value={booking.appointment_date}
                  onChange={handleDateChange}
                  min={getTomorrow()}
                />
              </div>

              {booking.appointment_date && (
                <div className="time-slots">
                  <label>Available Times</label>
                  {loading ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="no-options">No available slots for this date</p>
                  ) : (
                    <div className="slots-grid">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          className={`slot-btn ${booking.appointment_time === slot ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="booking-step">
              <h2>Confirm Booking</h2>
              <button className="back-btn" onClick={() => setStep(3)}>← Back to Date & Time</button>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="booking-summary">
                <div className="summary-item">
                  <span className="label">Service</span>
                  <span className="value">{selectedService?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Provider</span>
                  <span className="value">{selectedProvider?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Date</span>
                  <span className="value">
                    {new Date(booking.appointment_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Time</span>
                  <span className="value">{booking.appointment_time}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Duration</span>
                  <span className="value">{selectedService?.duration} minutes</span>
                </div>
                <div className="summary-item total">
                  <span className="label">Total</span>
                  <span className="value">${selectedService?.price}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  placeholder="Any special requests or notes for your appointment..."
                  rows="3"
                />
              </div>

              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
