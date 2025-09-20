export interface AuthResponse {
    success: boolean;
    message: string;
}

const BASE_URL = "http://localhost:5000/api"; // Flask backend

export async function signup(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}
