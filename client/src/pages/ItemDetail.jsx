import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ItemDetail = () => {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`/api/items/${id}`)
        setItem(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load item')
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  return (
    <div className="item-detail">
      <div className="container">
        {loading ? (
          <p>Loading item...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : item ? (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <img
                  src={item.images?.[0] || '/placeholder-image.jpg'}
                  alt={item.title}
                  style={{ width: '100%', borderRadius: 8 }}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'
                  }}
                />
              </div>
              <div>
                <h1 style={{ marginTop: 0 }}>{item.title}</h1>
                <p>{item.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                  <span className="badge">Category: {item.category}</span>
                  <span className="badge">Size: {item.size}</span>
                  <span className="badge">Condition: {item.condition}</span>
                  <span className="badge">Points: {item.pointValue}</span>
                </div>
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <p>
                    <strong>Tags:</strong> {item.tags.join(', ')}
                  </p>
                )}
                <p>
                  <strong>Owner:</strong> {item.owner?.firstName} {item.owner?.lastName}
                </p>
                <p>
                  Status: {item.isAvailable ? 'Available' : 'Not available'}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" disabled>
                    Request Swap (Coming soon)
                  </button>
                  <button className="btn btn-secondary" onClick={() => window.history.back()}>
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ItemDetail