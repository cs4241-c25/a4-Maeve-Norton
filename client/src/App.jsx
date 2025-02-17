import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SkiRunForm from './SkiRunForm'
import Login from './login'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ski-run-form" element={<SkiRunForm />} />
        </Routes>
    )
}

export default App

