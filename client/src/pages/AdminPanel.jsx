import React from 'react'
import { useAuth } from '../context/AuthContext'

const AdminPanel = () => {
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="card">
            <h1>Access Denied</h1>
            <p>You do not have permission to access the admin panel.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Admin Panel</h1>
        <div className="card">
          <h2>Pending Items</h2>
          <p>Coming soon - list of items waiting for approval/rejection</p>
        </div>
        
        <div className="card">
          <h2>User Management</h2>
          <p>Coming soon - user administration features</p>
        </div>
        
        <div className="card">
          <h2>System Statistics</h2>
          <p>Coming soon - platform analytics and statistics</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel