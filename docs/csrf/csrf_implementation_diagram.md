# CSRF Implementation Architecture

## Mermaid Diagram

```mermaid
graph TB
    subgraph "Frontend (React/TypeScript)"
        A[User Action] --> B[HTTP Service]
        B --> C{Request Method?}
        C -->|GET/HEAD| D[Send Request]
        C -->|POST/PUT/DELETE/PATCH| E[CSRF Service]
        E --> F{Token Valid?}
        F -->|Yes| G[Use Cached Token]
        F -->|No| H[Fetch New Token]
        H --> I[GET /api/csrf-token]
        I --> J[Store Token + Expiry]
        G --> K[Add X-CSRF-Token Header]
        J --> K
        K --> L[Add X-Requested-With Header]
        L --> D
        D --> M[Send to Backend]
    end

    subgraph "Backend (Rust/Axum)"
        N[Axum Router] --> O[CSRF Routes]
        O --> P[GET /api/csrf-token]
        P --> Q[CSRF Service]
        Q --> R[Generate Secure Token]
        R --> S[Store in Session]
        S --> T[Return Token Response]

        U[API Endpoints] --> V[Session Middleware]
        V --> W[Extract Session]
        W --> X[Validate CSRF Token]
        X --> Y[Process Request]
    end

    subgraph "Session Storage"
        Z[Server-Side Session]
        Z --> AA[CSRF Token Data]
        AA --> BB[Token String]
        AA --> CC[Created At]
        AA --> DD[Expires At]
    end

    subgraph "Security Features"
        EE[Cryptographically Secure Random]
        FF[Base64 URL-Safe Encoding]
        GG[Session-Based Storage]
        HH[Configurable Expiry]
        II[Automatic Cleanup]
    end

    M --> N
    T --> I
    S --> Z
    R --> EE
    R --> FF
    S --> GG
    Q --> HH
    E --> II

    style A fill:#e1f5fe
    style M fill:#e8f5e8
    style N fill:#fff3e0
    style Z fill:#f3e5f5
    style EE fill:#ffebee
```

## Component Relationships

### Frontend Components
- **CSRFService**: Singleton service managing token lifecycle
- **HTTPService**: Integrates CSRF headers for state-changing requests
- **Token Management**: Automatic refresh and validation

### Backend Components
- **CsrfService**: Core token generation and session management
- **CSRF Routes**: API endpoint for token retrieval
- **Session Integration**: Secure server-side token storage

### Security Flow
1. **Token Generation**: Cryptographically secure random token creation
2. **Session Storage**: Server-side storage with expiry management
3. **Header Injection**: Automatic CSRF header addition for protected requests
4. **Validation**: Server-side token verification for state-changing operations
