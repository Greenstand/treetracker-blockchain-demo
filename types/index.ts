// User and Planter Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  region?: string;
  projectCode?: string;
  avatar?: string;
  fabricEnrolled?: boolean;
  emailVerified?: boolean;
  enabled?: boolean;
  createdAt?: Date;
}

export interface PlanterProfile extends User {
  // Profile fields that map to User
  name: string; // Computed from firstName + lastName for backward compatibility
  totalTreesPlanted: number;
  verifiedTrees: number;
  totalImpactTokens: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
}

// Auth-specific types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  region: string;
  projectCode?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

// Tree Capture Types
export interface TreeCapture {
  id: string;
  planterId: string;
  photoUrl: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: Date;
  species?: string;
  notes?: string;
  status: CaptureStatus;
  verificationDate?: Date;
  rejectionReason?: string;
  tokenId?: string;
  followUpCaptureId?: string;
  isFollowUp: boolean;
  originalCaptureId?: string;
}

export type CaptureStatus = 
  | 'queued'      // Offline, not yet uploaded
  | 'pending'     // Uploaded, awaiting verification
  | 'verified'    // Approved by verification system
  | 'rejected'    // Failed verification
  | 'flagged';    // Needs attention/correction

// Impact Token Types
export interface ImpactToken {
  id: string;
  captureId: string;
  planterId: string;
  treeSpecies?: string;
  state: TokenState;
  value: number;
  ecologicalValue: {
    carbonOffset?: number;
    waterRetention?: number;
    biodiversityScore?: number;
  };
  issuedDate: Date;
  maturityDate?: Date;
  transactionHistory: TokenTransaction[];
  blockchainTxId?: string;
}

export type TokenState = 
  | 'basic'       // Initial token state
  | 'mature'      // After survival verification
  | 'traded'      // Token has been traded
  | 'redeemed';   // Token has been redeemed

export interface TokenTransaction {
  id: string;
  tokenId: string;
  type: 'issued' | 'traded' | 'redeemed' | 'transferred';
  fromUserId?: string;
  toUserId?: string;
  value: number;
  timestamp: Date;
  blockchainTxId?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedCaptureId?: string;
  relatedTokenId?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export type NotificationType = 
  | 'verification_approved'
  | 'verification_rejected'
  | 'token_issued'
  | 'survival_check_required'
  | 'token_traded'
  | 'system_alert';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form Types
export interface CaptureSubmission {
  photo: File | string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: Date;
  species?: string;
  notes?: string;
  isFollowUp: boolean;
  originalCaptureId?: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  region?: string;
  projectCode?: string;
}

// Statistics Types
export interface DashboardStats {
  totalTreesPlanted: number;
  verifiedTrees: number;
  pendingVerification: number;
  totalTokens: number;
  tokenValue: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
  recentCaptures: TreeCapture[];
  recentTokens: ImpactToken[];
}

// Map Types
export interface MapMarker {
  id: string;
  position: [number, number];
  captureId: string;
  status: CaptureStatus;
  species?: string;
  timestamp: Date;
}

// Offline Queue Types
export interface OfflineQueueItem {
  id: string;
  type: 'capture' | 'profile_update' | 'follow_up';
  data: any;
  timestamp: Date;
  retryCount: number;
  lastAttempt?: Date;
}