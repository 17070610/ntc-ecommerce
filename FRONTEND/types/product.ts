// /types/product.ts

export interface Product {
    _id: string;            // MongoDB document ID
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: "Office" | "School" | "Electronics";  // Specific allowed values
    image: string;
    rating?: number;
    reviews?: number;
    isNew: boolean;
    tags: string[];
    createdAt: string;
    updatedAt?: string;
}

export interface AdminProduct extends Product {
    // AdminProduct has all Product fields
    // Add admin-specific fields here if needed in the future
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;  // Made optional since it might not exist on error
    message?: string;
}