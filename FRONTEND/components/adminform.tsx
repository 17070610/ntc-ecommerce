import { useState, useEffect } from "react"
import jwtDecode from "jwt-decode"

interface DecodedToken {
    id: string
    role: string
    exp: number
}

export default function AdminForm() {
    const [file, setFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [role, setRole] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        category: "Office",
    })

    // Check token + role when component mounts
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("You must be logged in.")
            window.location.href = "/login"
            return
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token)

            // Check expiration
            if (decoded.exp * 1000 < Date.now()) {
                alert("Session expired. Please login again.")
                localStorage.removeItem("token")
                window.location.href = "/login"
                return
            }

            // Save role in state
            setRole(decoded.role)

            // Restrict non-admins
            if (decoded.role !== "admin" && decoded.role !== "superadmin") {
                alert("You don’t have permission to access this page.")
                window.location.href = "/"
            }
        } catch (err) {
            console.error("Invalid token", err)
            localStorage.removeItem("token")
            window.location.href = "/login"
        }
    }, [])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "originalPrice" ? parseFloat(value) || 0 : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        if (!formData.name || !formData.description || formData.price <= 0) {
            alert("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("token")
            if (!token) {
                alert("You must be logged in to create products")
                window.location.href = "/login"
                return
            }

            let imageUrl = ""

            if (file) {
                const uploadFormData = new FormData()
                uploadFormData.append("file", file)

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: uploadFormData,
                })

                const uploadData = await uploadRes.json()
                if (uploadData.success) {
                    imageUrl = uploadData.url
                } else {
                    alert("Image upload failed: " + uploadData.error)
                    return
                }
            }

            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    image: imageUrl,
                }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                alert("Product created successfully!")
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    originalPrice: 0,
                    category: "Office",
                })
                setFile(null)
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                if (fileInput) fileInput.value = ""
            } else {
                if (response.status === 403) {
                    alert("Access denied. You don't have permission to create products.")
                } else if (response.status === 401) {
                    alert("Session expired. Please login again.")
                    window.location.href = "/login"
                } else {
                    alert("Failed to create product: " + (result.message || result.error || "Unknown error"))
                }
            }
        } catch (error) {
            console.error("Error creating product:", error)
            alert("An error occurred while creating the product")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (role !== "admin" && role !== "superadmin") {
        return <p className="text-center text-red-600">Checking permissions...</p>
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-6 space-y-4 bg-white rounded-lg shadow"
        >
            <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
            {/* form fields stay the same */}
        </form>
    )
}
