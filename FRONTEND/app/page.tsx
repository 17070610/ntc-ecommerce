import ClientHomePage from "@/components/ClientHomePage";
import { Product, ApiResponse } from "@/types/product";

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getProducts(): Promise<Product[]> {
    try {
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.NEXTAUTH_URL || "https://your-domain.com"
                : "http://localhost:3000";

        const res = await fetch(`${baseUrl}/api/products`, {
            cache: "no-store",
            next: { revalidate: 0 },
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            console.error("Failed to fetch products:", res.status, res.statusText);
            return [];
        }

        const data: ApiResponse<Product[]> = await res.json();
        return data.success ? data.data || [] : [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function HomePage() {
    const products = await getProducts();

    return <ClientHomePage initialProducts={products} />;
}