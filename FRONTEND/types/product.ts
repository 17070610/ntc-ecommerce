// /types/product.ts

export interface Product {
    _id: string;            // MongoDB document ID
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    category: string;
    image?: string;
    rating?: number;
    reviews?: number;
    isNew?: boolean;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
