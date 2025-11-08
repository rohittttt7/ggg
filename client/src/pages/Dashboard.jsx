import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import ItemCard from '../components/ItemCard'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMyItems = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError('')
        const { data } = await axios.get('/api/items/my-items')
        setMyItems(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your items')
      } finally {
        setLoading(false)
      }
    }
    loadMyItems()
  }, [isAuthenticated])

  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome, {user.firstName}!</h1>
        <div className="card">
          <h2>Your Profile</h2>
          <p>Points Balance: {user.points}</p>
          <p>Email: {user.email}</p>
          <p>Member since: {new Date(user.joinedDate).toLocaleDateString()}</p>
        </div>
        
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="grid grid-2">
            <a href="/add-item" className="btn btn-primary">List New Item</a>
            <a href="/items" className="btn btn-secondary">Browse Items</a>
          </div>
        </div>
        
        <div className="card">
          <h2>My Items</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <p>Loading your items...</p>
          ) : myItems?.length ? (
            <div className="items-grid">
              {myItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div>
              <p>You haven't listed any items yet.</p>
              <a href="/add-item" className="btn btn-primary">List your first item</a>
            </div>
          )}
        </div>
        
        <div className="card">
          <h2>My Swaps</h2>
          <p>Coming soon - your swap history and pending requests</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard