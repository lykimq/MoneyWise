/**
 * CSRF Protection Service
 *
 * Provides CSRF token management and validation for secure API requests.
 * This helps prevent Cross-Site Request Forgery attacks by ensuring
 * that requests originate from the legitimate application.
 */

/**
 * CSRF token storage and management
 */
class CSRFService {
    private token: string | null = null;
    private tokenExpiry: number | null = null;

    /**
     * Checks if the current CSRF token is still valid and has not expired.
     * @returns True if the token is valid and unexpired, false otherwise.
     */
    private isTokenValid(): boolean {
        if (!this.token || !this.tokenExpiry) {
            return false;
        }
        // Check if the token is still valid based on its expiry time
        return Date.now() < this.tokenExpiry;
    }

    /**
     * Refreshes the CSRF token from the server.
     * This method expects a dedicated backend endpoint to provide a secure, server-generated token.
     *
     * IMPORTANT SECURITY NOTE:
     * Client-side generation of CSRF tokens is INSECURE and has been removed.
     * A proper backend endpoint (`/api/csrf-token`) MUST be implemented to provide
     * server-generated, cryptographically secure CSRF tokens.
     * Without a backend-provided token, CSRF protection is NOT effective.
     *
     * TODO: Implement the `/api/csrf-token` backend endpoint to provide server-generated CSRF tokens.
     *
     * @throws Error if the backend CSRF token endpoint fails or returns an invalid token.
     */
    private async refreshToken(): Promise<void> {
        try {
            const response = await fetch('/api/csrf-token', {
                method: 'GET',
                credentials: 'include', // Essential for session-based CSRF tokens via cookies
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.token) {
                throw new Error('CSRF token not found in backend response.');
            }

            this.token = data.token;
            // Default expiry to 1 hour if not provided by backend
            this.tokenExpiry = Date.now() + (data.expiresIn || 3600000);
        } catch (error) {
            console.error('CSRF token refresh failed:', error);
            this.token = null; // Ensure no stale or insecure token is used
            this.tokenExpiry = null;
            throw error; // Re-throw to indicate critical failure
        }
    }

    /**
     * Gets the current CSRF token, refreshing if necessary.
     * If no valid token exists, it attempts to fetch one from the backend.
     * @returns Promise that resolves to the CSRF token.
     * @throws Error if a valid CSRF token cannot be obtained from the backend.
     */
    async getToken(): Promise<string> {
        // Check if we have a valid token that hasn't expired
        if (this.token && this.isTokenValid()) {
            return this.token;
        }

        // Attempt to refresh the token from the backend
        await this.refreshToken();

        // After refreshing, if no token is available, it indicates a critical issue.
        if (!this.token) {
            throw new Error('Failed to obtain a valid CSRF token from the backend. CSRF protection is compromised.');
        }
        return this.token;
    }

    /**
     * Gets headers for CSRF-protected requests
     * @returns Headers object with CSRF token
     */
    async getHeaders(): Promise<Record<string, string>> {
        const token = await this.getToken();
        return {
            'X-CSRF-Token': token,
            'X-Requested-With': 'XMLHttpRequest', // Additional CSRF protection
        };
    }
}

// Export singleton instance
export const csrfService = new CSRFService();
