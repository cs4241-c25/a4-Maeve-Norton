import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const SkiRunForm = () => {
    const [formData, setFormData] = useState({
        trailName: '',
        difficulty: '',
        location: '',
        dateOfRun: '',
        rating: '',
        numberOfRuns: ''
    })

    const [skiRuns, setSkiRuns] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        checkAuthentication()
        fetchSkiRuns()
    }, [])

    const checkAuthentication = async () => {
        const response = await fetch('http://localhost:3000/auth/check', { credentials: 'include' })
        const data = await response.json()
        if (data.status !== 'ok') {
            setIsAuthenticated(false)
            navigate('/')
        }
    }

    const fetchSkiRuns = async () => {
        const response = await fetch('http://localhost:3000/skiRuns', { credentials: 'include' })
        const data = await response.json()
        setSkiRuns(data)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const method = formData._id ? 'PUT' : 'POST'
        const url = formData._id ? `/update/${formData._id}` : '/add'

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (response.status === 200) {
            fetchSkiRuns()
            setFormData({
                trailName: '',
                difficulty: '',
                location: '',
                dateOfRun: '',
                rating: '',
                numberOfRuns: '',
            })
        }
    }

    const handleDelete = async (id) => {
        await fetch(`/delete/${id}`, { method: 'DELETE' })
        fetchSkiRuns()
    }

    const handleEdit = (skiRun) => {
        setFormData({ ...skiRun })
    }

    const handleLogout = async () => {
        await fetch('http://localhost:3000/logout', { credentials: 'include' })
        setIsAuthenticated(false)
        navigate('/')
    }

    return (
        <div className="container mt-5">

            <div className="text-center mb-4">
                <h1 className="fw-bold My-Color-Theme-1-hex" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Submit Your Ski Run!</h1>
                <p className="My-Color-Theme-1-hex" style={{ fontSize: '1.5rem' }}>You are currently logged in.</p>
                <button className="btn My-Color-Theme-2-hex text-white" style={{ fontSize: '1.25rem', backgroundColor: '#2A6136', border: 'none', padding: '10px 20px' }} onClick={handleLogout}>Logout</button>
            </div>


            <section className="card p-4 shadow-sm rounded-4" style={{ border: '2px solid #2A6136', backgroundColor: '#B8DEC8' }}>
                <h2 className="text-center fw-semibold My-Color-Theme-1-hex" style={{ fontSize: '2rem' }}>Ski Run Form</h2>

                <form className="mt-3" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="trailName" className="form-label My-Color-Theme-1-hex" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Trail Name</label>
                        <input type="text" id="trailName" name="trailName" className="form-control My-Color-Theme-4-hex text-dark" value={formData.trailName} onChange={handleInputChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="difficulty" className="form-label My-Color-Theme-1-hex" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Difficulty</label>
                        <select id="difficulty" name="difficulty" className="form-select My-Color-Theme-4-hex text-dark" value={formData.difficulty} onChange={handleInputChange} required>
                            <option value="Choose One">Choose One</option>
                            <option value="Green Circle">Green Circle</option>
                            <option value="Blue Square">Blue Square</option>
                            <option value="Black Diamond">Black Diamond</option>
                            <option value="Double Black Diamond">Double Black Diamond</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="location" className="form-label My-Color-Theme-1-hex" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Location</label>
                        <input type="text" id="location" name="location" className="form-control My-Color-Theme-4-hex text-dark" value={formData.location} onChange={handleInputChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="dateOfRun" className="form-label My-Color-Theme-1-hex" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Date of Run</label>
                        <input type="date" id="dateOfRun" name="dateOfRun" className="form-control My-Color-Theme-4-hex text-dark" value={formData.dateOfRun} onChange={handleInputChange} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="rating" className="form-label My-Color-Theme-1-hex" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Rating</label>
                        <input type="number" id="rating" name="rating" className="form-control My-Color-Theme-4-hex text-dark" value={formData.rating} onChange={handleInputChange} min="1" max="10" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="numberOfRuns" className="form-label My-Color-Theme-1-hex" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Number of Runs</label>
                        <input type="number" id="numberOfRuns" name="numberOfRuns" className="form-control My-Color-Theme-4-hex text-dark" value={formData.numberOfRuns} onChange={handleInputChange} required />
                    </div>

                    <button type="submit" className="btn My-Color-Theme-2-hex text-white w-100" style={{ fontSize: '1.25rem', backgroundColor: '#2A6136', border: 'none' }}>Submit</button>
                </form>
            </section>


            <section className="mt-5">
                <h2 className="text-center fw-semibold My-Color-Theme-1-hex" style={{ fontSize: '2rem' }}>Results</h2>

                <div className="table-responsive">
                    <table className="table mt-3" style={{ fontSize: '1.1rem' }}>
                        <thead className="My-Color-Theme-1-hex text-white">
                        <tr>
                            <th>Trail Name</th>
                            <th>Difficulty</th>
                            <th>Location</th>
                            <th>Date of Run</th>
                            <th>Rating</th>
                            <th>Number of Runs</th>
                        </tr>
                        </thead>
                        <tbody>
                        {skiRuns.map((skiRun) => (
                            <tr key={skiRun._id}>
                                <td>{skiRun.trailName}</td>
                                <td>{skiRun.difficulty}</td>
                                <td>{skiRun.location}</td>
                                <td>{skiRun.dateOfRun}</td>
                                <td>{skiRun.rating}</td>
                                <td>{skiRun.numberOfRuns}</td>
                                <td>
                                    <button onClick={() => handleEdit(skiRun)}>Modify</button>
                                    <button onClick={() => handleDelete(skiRun._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
export default SkiRunForm
