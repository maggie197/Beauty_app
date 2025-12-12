import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import ProviderCard from '../components/ProviderCard';
import { servicesAPI, providersAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, providersRes] = await Promise.all([
          servicesAPI.getAll(),
          providersAPI.getAll()
        ]);
        setServices(servicesRes.data.slice(0, 6));
        setProviders(providersRes.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Book Your Beauty Appointment Today</h1>
          <p>
            You deserve to feel gorgeous and become the best version of yourself!
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary btn-lg">
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📅</div>
              <h3>Easy Booking</h3>
              <p>Book appointments online 24/7 with real-time availability</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <h3>Verified Reviews</h3>
              <p>Read honest reviews from real customers</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💇</div>
              <h3>Top Professionals</h3>
              <p>Access to skilled and experienced beauty providers</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Safe</h3>
              <p>Your information is always protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Services</h2>
            <Link to="/services" className="view-all">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Providers Section */}
      <section className="section providers-section">
        <div className="container">
          <div className="section-header">
            <h2>Top Rated Providers</h2>
            <Link to="/providers" className="view-all">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="providers-grid">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Are You a Beauty Professional?</h2>
          <p>Join our platform and reach more clients today</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
