import { 
  PlanterProfile, 
  TreeCapture, 
  ImpactToken, 
  Notification,
  DashboardStats,
  CaptureStatus,
  TokenState
} from '@/types';

// Mock User Profile
export const mockPlanterProfile: PlanterProfile = {
  id: 'planter-001',
  username: 'amina.mwangi',
  email: 'amina.mwangi@example.com',
  firstName: 'Amina',
  lastName: 'Mwangi',
  name: 'Amina Mwangi', // Computed field for backward compatibility
  phoneNumber: '+254712345678',
  region: 'Kiambu County, Kenya',
  projectCode: 'KEN-RF-2025',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  fabricEnrolled: true,
  emailVerified: true,
  enabled: true,
  createdAt: new Date('2025-01-15'),
  totalTreesPlanted: 47,
  verifiedTrees: 42,
  totalImpactTokens: 45,
  pendingSubmissions: 3,
  rejectedSubmissions: 2,
};

// Mock Tree Captures
export const mockTreeCaptures: TreeCapture[] = [
  {
    id: 'capture-001',
    planterId: 'planter-001',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    gpsCoordinates: {
      latitude: -1.2921,
      longitude: 36.8219,
      accuracy: 5,
    },
    timestamp: new Date('2025-05-12T10:30:00'),
    species: 'Mango',
    notes: 'Planted near the irrigation trench.',
    status: 'verified',
    verificationDate: new Date('2025-05-15T14:20:00'),
    tokenId: 'token-001',
    isFollowUp: false,
  },
  {
    id: 'capture-002',
    planterId: 'planter-001',
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800',
    gpsCoordinates: {
      latitude: -1.2935,
      longitude: 36.8245,
      accuracy: 8,
    },
    timestamp: new Date('2025-06-03T09:15:00'),
    species: 'Avocado',
    notes: 'Planted in the north field.',
    status: 'verified',
    verificationDate: new Date('2025-06-05T11:30:00'),
    tokenId: 'token-002',
    isFollowUp: false,
  },
  {
    id: 'capture-003',
    planterId: 'planter-001',
    photoUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
    gpsCoordinates: {
      latitude: -1.2948,
      longitude: 36.8198,
      accuracy: 6,
    },
    timestamp: new Date('2025-08-20T14:45:00'),
    species: 'Acacia',
    notes: 'Boundary tree for erosion control.',
    status: 'pending',
    isFollowUp: false,
  },
  {
    id: 'capture-004',
    planterId: 'planter-001',
    photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
    gpsCoordinates: {
      latitude: -1.2910,
      longitude: 36.8230,
      accuracy: 7,
    },
    timestamp: new Date('2025-09-15T08:20:00'),
    species: 'Eucalyptus',
    status: 'pending',
    isFollowUp: false,
  },
  {
    id: 'capture-005',
    planterId: 'planter-001',
    photoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
    gpsCoordinates: {
      latitude: -1.2925,
      longitude: 36.8210,
      accuracy: 4,
    },
    timestamp: new Date('2025-10-01T11:00:00'),
    species: 'Mango',
    notes: 'Follow-up photo for Tree ID 82394',
    status: 'verified',
    verificationDate: new Date('2025-10-03T16:45:00'),
    tokenId: 'token-003',
    isFollowUp: true,
    originalCaptureId: 'capture-001',
  },
];

// Mock Impact Tokens
export const mockImpactTokens: ImpactToken[] = [
  {
    id: 'token-001',
    captureId: 'capture-001',
    planterId: 'planter-001',
    treeSpecies: 'Mango',
    state: 'mature',
    value: 1.5,
    ecologicalValue: {
      carbonOffset: 22.5,
      waterRetention: 150,
      biodiversityScore: 8.5,
    },
    issuedDate: new Date('2025-05-15T14:20:00'),
    maturityDate: new Date('2025-10-03T16:45:00'),
    transactionHistory: [
      {
        id: 'tx-001',
        tokenId: 'token-001',
        type: 'issued',
        toUserId: 'planter-001',
        value: 1.0,
        timestamp: new Date('2025-05-15T14:20:00'),
        blockchainTxId: '0x1a2b3c4d5e6f',
      },
      {
        id: 'tx-002',
        tokenId: 'token-001',
        type: 'issued',
        toUserId: 'planter-001',
        value: 0.5,
        timestamp: new Date('2025-10-03T16:45:00'),
        blockchainTxId: '0x7g8h9i0j1k2l',
      },
    ],
    blockchainTxId: '0x1a2b3c4d5e6f',
  },
  {
    id: 'token-002',
    captureId: 'capture-002',
    planterId: 'planter-001',
    treeSpecies: 'Avocado',
    state: 'basic',
    value: 1.0,
    ecologicalValue: {
      carbonOffset: 18.0,
      waterRetention: 120,
      biodiversityScore: 7.8,
    },
    issuedDate: new Date('2025-06-05T11:30:00'),
    transactionHistory: [
      {
        id: 'tx-003',
        tokenId: 'token-002',
        type: 'issued',
        toUserId: 'planter-001',
        value: 1.0,
        timestamp: new Date('2025-06-05T11:30:00'),
        blockchainTxId: '0x3m4n5o6p7q8r',
      },
    ],
    blockchainTxId: '0x3m4n5o6p7q8r',
  },
  {
    id: 'token-003',
    captureId: 'capture-005',
    planterId: 'planter-001',
    treeSpecies: 'Mango',
    state: 'basic',
    value: 0.5,
    ecologicalValue: {
      carbonOffset: 5.0,
      waterRetention: 30,
      biodiversityScore: 2.0,
    },
    issuedDate: new Date('2025-10-03T16:45:00'),
    transactionHistory: [
      {
        id: 'tx-004',
        tokenId: 'token-003',
        type: 'issued',
        toUserId: 'planter-001',
        value: 0.5,
        timestamp: new Date('2025-10-03T16:45:00'),
        blockchainTxId: '0x9s0t1u2v3w4x',
      },
    ],
    blockchainTxId: '0x9s0t1u2v3w4x',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'planter-001',
    type: 'verification_approved',
    title: 'Tree Verified!',
    message: 'Your tree submission (Mango - Tree ID 82394) has been approved!',
    relatedCaptureId: 'capture-001',
    relatedTokenId: 'token-001',
    isRead: true,
    createdAt: new Date('2025-05-15T14:20:00'),
    actionUrl: '/captures/capture-001',
  },
  {
    id: 'notif-002',
    userId: 'planter-001',
    type: 'token_issued',
    title: 'Impact Token Earned',
    message: 'You earned 1 Impact Token for your verified Mango tree!',
    relatedCaptureId: 'capture-001',
    relatedTokenId: 'token-001',
    isRead: true,
    createdAt: new Date('2025-05-15T14:25:00'),
    actionUrl: '/tokens/token-001',
  },
  {
    id: 'notif-003',
    userId: 'planter-001',
    type: 'survival_check_required',
    title: 'Survival Check Needed',
    message: 'Please upload a new photo of Tree ID 82394 to verify its survival.',
    relatedCaptureId: 'capture-001',
    isRead: false,
    createdAt: new Date('2025-09-28T09:00:00'),
    actionUrl: '/captures/new?followUp=capture-001',
  },
  {
    id: 'notif-004',
    userId: 'planter-001',
    type: 'verification_approved',
    title: 'Follow-up Verified!',
    message: 'Your survival check photo has been approved. Tree is thriving!',
    relatedCaptureId: 'capture-005',
    relatedTokenId: 'token-003',
    isRead: false,
    createdAt: new Date('2025-10-03T16:45:00'),
    actionUrl: '/captures/capture-005',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalTreesPlanted: 47,
  verifiedTrees: 42,
  pendingVerification: 3,
  totalTokens: 45,
  tokenValue: 47.5,
  weeklyProgress: [2, 3, 1, 4, 2, 3, 5],
  monthlyProgress: [8, 12, 15, 10, 14, 18, 20, 16, 22, 19, 25, 28],
  recentCaptures: mockTreeCaptures.slice(0, 5),
  recentTokens: mockImpactTokens.slice(0, 3),
};

// Helper function to get capture by ID
export const getCaptureById = (id: string): TreeCapture | undefined => {
  return mockTreeCaptures.find(capture => capture.id === id);
};

// Helper function to get token by ID
export const getTokenById = (id: string): ImpactToken | undefined => {
  return mockImpactTokens.find(token => token.id === id);
};

// Helper function to get captures by status
export const getCapturesByStatus = (status: CaptureStatus): TreeCapture[] => {
  return mockTreeCaptures.filter(capture => capture.status === status);
};

// Helper function to get tokens by state
export const getTokensByState = (state: TokenState): ImpactToken[] => {
  return mockImpactTokens.filter(token => token.state === state);
};

// Helper function to get unread notifications
export const getUnreadNotifications = (): Notification[] => {
  return mockNotifications.filter(notif => !notif.isRead);
};