import {
  PlanterProfile,
  TreeCapture,
  ImpactToken,
  Notification,
  DashboardStats,
  CaptureSubmission,
  ProfileUpdateData,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

import {
  mockPlanterProfile,
  mockTreeCaptures,
  mockImpactTokens,
  mockNotifications,
  mockDashboardStats,
} from './mockData';

// Simulated API delay for mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Base URL (from environment or default)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Get access token from localStorage
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Create fetch wrapper with token management
const apiClient = {
  async get(url: string, options: RequestInit = {}) {
    const token = getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async post(url: string, data?: any, options: RequestInit = {}) {
    const token = getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async put(url: string, data?: any, options: RequestInit = {}) {
    const token = getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async delete(url: string, options: RequestInit = {}) {
    const token = getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },
};

// Authentication interfaces
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  region: string;
  projectCode?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fabricEnrolled: boolean;
  };
}

interface RefreshTokenData {
  refreshToken: string;
}

// Token management utilities
const tokenManager = {
  setTokens(data: { accessToken: string; refreshToken: string }) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  },

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },

  clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};

// API Service with real backend integration
class ApiService {
  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.success && response.data) {
        tokenManager.setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
      }
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ userId: string; username: string; email: string }>> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      if (response.success && response.data) {
        tokenManager.setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
      }
      return response;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      tokenManager.clearTokens();
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      tokenManager.clearTokens();
    }
    return { success: true };
  }

  // Profile Management
  async getProfile(userId: string): Promise<ApiResponse<PlanterProfile>> {
    try {
      const data = await apiClient.get(`/auth/profile`);
      return {
        success: true,
        data: data.user,
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      // Fallback to mock data for development
      await delay(500);
      return {
        success: true,
        data: mockPlanterProfile,
      };
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<ApiResponse<PlanterProfile>> {
    try {
      const data = await apiClient.put(`/auth/profile`, updates);
      return {
        success: true,
        data: data.user,
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      // Fallback to mock data for development
      await delay(500);
      return {
        success: true,
        data: { ...mockPlanterProfile, ...updates },
      };
    }
  }

  // Tree Captures
  async getTreeCaptures(userId: string, page = 1, limit = 10): Promise<PaginatedResponse<TreeCapture>> {
    try {
      // TODO: Implement real API call when tree capture endpoint is ready
      // const data = await apiClient.get(`/captures?page=${page}&limit=${limit}`);
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(500);
      const start = (page - 1) * limit;
      const end = start + limit;
      return {
        data: mockTreeCaptures.slice(start, end),
        total: mockTreeCaptures.length,
        page,
        pageSize: limit,
        hasMore: end < mockTreeCaptures.length,
      };
    }
  }

  async submitTreeCapture(capture: CaptureSubmission): Promise<ApiResponse<TreeCapture>> {
    try {
      // TODO: Implement real API call when tree capture endpoint is ready
      // const data = await apiClient.post('/captures', capture);
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(1000);
      const newCapture: TreeCapture = {
        id: `capture-${Date.now()}`,
        planterId: 'planter-1', // Mock planter ID
        photoUrl: typeof capture.photo === 'string' ? capture.photo : URL.createObjectURL(capture.photo),
        gpsCoordinates: capture.gpsCoordinates,
        timestamp: capture.timestamp,
        species: capture.species,
        notes: capture.notes,
        status: 'pending',
        isFollowUp: capture.isFollowUp,
        originalCaptureId: capture.originalCaptureId,
      };
      return {
        success: true,
        data: newCapture,
      };
    }
  }

  async getTreeCaptureById(captureId: string): Promise<ApiResponse<TreeCapture>> {
    try {
      // TODO: Implement real API call when tree capture endpoint is ready
      // const data = await apiClient.get(`/captures/${captureId}`);
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(500);
      const capture = mockTreeCaptures.find(c => c.id === captureId);
      if (!capture) {
        return {
          success: false,
          error: 'Capture not found',
        };
      }
      return {
        success: true,
        data: capture,
      };
    }
  }

  // Impact Tokens
  async getImpactTokens(userId: string, page = 1, limit = 10): Promise<PaginatedResponse<ImpactToken>> {
    try {
      // TODO: Implement real API call when token endpoint is ready
      // const data = await apiClient.get(`/tokens?page=${page}&limit=${limit}`);
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(500);
      const start = (page - 1) * limit;
      const end = start + limit;
      return {
        data: mockImpactTokens.slice(start, end),
        total: mockImpactTokens.length,
        page,
        pageSize: limit,
        hasMore: end < mockImpactTokens.length,
      };
    }
  }

  async getTokenById(tokenId: string): Promise<ApiResponse<ImpactToken>> {
    try {
      // TODO: Implement real API call when token endpoint is ready
      // const data = await apiClient.get(`/tokens/${tokenId}`);
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(500);
      const token = mockImpactTokens.find(t => t.id === tokenId);
      if (!token) {
        return {
          success: false,
          error: 'Token not found',
        };
      }
      return {
        success: true,
        data: token,
      };
    }
  }

  // Notifications
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      // TODO: Implement real API call when notification endpoint is ready
      // const data = await apiClient.get('/notifications');
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(500);
      return {
        success: true,
        data: mockNotifications,
      };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      // TODO: Implement real API call when notification endpoint is ready
      // await apiClient.put(`/notifications/${notificationId}/read`);
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(300);
      return {
        success: true,
      };
    }
  }

  // Dashboard Stats
  async getDashboardStats(userId: string): Promise<ApiResponse<DashboardStats>> {
    try {
      // TODO: Implement real API call when stats endpoint is ready
      // const data = await apiClient.get('/stats');
      throw new Error('Not implemented yet');
    } catch (error) {
      // Fallback to mock data for development
      await delay(500);
      return {
        success: true,
        data: mockDashboardStats,
      };
    }
  }

  // Fabric Network
  async checkFabricEnrollment(): Promise<ApiResponse<{ enrolled: boolean; identity?: any }>> {
    try {
      const data = await apiClient.get('/auth/fabric/identity');
      return {
        success: true,
        data: {
          enrolled: data.enrolled,
          identity: data.identity,
        },
      };
    } catch (error: any) {
      console.error('Check fabric enrollment error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async enrollInFabric(): Promise<ApiResponse<{ enrolled: boolean; message: string }>> {
    try {
      const data = await apiClient.post('/auth/fabric/enroll');
      return {
        success: true,
        data: {
          enrolled: true,
          message: data.message,
        },
      };
    } catch (error: any) {
      console.error('Fabric enrollment error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const api = new ApiService();