# CSRF Protection Implementation

## Overview

The MoneyWise application implements comprehensive Cross-Site Request Forgery (CSRF) protection using industry-standard practices. This protection ensures that state-changing requests originate from legitimate user interactions within the application, preventing malicious websites from performing unauthorized actions on behalf of authenticated users.

## Architecture

### Design Principles

1. **Server-Generated Tokens**: All CSRF tokens are generated server-side using cryptographically secure random number generation
2. **Session-Based Storage**: Tokens are stored in server-side sessions, not client-side cookies
3. **Automatic Management**: Frontend automatically handles token refresh and header injection
4. **Configurable Expiry**: Tokens have a configurable lifetime with automatic cleanup
5. **Minimal Overhead**: Only state-changing requests (POST, PUT, DELETE, PATCH) require CSRF protection

### Component Structure

```
Frontend (TypeScript/React)
├── CSRFService (Singleton)
│   ├── Token validation and caching
│   ├── Automatic token refresh
│   └── Header generation
└── HTTPService
    ├── CSRF header injection
    └── Request method detection

Backend (Rust/Axum)
├── CsrfService
│   ├── Secure token generation
│   ├── Session management
│   └── Expiry handling
├── CSRF Routes
│   └── /api/csrf-token endpoint
└── Session Integration
    └── Server-side token storage
```

## Implementation Details

### Frontend Implementation

#### CSRFService Class

The frontend uses a singleton `CSRFService` class that manages the complete token lifecycle:

```typescript
class CSRFService {
  private token: string | null = null;
  private tokenExpiry: number | null = null;
}
```

**Key Methods:**

- `getToken()`: Retrieves a valid token, refreshing if necessary
- `refreshToken()`: Fetches a new token from the backend
- `getHeaders()`: Returns headers for CSRF-protected requests
- `clearToken()`: Clears stored token (useful for logout)

**Security Features:**
- Automatic token validation before use
- Graceful error handling with token cleanup
- Credentials inclusion for session-based tokens
- Additional `X-Requested-With` header for extra protection

#### HTTPService Integration

The `HTTPService` automatically injects CSRF headers for state-changing requests:

```typescript
private async getCSRFHeaders(method: string): Promise<Record<string, string>> {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return await csrfService.getHeaders();
  }
  return {};
}
```

### Backend Implementation

#### CsrfService

The backend `CsrfService` provides secure token generation and session management:

```rust
pub struct CsrfService {
    token_expiry_seconds: u64,
}
```

**Key Methods:**

- `generate_token()`: Creates and stores a new CSRF token
- `generate_secure_token()`: Generates cryptographically secure random tokens

**Security Features:**
- 32-byte (256-bit) random token generation
- Base64 URL-safe encoding for transmission
- Session-based storage with expiry tracking
- Configurable token lifetime (default: 1 hour)

#### API Endpoints

**GET /api/csrf-token**

Retrieves a new CSRF token for the current session.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/csrf-token" \
  -H "Cookie: session=your-session-id"
```

**Response:**
```json
{
  "token": "abc123def456...",
  "expires_in": 3600000
}
```

## Data Models

### Frontend Models

```typescript
interface CSRFHeaders {
  'X-CSRF-Token': string;
  'X-Requested-With': 'XMLHttpRequest';
}
```

### Backend Models

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct CsrfTokenResponse {
    pub token: String,
    pub expires_in: u64, // Expiry time in milliseconds
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CsrfTokenData {
    pub token: String,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
}
```

## Security Features

### Token Generation

1. **Cryptographically Secure**: Uses `rand::thread_rng()` for 256-bit entropy
2. **URL-Safe Encoding**: Base64 encoding without padding for safe transmission
3. **Unpredictable**: Each token is unique and cannot be guessed

### Session Management

1. **Server-Side Storage**: Tokens stored in server sessions, not client cookies
2. **Automatic Expiry**: Configurable token lifetime with automatic cleanup
3. **Session Isolation**: Each user session gets a unique token

### Request Protection

1. **Method Filtering**: Only state-changing requests require CSRF protection
2. **Header Validation**: Server validates `X-CSRF-Token` header
3. **Additional Headers**: `X-Requested-With` header provides extra protection

## Usage Examples

### Frontend Usage

```typescript
import { csrfService } from './services/csrf';

// Automatic usage via HTTPService
const response = await httpService.post('/api/budgets', budgetData);

// Manual token retrieval
const token = await csrfService.getToken();

// Manual header generation
const headers = await csrfService.getHeaders();
```

### Backend Integration

```rust
use crate::csrf::CsrfService;

// Initialize service
let csrf_service = CsrfService::new();

// Generate token in route handler
let response = csrf_service.generate_token(&mut session).await?;
```

## Configuration

### Token Expiry

Default token lifetime is 1 hour (3600 seconds). This can be configured:

```rust
// Custom expiry (2 hours)
let csrf_service = CsrfService::with_expiry(7200);
```

### Session Configuration

The CSRF implementation relies on Axum sessions. Ensure proper session configuration:

```rust
let session_config = SessionConfig::default()
    .with_secure(true)  // HTTPS only in production
    .with_same_site_policy(SameSite::Lax);
```

## Error Handling

### Frontend Errors

- **Token Refresh Failure**: Logs error and clears invalid token
- **Network Errors**: Graceful degradation with user notification
- **Invalid Response**: Validates token presence in backend response

### Backend Errors

- **Session Errors**: Returns 500 status for session storage failures
- **Token Generation**: Logs errors and returns appropriate status codes
- **Validation Errors**: Rejects requests with invalid or missing tokens

## Testing

### Frontend Tests

The CSRF service includes comprehensive tests covering:
- Token validation logic
- Automatic refresh behavior
- Error handling scenarios
- Header generation

### Backend Tests

Backend tests cover:
- Token generation security
- Session storage reliability
- API endpoint functionality
- Error response handling

## Security Considerations

### Attack Prevention

1. **CSRF Attacks**: Prevents unauthorized state-changing requests
2. **Token Theft**: Server-side storage prevents client-side token exposure
3. **Replay Attacks**: Token expiry limits attack window
4. **Session Fixation**: Unique tokens per session prevent session hijacking

### Best Practices

1. **HTTPS Only**: Use secure connections in production
2. **SameSite Cookies**: Configure cookies with appropriate SameSite policy
3. **Regular Rotation**: Tokens automatically refresh to limit exposure
4. **Error Logging**: Monitor CSRF failures for potential attacks

## Troubleshooting

### Common Issues

1. **Token Not Found**: Check session configuration and cookie settings
2. **Expired Tokens**: Verify system clock synchronization
3. **CORS Issues**: Ensure proper CORS configuration for API endpoints
4. **Session Problems**: Verify session middleware configuration

### Debug Information

Enable debug logging to troubleshoot CSRF issues:

```rust
// Backend logging
debug!("Generating new CSRF token for session");
debug!("CSRF token generated successfully");
```

```typescript
// Frontend logging
console.error('CSRF token refresh failed:', error);
```

## Future Enhancements

### Potential Improvements

1. **Token Rotation**: Implement automatic token rotation
2. **Rate Limiting**: Add rate limiting for token generation
3. **Audit Logging**: Enhanced logging for security monitoring
4. **Token Validation**: Server-side token validation middleware

### Monitoring

Consider implementing:
- CSRF failure rate monitoring
- Token generation frequency tracking
- Session health metrics
- Security event alerting
