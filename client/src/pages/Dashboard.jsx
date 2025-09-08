import React from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

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
          <p>Coming soon - list of your uploaded items</p>
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