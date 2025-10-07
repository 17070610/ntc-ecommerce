// FRONTEND/src/components/AdminLayout.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
    _id: string
    name: string
    email: string
    role: "user" | "admin" | "superadmin"
    permissions: {
        canManageProducts: boolean
        canManageOrders: boolean
        canManageUsers: boolean
        canViewAnalytics: boolean
        canManageCategories: boolean
        canManageAdmins: boolean
    }
}

interface AdminLayoutProps {
    children: React.ReactNode
    requiredRole?: "admin" | "superadmin"
    requiredPermission?: keyof User["permissions"]
}

export default function AdminLayout({
                                        children,
                                        requiredRole = "admin",
                                        requiredPermission
                                    }: AdminLayoutProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                router.push("/login")
                return
            }

            const response = await fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.ok) {
                localStorage.removeItem("token")
                router.push("/login")
                return
            }

            const data = await response.json()

            if (data.success) {
                const userData = data.data
                setUser(userData)

                // Check role authorization
                if (requiredRole === "superadmin" && userData.role !== "superadmin") {
                    setAuthorized(false)
                    return
                }

                if (requiredRole === "admin" && !["admin", "superadmin"].includes(userData.role)) {
                    setAuthorized(false)
                    return
                }

                // Check specific permission if required
                if (requiredPermission && !userData.permissions[requiredPermission]) {
                    setAuthorized(false)
                    return
                }

                setAuthorized(true)
            } else {
                router.push("/login")
            }
        } catch (error) {
            console.error("Auth check error:", error)
            router.push("/login")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                    <div className="text-red-600 text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page.
                        {requiredRole === "superadmin" && " Super admin privileges required."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500">
                                Logged in as: {user?.name}
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {user?.role === "superadmin" ? "Super Admin" : "Admin"}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token")
                                router.push("/login")
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}