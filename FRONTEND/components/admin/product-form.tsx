"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { AdminProduct } from "@/types/product";

interface Props {
    product?: AdminProduct;
    onSubmit: (product: AdminProduct) => void;
    onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: Props) {
    const [formData, setFormData] = useState<AdminProduct>(
        (product as AdminProduct) || {
            name: "",
            description: "",
            price: 0,
            originalPrice: undefined,
            category: "Office",
            image: "",
            isNew: false,
            tags: [],
            createdAt: new Date().toISOString(),
        }
    );

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(formData.image || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!file) {
            setPreview(formData.image || null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file, formData.image]);

    const handleInputChange = (field: keyof AdminProduct, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!formData.name || !formData.description || formData.price <= 0) {
                throw new Error("Please fill required fields and set price > 0");
            }

            // If a file was selected, upload it first
            let imageUrl = formData.image || "";
            if (file) {
                const fd = new FormData();
                fd.append("file", file);

                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const uploadData = await res.json();
                if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");
                imageUrl = uploadData.url;
            }

            const payload: any = { ...formData, image: imageUrl };

            // If editing: call PUT to /api/products/<[id]>, else POST
            if (product?._id) {
                const res = await fetch(`/api/products/${product._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error || "Update failed");
                setSuccess("Product updated");
                onSubmit(data.data);
            } else {
                const res = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error || "Create failed");
                setSuccess("Product created");
                onSubmit(data.data);
                // clear form
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    originalPrice: undefined,
                    category: "Office",
                    image: "",
                    isNew: false,
                    tags: [],
                    createdAt: new Date().toISOString(),
                });
                setFile(null);
            }
        } catch (err: any) {
            setError(err?.message || "Failed");
            console.error("ProductForm error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const addTag = (tag: string) => {
        const t = tag.trim();
        if (!t) return;
        if (!formData.tags.includes(t)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, t] }));
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
                <CardDescription>{product ? "Update product" : "Create a new product"}</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                    {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}

                    <div>
                        <Label>Product Name *</Label>
                        <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                    </div>

                    <div>
                        <Label>Category *</Label>
                        <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Office">Office</SelectItem>
                                <SelectItem value="School">School</SelectItem>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Description *</Label>
                        <Textarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={4} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Price (RWF) *</Label>
                            <Input type="number" value={formData.price} onChange={(e) => handleInputChange("price", Number(e.target.value) || 0)} />
                        </div>
                        <div>
                            <Label>Original Price</Label>
                            <Input type="number" value={formData.originalPrice || ""} onChange={(e) => handleInputChange("originalPrice", e.target.value ? Number(e.target.value) : undefined)} />
                        </div>
                    </div>

                    <div>
                        <Label>Upload Image (local)</Label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <div className="mt-2">
                            {preview ? (
                                <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded-md border" />
                            ) : (
                                <div className="text-sm text-muted-foreground">No image selected</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label>Tags</Label>
                        <div className="flex gap-2 items-center">
                            <Input placeholder="press Enter or Add" onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); addTag((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }
                            }} />
                            <Button type="button" onClick={() => {
                                const input = document.querySelector<HTMLInputElement>(".tags-input");
                                if (input) { addTag(input.value); input.value = ""; }
                            }}>Add</Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {formData.tags.map(tag => (
                                <Badge key={tag} className="flex items-center gap-2">
                                    {tag}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : product ? "Update" : "Add Product"}</Button>
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
