import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you could send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', service: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch - I'd love to hear from you!</p>
        </div>
      </div>

      <div className="container contact-container">
        {/* Contact Form */}
        <section className="contact-section">
          <h2>Get In Touch</h2>
          <p className="section-description">
            Have a question or want to book an appointment? Fill out the form below and I'll get back to you as soon as possible.
          </p>

          {submitted && (
            <div className="alert alert-success">
              Thank you for your message! I'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Service You're Interested In</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Select a service</option>
                <option value="brows">Brows</option>
                <option value="lashes">Lashes</option>
                <option value="waxing">Waxing</option>
                <option value="makeup">Makeup</option>
                <option value="skincare">Skincare</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Your Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me more about what you're looking for..."
                rows="5"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              Send Message
            </button>
          </form>
        </section>

        {/* Cancellation Policy */}
        <section className="policy-section">
          <h2>Cancellation Policy</h2>
          <div className="policy-content">
            <p>
              I understand that sometimes plans change. To ensure the best experience for all clients,
              please note the following cancellation policy:
            </p>
            <ul>
              <li>
                <strong>24+ hours notice:</strong> Full refund or free reschedule
              </li>
              <li>
                <strong>12-24 hours notice:</strong> 50% cancellation fee applies
              </li>
              <li>
                <strong>Less than 12 hours notice:</strong> Full charge applies
              </li>
              <li>
                <strong>No-shows:</strong> Full charge and may affect future bookings
              </li>
            </ul>
            <p>
              To cancel or reschedule, please contact me via WhatsApp, email, or phone as soon as possible.
              I appreciate your understanding and cooperation!
            </p>
          </div>
        </section>

        {/* WhatsApp Section */}
        <section className="whatsapp-section">
          <h2>Message Us on WhatsApp</h2>
          <p>For quick responses and easy booking, reach out on WhatsApp!</p>
          <a
            href="https://wa.me/447123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <span className="whatsapp-icon">📱</span>
            Chat on WhatsApp
          </a>
          <p className="whatsapp-note">
            Available Monday - Saturday, 9am - 7pm
          </p>
        </section>
      </div>
    </div>
  );
};

export default Contact;
