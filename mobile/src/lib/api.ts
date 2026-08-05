import { getToken } from "./auth";

const BASE_URL = 'http://10.0.2.2:3000/api';

export class ApiError extends Error {
    status: number;
    body: any;

    constructor(status: number, body: any) {
        super(body?.message ?? `Request failed: ${status}`);
        this.status = status;
        this.body = body;
    }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await getToken()

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}`} : {}),
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers
    })

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new ApiError(response.status, errorBody)
    }

    return response.json();
    
}