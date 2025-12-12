import React, { useState, useEffect } from 'react';
import ProviderCard from '../components/ProviderCard';
import { providersAPI } from '../services/api';
import './Providers.css';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await providersAPI.getAll();
        setProviders(response.data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return (
    <div className="providers-page">
      <div className="page-header">
        <div className="container">
          <h1>Our Professionals</h1>
          <p>Meet our talented beauty experts</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : providers.length === 0 ? (
          <div className="empty-state">
            <h3>No providers available</h3>
            <p>Check back soon for new professionals</p>
          </div>
        ) : (
          <div className="providers-grid">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers;
