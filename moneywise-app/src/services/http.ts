/**
 * Base URL for all API calls from the frontend.
 * In development this points to the local backend exposed under `/api`.
 * The backend HTTP server and route mounting live in the Rust project
 * (see `moneywise-backend/src/api/mod.rs` for route wiring and handlers).
 *
 * Production-ready configuration:
 *   Use the Expo-supported public env var `EXPO_PUBLIC_API_BASE_URL` to set
 *   this value per environment (dev/staging/prod). Falls back to localhost
 *   if not provided.
 */
const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';

export class HttpClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Perform a JSON HTTP request against the backend API.
     *
     * - endpoint: path under `/api` (e.g., `/budgets`, `/budgets/overview`).
     * - options: fetch options; `Content-Type: application/json` is added by default.
     * - returns: parsed JSON typed as T.
     * - throws: Error if `response.ok` is false (non-2xx status).
     *
     * Backend note:
     *   Handlers in `moneywise-backend` return JSON responses. Ensure payloads
     *   and status codes match what callers expect here (e.g., 201 on create).
     */
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
            ...options,
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
}

export const httpClient = new HttpClient();


