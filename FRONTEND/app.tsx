import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import AuthContainer from './components/auth/AuthContainer'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

interface DecodedToken {
    id: string
    email: string
    role: string
    exp: number
}

function App() {
    const [user, setUser] = useState<DecodedToken | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token)
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                } else {
                    setUser(decoded)
                }
            } catch {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
        setLoading(false)
    }, [])

    const handleAuthSuccess = (userData: DecodedToken, token: string) => {
        setUser(userData)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    if (loading) return <div>Loading...</div>

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<AuthContainer onAuthSuccess={handleAuthSuccess} />} />

                {/* Protect admin route */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute user={user} requiredRole="admin">
                            <Dashboard user={user} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                {/* Default route */}
                <Route path="/" element={<div>Welcome to NTC Shop</div>} />
            </Routes>
        </Router>
    )
}

export default App
