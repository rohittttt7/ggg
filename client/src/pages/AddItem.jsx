import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AddItem = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    pointValue: '',
    images: '', // comma-separated URLs
    tags: '' // comma-separated
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError('Please login to list an item.')
      return
    }
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        size: form.size,
        condition: form.condition,
        pointValue: Number(form.pointValue),
        images: form.images
          ? form.images.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        tags: form.tags
          ? form.tags.split(',').map((s) => s.trim()).filter(Boolean)
          : []
      }

      await axios.post('/api/items', payload)
      setSuccess('Item listed successfully! Redirecting to your dashboard...')
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list item')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="add-item">
        <div className="container">
          <div className="card">
            <p>Please log in to list an item.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="add-item">
      <div className="container">
        <h1>List New Item</h1>
        <form className="card" onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="title">Title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} className="form-control" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} className="form-control" required>
                <option value="">Select</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="dresses">Dresses</option>
                <option value="outerwear">Outerwear</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="size">Size</label>
              <select id="size" name="size" value={form.size} onChange={handleChange} className="form-control" required>
                <option value="">Select</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XXXL">XXXL</option>
                <option value="One Size">One Size</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select id="condition" name="condition" value={form.condition} onChange={handleChange} className="form-control" required>
                <option value="">Select</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pointValue">Point Value</label>
              <input id="pointValue" name="pointValue" type="number" min="1" value={form.pointValue} onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="images">Image URLs (comma-separated)</label>
              <input id="images" name="images" value={form.images} onChange={handleChange} className="form-control" placeholder="https://..., https://..." />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input id="tags" name="tags" value={form.tags} onChange={handleChange} className="form-control" placeholder="e.g. vintage, denim" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Listing…' : 'List Item'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddItem