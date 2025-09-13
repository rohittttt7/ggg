import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ItemCard from '../components/ItemCard'

const Items = () => {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const [filters, setFilters] = useState({
		search: '',
		category: '',
		size: '',
		condition: ''
	})

	useEffect(() => {
		fetchItems()
	}, [])

	const fetchItems = async () => {
		try {
			setLoading(true)
			setError('')

			const params = {}
			if (filters.category) params.category = filters.category
			if (filters.size) params.size = filters.size
			if (filters.condition) params.condition = filters.condition

			const { data } = await axios.get('/api/items', { params })
			setItems(data)
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to load items')
		} finally {
			setLoading(false)
		}
	}

	const handleFilterChange = (e) => {
		const { name, value } = e.target
		setFilters((prev) => ({ ...prev, [name]: value }))
	}

	const handleApply = (e) => {
		e.preventDefault()
		fetchItems()
	}

	const visibleItems = useMemo(() => {
		const query = filters.search.trim().toLowerCase()
		if (!query) return items
		return items.filter((item) => {
			const inTitle = item.title?.toLowerCase().includes(query)
			const inDesc = item.description?.toLowerCase().includes(query)
			const inTags = Array.isArray(item.tags)
				? item.tags.some((t) => t.toLowerCase().includes(query))
				: false
			return inTitle || inDesc || inTags
		})
	}, [items, filters.search])

	return (
		<div className="items-page">
			<div className="container">
				<h1>Browse Items</h1>

				<form className="card" onSubmit={handleApply} style={{ marginBottom: 16 }}>
					<div className="form-row">
						<div className="form-group" style={{ flex: 2 }}>
							<label htmlFor="search">Search</label>
							<input
								id="search"
								name="search"
								value={filters.search}
								onChange={handleFilterChange}
								className="form-control"
								placeholder="Search by title, description, or tags"
							/>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="category">Category</label>
							<select
								id="category"
								name="category"
								value={filters.category}
								onChange={handleFilterChange}
								className="form-control"
							>
								<option value="">All</option>
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
							<select
								id="size"
								name="size"
								value={filters.size}
								onChange={handleFilterChange}
								className="form-control"
							>
								<option value="">All</option>
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
							<select
								id="condition"
								name="condition"
								value={filters.condition}
								onChange={handleFilterChange}
								className="form-control"
							>
								<option value="">All</option>
								<option value="new">New</option>
								<option value="like-new">Like New</option>
								<option value="good">Good</option>
								<option value="fair">Fair</option>
								<option value="poor">Poor</option>
							</select>
						</div>
					</div>

					<div style={{ display: 'flex', gap: 8 }}>
						<button type="submit" className="btn btn-primary">Apply</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => {
								setFilters({ search: '', category: '', size: '', condition: '' })
								fetchItems()
							}}
						>
							Reset
						</button>
					</div>
				</form>

				{error && <div className="alert alert-danger">{error}</div>}
				{loading ? (
					<p>Loading items...</p>
				) : visibleItems.length ? (
					<div className="items-grid">
						{visibleItems.map((item) => (
							<ItemCard key={item._id} item={item} />
						))}
					</div>
				) : (
					<div className="card">
						<p>No items found. Try adjusting your filters.</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Items

