import { useState } from "react"

export default function AdminForm() {
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let imageUrl = ""

        if (file) {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            if (data.success) {
                imageUrl = data.url
            }
        }

        // Send product data with uploaded image
        await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Product",
                description: "Uploaded with local image",
                price: 100,
                category: "Office",
                image: imageUrl,
            }),
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button type="submit">Upload Product</button>
        </form>
    )
}
