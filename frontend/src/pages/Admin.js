import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI, reviewsAPI, productsAPI } from '../services/api';
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

  // Products state
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      fetchProducts();
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  // Product handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('stock', productForm.stock);
      if (productImage) {
        formData.append('image', productImage);
      }

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        showMessage('success', 'Product updated successfully');
      } else {
        await productsAPI.create(formData);
        showMessage('success', 'Product created successfully');
      }
      resetProductForm();
      fetchProducts();
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      stock: product.stock || ''
    });
    setProductImage(null);
    setImagePreview(product.image ? `http://localhost:5000${product.image}` : null);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      showMessage('success', 'Product deleted successfully');
      fetchProducts();
    } catch (error) {
      showMessage('error', 'Failed to delete product');
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: ''
    });
    setProductImage(null);
    setImagePreview(null);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Manage services, products and reviews</p>
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
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
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

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="tab-content">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

              <form onSubmit={handleProductSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g., Brow Gel"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      placeholder="e.g., Skincare, Haircare"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Product description..."
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (£) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => { setProductImage(null); setImagePreview(null); }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <h2>All Products</h2>
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <p>No products found. Add your first product above.</p>
                </div>
              ) : (
                <div className="products-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            {product.image ? (
                              <img
                                src={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                className="product-thumbnail"
                              />
                            ) : (
                              <div className="no-image">No image</div>
                            )}
                          </td>
                          <td>
                            <strong>{product.name}</strong>
                            {product.description && (
                              <small className="product-desc">{product.description}</small>
                            )}
                          </td>
                          <td>{product.category || '-'}</td>
                          <td>£{product.price}</td>
                          <td>{product.stock || 0}</td>
                          <td className="actions">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDeleteProduct(product.id)}
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
