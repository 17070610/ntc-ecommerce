import React from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    user: any
    requiredRole?: string
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, requiredRole, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
