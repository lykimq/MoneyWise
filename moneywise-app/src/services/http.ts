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
import { Platform } from 'react-native';

// Default base URL with platform-aware fallback for Android emulator.
// - Prefer EXPO_PUBLIC_API_BASE_URL when provided (use this for physical devices: http://<LAN-IP>:3000/api)
// - On Android emulator, 'localhost' points to the emulator itself. Use 10.0.2.2 to reach the host machine.
// - On iOS simulator and web, 'http://localhost:3000/api' works.
const API_BASE_URL = (() => {
    const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
    if (fromEnv && fromEnv.length > 0) return fromEnv;
    if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
    return 'http://localhost:3000/api';
})();

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


