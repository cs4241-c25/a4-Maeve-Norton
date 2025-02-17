import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/auth/check')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    navigate('/ski-run-form')
                }
            })
    }, [navigate])

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card p-4 shadow-sm rounded-4" style={{ border: '2px solid #2A6136', backgroundColor: '#B8DEC8' }}>
                            <div className="card-body p-5">
                                <h1 className="text-center fw-bold My-Color-Theme-1-hex" style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                                    Login
                                </h1>
                                <p className="text-center form-label My-Color-Theme-1-hex" style={{ fontSize: '1.0rem' }}>
                                    To submit a Ski Run, you must first login.
                                </p>

                                <div className="text-center mt-4">
                                    <a href="http://localhost:3000/auth/github" className="btn My-Color-Theme-2-hex text-white w-100" style={{ fontSize: '1.25rem', backgroundColor: '#2A6136' }}>
                                        Login with GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
