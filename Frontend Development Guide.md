# Frontend Development Guide - Blockchain Authentication Integration

**Document Version**: 1.0  
**Last Updated**: September 10, 2025  
**Target Audience**: Frontend Developers  
**Service Integration**: treetracker-blockchain-auth + Keycloak  

## 🎯 Overview

This guide provides frontend developers with everything needed to integrate with the Complete User Authentication & Blockchain Identity Workflow. It covers the entire flow from user login through Keycloak to blockchain identity management.

## 🏗️ Current Frontend Infrastructure

### Deployed Services
- **Frontend Service**: `frontend` (Production)
- **Test Environment**: `frontend-test`
- **Access URLs**: 
  - Production: http://XXX.XX.XX.XXX:X0XXX
  - Test: http://XXX.XX.XX.XXX:X0XXX
- **Health Status**: ✅ Operational

### Current Configuration (Kubernetes ConfigMap)
```yaml
REACT_APP_ENVIRONMENT: kubernetes
REACT_APP_KEYCLOAK_URL: http://XXX.XX.XX.XXX:X0XXX/keycloak
REACT_APP_KEYCLOAK_REALM: realm-name
REACT_APP_KEYCLOAK_CLIENT_ID: treetracker-blockchain-auth
REACT_APP_BLOCKCHAIN_AUTH_URL: http://XXX.XX.XX.XXX:X0XXX
REACT_APP_API_URL: /api
```

### Nginx Proxy Configuration
```nginx
# API proxy to blockchain auth service
location /api/blockchain/ {
    proxy_pass http://blockchain-auth-service.treetracker-blockchain-auth.svc.cluster.local:XXXX/;
    # ... proxy headers and configuration
}
```

## 🔄 Complete Authentication Flow Implementation

### Phase 1: User Authentication Setup

#### 1.1 Keycloak Configuration
```javascript
// keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: process.env.REACT_APP_KEYCLOAK_URL,
    realm: process.env.REACT_APP_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
});

export default keycloak;
```

#### 1.2 Initialize Keycloak in App
```javascript
// App.js
import { useEffect, useState } from 'react';
import keycloak from './keycloak';

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [keycloakReady, setKeycloakReady] = useState(false);

    useEffect(() => {
        keycloak.init({ 
            onLoad: 'login-required',
            checkLoginIframe: false 
        }).then((authenticated) => {
            setAuthenticated(authenticated);
            setKeycloakReady(true);
            
            if (authenticated) {
                console.log('User authenticated:', keycloak.tokenParsed);
            }
        });
    }, []);

    if (!keycloakReady) {
        return <div>Loading authentication...</div>;
    }

    return (
        <div className="App">
            {authenticated ? <AuthenticatedApp /> : <div>Not authenticated</div>}
        </div>
    );
}
```

### Phase 2: Token Management

#### 2.1 Token Refresh Handler
```javascript
// tokenManager.js
class TokenManager {
    constructor() {
        this.refreshToken = this.refreshToken.bind(this);
        this.setupAutoRefresh();
    }

    setupAutoRefresh() {
        // Refresh token 30 seconds before expiry
        setInterval(() => {
            if (keycloak.token) {
                keycloak.updateToken(30).then((refreshed) => {
                    if (refreshed) {
                        console.log('Token refreshed');
                    }
                }).catch(() => {
                    console.log('Failed to refresh token');
                    keycloak.login();
                });
            }
        }, 60000); // Check every minute
    }

    getAuthHeader() {
        return keycloak.token ? {
            'Authorization': `Bearer ${keycloak.token}`
        } : {};
    }
}

export const tokenManager = new TokenManager();
```

### Phase 3: Blockchain Auth Service Integration

#### 3.1 API Service Class
```javascript
// blockchainAuthService.js
class BlockchainAuthService {
    constructor() {
        this.baseURL = process.env.REACT_APP_BLOCKCHAIN_AUTH_URL;
        // Alternative: use proxy path '/api/blockchain'
        // this.baseURL = '/api/blockchain';
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...tokenManager.getAuthHeader(),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Blockchain Auth API Error:', error);
            throw error;
        }
    }

    // Identity Management Methods
    async checkIdentityExists() {
        return this.makeRequest('/api/identity/exists');
    }

    async getIdentityInfo() {
        return this.makeRequest('/api/identity/me');
    }

    async registerAndEnroll(userData) {
        return this.makeRequest('/api/identity/register-and-enroll', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async validateIdentity() {
        return this.makeRequest('/api/identity/validate');
    }

    async exportIdentity() {
        return this.makeRequest('/api/identity/export');
    }

    // Health and Status
    async getServiceHealth() {
        return this.makeRequest('/health');
    }
}

export const blockchainAuthService = new BlockchainAuthService();
```

### Phase 4: React Components Implementation

#### 4.1 Blockchain Identity Status Component
```javascript
// components/BlockchainIdentityStatus.jsx
import { useState, useEffect } from 'react';
import { blockchainAuthService } from '../services/blockchainAuthService';

const BlockchainIdentityStatus = () => {
    const [identityStatus, setIdentityStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkIdentityStatus();
    }, []);

    const checkIdentityStatus = async () => {
        try {
            setLoading(true);
            const response = await blockchainAuthService.checkIdentityExists();
            setIdentityStatus(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Checking blockchain identity...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="blockchain-identity-status">
            <h3>Blockchain Identity Status</h3>
            {identityStatus?.data?.exists ? (
                <div className="identity-exists">
                    ✅ Blockchain identity exists
                    <p>Username: {identityStatus.data.username}</p>
                </div>
            ) : (
                <div className="identity-missing">
                    ⚠️ No blockchain identity found
                    <button onClick={() => window.location.href = '/blockchain/register'}>
                        Create Blockchain Identity
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlockchainIdentityStatus;
```

#### 4.2 Blockchain Registration Component
```javascript
// components/BlockchainRegistration.jsx
import { useState } from 'react';
import { blockchainAuthService } from '../services/blockchainAuthService';

const BlockchainRegistration = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        role: 'client',
        affiliation: 'treetracker.users',
        attributes: [
            { name: 'department', value: 'planting', ecert: true },
            { name: 'location', value: '', ecert: true }
        ]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await blockchainAuthService.registerAndEnroll(formData);
            setSuccess(true);
            console.log('Registration successful:', response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="registration-success">
                <h3>✅ Blockchain Identity Created Successfully!</h3>
                <p>You can now perform blockchain operations.</p>
                <button onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="blockchain-registration">
            <h3>Create Blockchain Identity</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Role:</label>
                    <select value={formData.role} onChange={(e) => 
                        setFormData({...formData, role: e.target.value})
                    }>
                        <option value="client">Client</option>
                        <option value="peer">Peer</option>
                    </select>
                </div>

                <div>
                    <label>Affiliation:</label>
                    <input 
                        type="text" 
                        value={formData.affiliation}
                        onChange={(e) => 
                            setFormData({...formData, affiliation: e.target.value})
                        }
                    />
                </div>

                <div>
                    <label>Location:</label>
                    <input 
                        type="text" 
                        placeholder="e.g., kenya, ghana, etc."
                        onChange={(e) => {
                            const newAttributes = [...formData.attributes];
                            newAttributes[1].value = e.target.value;
                            setFormData({...formData, attributes: newAttributes});
                        }}
                    />
                </div>

                {error && <div className="error">Error: {error}</div>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Identity...' : 'Create Blockchain Identity'}
                </button>
            </form>
        </div>
    );
};

export default BlockchainRegistration;
```

### Phase 5: Error Handling and UX

#### 5.1 Error Handler Hook
```javascript
// hooks/useErrorHandler.js
import { useState, useCallback } from 'react';
import keycloak from '../keycloak';

export const useErrorHandler = () => {
    const [error, setError] = useState(null);

    const handleError = useCallback((error) => {
        console.error('Application Error:', error);

        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            // Token expired or invalid
            keycloak.login();
            return;
        }

        if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
            setError('You do not have permission to perform this action.');
            return;
        }

        if (error.message?.includes('Network')) {
            setError('Network connection error. Please check your connection and try again.');
            return;
        }

        setError(error.message || 'An unexpected error occurred.');
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { error, handleError, clearError };
};
```

#### 5.2 Loading States Component
```javascript
// components/LoadingStates.jsx
export const LoadingSpinner = () => (
    <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
    </div>
);

export const BlockchainOperationLoader = ({ operation }) => (
    <div className="blockchain-loader">
        <div className="progress-indicator">
            <div className="step active">🔐 Authenticating</div>
            <div className="step active">📝 Registering with Fabric CA</div>
            <div className="step active">📜 Enrolling for Certificate</div>
            <div className="step">💾 Storing Identity</div>
        </div>
        <p>{operation || 'Processing blockchain operation...'}</p>
    </div>
);
```

## 🧪 Testing Your Integration

### Development Testing Checklist

#### 1. Authentication Flow
```bash
# Check if frontend can access Keycloak
curl -I http://XXX.XX.XX.XXX:X0XXX/keycloak/realms/treetracker

# Verify frontend health
curl http://XXX.XX.XX.XXX:X0XXX/health

# Test blockchain auth service from frontend proxy
curl http://XXX.XX.XX.XXX:X0XXX/api/blockchain/health
```

#### 2. Token Validation Test
```javascript
// In browser console after login
console.log('Keycloak Token:', keycloak.token);
console.log('User Info:', keycloak.tokenParsed);
console.log('Token Valid:', keycloak.authenticated);

// Test API call
fetch('/api/blockchain/api/identity/exists', {
    headers: {
        'Authorization': `Bearer ${keycloak.token}`
    }
}).then(r => r.json()).then(console.log);
```

#### 3. Complete Workflow Test
1. **Login**: User authenticates via Keycloak
2. **Check Identity**: Call `/api/identity/exists`
3. **Register** (if needed): Call `/api/identity/register-and-enroll`
4. **Validate**: Call `/api/identity/validate`
5. **Use Identity**: Ready for blockchain operations

### Example Test Scenarios

#### Test 1: New User Registration
```javascript
const testNewUserFlow = async () => {
    console.log('Testing new user blockchain identity creation...');
    
    // Step 1: Check if identity exists
    const identityCheck = await blockchainAuthService.checkIdentityExists();
    console.log('Identity exists:', identityCheck);
    
    if (!identityCheck.data.exists) {
        // Step 2: Register and enroll
        const registrationData = {
            role: 'client',
            affiliation: 'treetracker.users',
            attributes: [
                { name: 'department', value: 'testing', ecert: true }
            ]
        };
        
        const registration = await blockchainAuthService.registerAndEnroll(registrationData);
        console.log('Registration result:', registration);
    }
    
    // Step 3: Validate identity
    const validation = await blockchainAuthService.validateIdentity();
    console.log('Identity validation:', validation);
};
```

## 🚀 Deployment Configuration

### Environment Variables
```bash
# Production
REACT_APP_KEYCLOAK_URL=http://XXX.XX.XX.XXX:X0XXX/keycloak
REACT_APP_BLOCKCHAIN_AUTH_URL=http://XXX.XX.XX.XXX:X0XXX

# Development (local)
REACT_APP_KEYCLOAK_URL=http://localhost:8080/keycloak
REACT_APP_BLOCKCHAIN_AUTH_URL=http://localhost:3001
```

### Kubernetes Configuration Update
```yaml
# Update frontend configmap if needed
kubectl patch configmap frontend-config -n namespace --patch='
data:
  REACT_APP_BLOCKCHAIN_AUTH_URL: "http://XXX.XX.XX.XXX:X0XXX"
  REACT_APP_KEYCLOAK_URL: "http://XXX.XX.XX.XXX:X0XXX/keycloak"
'
```

## 🔧 Troubleshooting Common Issues

### Issue 1: CORS Errors
```javascript
// Solution: Use proxy configuration in nginx or package.json
// nginx.conf already includes proper CORS headers
```

### Issue 2: Token Expiration
```javascript
// Solution: Implement auto-refresh
keycloak.updateToken(30).then((refreshed) => {
    if (refreshed) {
        console.log('Token refreshed');
        // Retry failed request
    }
});
```

### Issue 3: Network Connectivity
```bash
# Test connectivity from frontend pod
kubectl exec -n namespace deployment/frontend -- curl -I http://blockchain-auth-service.treetracker-blockchain-auth.svc.cluster.local:XXXX/health
```

## 📊 Current Status Summary

| Component | Status | URL | Notes |
|-----------|---------|-----|--------|
| Frontend (Prod) | ✅ Online | http://XXX.XX.XX.XXX:X0XXX | Ready for integration |
| Frontend (Test) | ✅ Online | http://XXX.XX.XX.XXX:X0XXX | Testing environment |
| Keycloak | ✅ Online | http://XXX.XX.XX.XXX:X0XXX/keycloak | Authentication ready |
| Blockchain Auth | ✅ Online | http://XXX.XX.XX.XXX:X0XXX | Service operational |
| Integration Status | ✅ Ready | - | All components validated |

## 🔗 Additional Resources

- [Complete Auth & Blockchain Workflow](./complete-auth-blockchain-workflow.md)
- [API Test Guide](./API_TEST_GUIDE.md)
- [Keycloak JavaScript Adapter Documentation](https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter)

---

**Next Steps**: 
1. Implement the authentication flow in your React components
2. Test the complete user journey from login to blockchain identity creation
3. Add error handling and loading states for better UX
4. Deploy and test in your environment
