import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Settings, LogOut, ShoppingBag, Package } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
    const [currentUser, setCurrentUser] = useState(user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get user from localStorage if not passed as prop
        if (!currentUser) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        }
    }, [currentUser]);

    const handleLogout = async () => {
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            // Clear localStorage regardless of response
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (onLogout) {
                onLogout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear localStorage and logout on error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (onLogout) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-green-600">NTC</h1>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-medium text-gray-900">Dashboard</h2>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {currentUser.firstName}!</span>
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center space-x-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{loading ? 'Logging out...' : 'Logout'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Welcome Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <User className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Welcome back!
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                        {/* Total Orders */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Orders
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">0</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Account Status
                                            </dt>
                                            <dd className="text-lg font-medium text-green-600">
                                                {currentUser.isActive ? 'Active' : 'Inactive'}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Settings className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Member Since
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {new Date(currentUser.createdAt).toLocaleDateString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Information Card */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                User Information
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Personal details and account information.
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        Full name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {currentUser.firstName} {currentUser.lastName}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {currentUser.email}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Phone number
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {currentUser.phone || 'Not provided'}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {currentUser.address ? (
                                            <div>
                                                {currentUser.address.street && <div>{currentUser.address.street}</div>}
                                                {(currentUser.address.city || currentUser.address.state || currentUser.address.zipCode) && (
                                                    <div>
                                                        {currentUser.address.city && `${currentUser.address.city}, `}
                                                        {currentUser.address.state && `${currentUser.address.state} `}
                                                        {currentUser.address.zipCode}
                                                    </div>
                                                )}
                                                {currentUser.address.country && <div>{currentUser.address.country}</div>}
                                            </div>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Account Role
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentUser.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {currentUser.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Browse Products</p>
                                        <p className="text-sm text-gray-500">Explore our catalog</p>
                                    </div>
                                </div>
                            </button>

                            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Package className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Order History</p>
                                        <p className="text-sm text-gray-500">View past orders</p>
                                    </div>
                                </div>
                            </button>

                            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <User className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Edit Profile</p>
                                        <p className="text-sm text-gray-500">Update your info</p>
                                    </div>
                                </div>
                            </button>

                            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Settings className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Settings</p>
                                        <p className="text-sm text-gray-500">Account preferences</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;