import React from 'react'
import { useParams } from 'react-router-dom'

const ItemDetail = () => {
  const { id } = useParams()

  return (
    <div className="item-detail">
      <div className="container">
        <h1>Item Detail Page</h1>
        <p>Item ID: {id}</p>
        <div className="card">
          <p>Coming soon - detailed item view with gallery, swap options, and owner information</p>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail