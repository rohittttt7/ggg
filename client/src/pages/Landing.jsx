import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ItemCard from '../components/ItemCard'
import './Landing.css'

const Landing = () => {
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeaturedItems()
  }, [])

  const fetchFeaturedItems = async () => {
    try {
      setError('')
      const response = await axios.get('/api/items?limit=6')
      setFeaturedItems(response.data.slice(0, 6))
    } catch (error) {
      console.error('Error fetching featured items:', error)
      setError('Could not load items. Make sure the backend is running on http://localhost:5000')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to ReWear</h1>
            <p className="hero-subtitle">
              Sustainable fashion through community clothing exchange
            </p>
            <p className="hero-description">
              Give your unused clothes a new life while discovering unique pieces from others. 
              Join our community committed to reducing textile waste and promoting sustainable fashion.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Swapping
              </Link>
              <Link to="/items" className="btn btn-secondary btn-lg">
                Browse Items
              </Link>
              <Link to="/add-item" className="btn btn-success btn-lg">
                List an Item
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>How ReWear Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👕</div>
              <h3>List Your Items</h3>
              <p>Upload photos and details of clothes you no longer wear</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Direct Swaps</h3>
              <p>Exchange items directly with other community members</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Points System</h3>
              <p>Earn points by listing items and redeem them for clothes you love</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="featured-items">
        <div className="container">
          <h2>Featured Items</h2>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 12 }}>{error}</div>
          )}
          {loading ? (
            <p>Loading featured items...</p>
          ) : featuredItems.length > 0 ? (
            <div className="items-grid">
              {featuredItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <p>No items available yet. Be the first to list an item!</p>
          )}
          <div className="text-center mt-4">
            <Link to="/items" className="btn btn-primary">
              View All Items
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Sustainable Fashion Journey?</h2>
            <p>Join thousands of users already making a difference</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Join ReWear Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing