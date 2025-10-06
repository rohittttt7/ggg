import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h2>ReWear</h2>
        </Link>
        
        <ul className="navbar-nav">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/items">Browse Items</Link></li>
          
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/add-item">List Item</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin">Admin</Link></li>
              )}
              <li className="user-info">
                <span>👤 {user?.firstName} ({user?.points} pts)</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-primary">Login</Link></li>
              <li><Link to="/register" className="btn btn-secondary">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar