/**
 * CSRF Protection Service
 *
 * Provides CSRF token management and validation for secure API requests.
 * This helps prevent Cross-Site Request Forgery attacks by ensuring that
 * requests originate from the legitimate application.
 */

/**
 * Manages CSRF token storage and lifecycle.
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
    // Verifies the token's validity based on its expiry timestamp.
    return Date.now() < this.tokenExpiry;
  }

  /**
   * Refreshes the CSRF token from the server.
   * This method fetches a secure, server-generated token from the backend.
   *
   * Security Features:
   * - Server-generated cryptographically secure tokens
   * - Session-based token storage
   * - Automatic token expiry management
   * - Proper error handling and cleanup
   *
   * @throws Error if the backend CSRF token endpoint fails or returns an
   * invalid token.
   */
  private async refreshToken(): Promise<void> {
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include', // Essential for session-based CSRF tokens.
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch CSRF token: ${response.status} ` +
          `${response.statusText}`
        );
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('CSRF token not found in backend response.');
      }

      this.token = data.token;
      // Default expiry to 1 hour if not provided by backend.
      this.tokenExpiry = Date.now() + (data.expiresIn || 3600000);
    } catch (error) {
      console.error('CSRF token refresh failed:', error);
      this.token = null; // Ensures no stale or insecure token is used.
      this.tokenExpiry = null;
      throw error; // Re-throw to indicate critical failure.
    }
  }

  /**
   * Gets the current CSRF token, refreshing if necessary. If no valid token
   * exists, it attempts to fetch one from the backend.
   * @returns Promise that resolves to the CSRF token.
   * @throws Error if a valid CSRF token cannot be obtained from the backend.
   */
  async getToken(): Promise<string> {
    // Checks if a valid, unexpired token is already available.
    if (this.token && this.isTokenValid()) {
      return this.token;
    }

    // Attempts to refresh the token from the backend.
    await this.refreshToken();

    // If no token is available after refreshing, it indicates a critical issue.
    if (!this.token) {
      throw new Error(
        'Failed to obtain a valid CSRF token from the backend. ' +
        'CSRF protection is compromised.'
      );
    }
    return this.token;
  }

  /**
   * Retrieves headers for CSRF-protected requests.
   * @returns Headers object containing the CSRF token.
   */
  async getHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    return {
      'X-CSRF-Token': token,
      'X-Requested-With': 'XMLHttpRequest', // Additional CSRF protection.
    };
  }

  /**
   * Clears the current CSRF token from memory.
   * Useful for logout scenarios or when switching users.
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
  }
}

// Exports a singleton instance of the CSRFService.
export const csrfService = new CSRFService();
