// Mevcut importlar varsa kalsın
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// --- BU FONKSİYONU EKLE ---
export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=800&q=80"; // Varsayılan placeholder

    // Eğer zaten tam URL ise (https://...) dokunma
    if (path.startsWith("http")) return path;

    // Eğer relative path ise (örn: /images/products/...) başına backend URL'i ekle
    return `http://localhost:8080${path}`;
};