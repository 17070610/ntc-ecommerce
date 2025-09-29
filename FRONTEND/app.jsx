import React, { useState, useEffect } from 'react';
import AuthContainer from './components/auth/AuthContainer';
import Dashboard from './components/Dashboard';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading NTC E-commerce...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <AuthContainer onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    );
}

export default App;