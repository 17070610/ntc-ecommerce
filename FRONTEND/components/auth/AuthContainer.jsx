import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    const handleAuthSuccess = (user) => {
        if (onAuthSuccess) {
            onAuthSuccess(user);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {isLogin ? (
                    <Login
                        onToggleRegister={toggleAuthMode}
                        onLoginSuccess={handleAuthSuccess}
                    />
                ) : (
                    <Register
                        onToggleLogin={toggleAuthMode}
                        onRegisterSuccess={handleAuthSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthContainer;