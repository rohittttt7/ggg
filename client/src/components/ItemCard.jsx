import React from 'react'
import { Link } from 'react-router-dom'
import './ItemCard.css'

const ItemCard = ({ item }) => {
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return '#28a745'
      case 'like-new': return '#17a2b8'
      case 'good': return '#ffc107'
      case 'fair': return '#fd7e14'
      case 'poor': return '#dc3545'
      default: return '#6c757d'
    }
  }

  return (
    <div className="item-card">
      <div className="item-image">
        <img 
          src={item.images[0] || '/placeholder-image.jpg'} 
          alt={item.title}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg'
          }}
        />
        <div className="item-status">
          {item.isAvailable ? (
            <span className="badge badge-success">Available</span>
          ) : (
            <span className="badge badge-secondary">Swapped</span>
          )}
        </div>
      </div>
      
      <div className="item-content">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-description">
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description
          }
        </p>
        
        <div className="item-details">
          <div className="item-meta">
            <span className="item-category">{item.category}</span>
            <span className="item-size">Size: {item.size}</span>
          </div>
          
          <div 
            className="item-condition"
            style={{ backgroundColor: getConditionColor(item.condition) }}
          >
            {item.condition}
          </div>
        </div>
        
        <div className="item-footer">
          <div className="item-points">
            ⭐ {item.pointValue} points
          </div>
          <div className="item-owner">
            By {item.owner?.firstName} {item.owner?.lastName}
          </div>
        </div>
        
        <Link to={`/item/${item._id}`} className="btn btn-primary btn-block">
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ItemCard