# TreeTracker Web Application

A comprehensive web application for documenting and tracking reforestation efforts, built with Next.js 14, React 18, and TypeScript.

## 🌳 Overview

TreeTracker empowers tree growers to document and share their reforestation efforts by capturing geotagged, time-stamped photos of the trees they plant and care for. These photos (Captures) are uploaded to the cloud, where Greenstand's verification system checks key attributes such as location, species, and authenticity.

Once verified, each Capture is assigned an Impact Token—a digital asset that quantifies the tree's ecological and social value. These tokens can be traded or used to reward contributors, creating a transparent, incentive-driven system that supports sustainable reforestation.

## ✨ Features

### 📸 Tree Capture Management
- **Geotagged Photo Capture**: Automatically capture GPS coordinates and timestamps with each tree photo
- **Offline Functionality**: Queue captures when offline and auto-sync when connection is restored
- **Species Tracking**: Document tree species and add custom notes
- **Follow-up Captures**: Track tree survival with follow-up photos

### 🪙 Impact Token System
- **Token Tracking**: View and manage earned Impact Tokens
- **Ecological Value**: Track carbon offset, water retention, and biodiversity scores
- **Token States**: Monitor token lifecycle (Basic → Mature → Traded → Redeemed)
- **Blockchain Integration**: Ready for Hyperledger Fabric integration

### 🗺️ Interactive Map
- **Geolocation Visualization**: View all planted trees on an interactive map
- **Status Filtering**: Filter trees by verification status
- **Detailed Markers**: Click markers to view capture details
- **Location Validation**: Verify planting locations

### 📊 Dashboard & Analytics
- **Progress Tracking**: Monitor monthly and weekly planting progress
- **Statistics Overview**: View total trees, verified captures, and pending submissions
- **Recent Activity**: Quick access to recent captures and tokens
- **Impact Summary**: Track total environmental impact

### 🔔 Notifications
- **Real-time Updates**: Get notified about verification status changes
- **Token Alerts**: Receive notifications when tokens are issued
- **Survival Checks**: Reminders for follow-up captures
- **Action Items**: Quick links to required actions

### 👤 Profile Management
- **User Profile**: Manage personal information and account details
- **Activity Statistics**: View comprehensive planting statistics
- **Project Tracking**: Monitor project code and membership details

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd treetracker-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_HYPERLEDGER_ENDPOINT=http://localhost:3001
NEXT_PUBLIC_MAP_DEFAULT_LAT=0.0236
NEXT_PUBLIC_MAP_DEFAULT_LNG=37.9062
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=6
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
treetracker-web/
├── app/                      # Next.js 14 App Router
│   ├── captures/            # Tree capture pages
│   │   ├── new/            # New capture form
│   │   └── page.tsx        # Captures list
│   ├── tokens/             # Impact tokens pages
│   ├── map/                # Map view
│   ├── notifications/      # Notifications page
│   ├── profile/            # User profile
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard
│   └── globals.css         # Global styles
├── components/              # Reusable React components
│   ├── Header.tsx          # Navigation header
│   ├── StatsCard.tsx       # Statistics card
│   ├── CaptureCard.tsx     # Tree capture card
│   ├── TokenCard.tsx       # Impact token card
│   ├── NotificationItem.tsx # Notification item
│   └── MapView.tsx         # Map component
├── lib/                     # Utility functions and services
│   ├── api.ts              # API service layer
│   ├── mockData.ts         # Mock data for development
│   ├── offlineQueue.ts     # Offline queue manager
│   ├── geolocation.ts      # Geolocation service
│   └── utils.ts            # Utility functions
├── types/                   # TypeScript type definitions
│   └── index.ts            # All type definitions
├── public/                  # Static assets
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── next.config.mjs         # Next.js configuration
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Maps**: Leaflet & React-Leaflet
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🔌 API Integration

The application includes a complete API service layer (`lib/api.ts`) with mock data for development. To integrate with a real backend:

1. Update the `NEXT_PUBLIC_API_URL` in `.env.local`
2. Replace mock API calls in `lib/api.ts` with actual HTTP requests
3. Implement authentication token management
4. Add error handling and retry logic

### API Endpoints

The application expects the following API endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /profile/:userId` - Get user profile
- `PUT /profile/:userId` - Update user profile
- `GET /captures` - Get tree captures (paginated)
- `POST /captures` - Submit new capture
- `GET /captures/:id` - Get capture details
- `GET /tokens` - Get impact tokens (paginated)
- `GET /tokens/:id` - Get token details
- `GET /notifications` - Get user notifications
- `POST /notifications/:id/read` - Mark notification as read
- `GET /dashboard/stats` - Get dashboard statistics

## 🔗 Hyperledger Fabric Integration

The application is designed to integrate with Hyperledger Fabric for blockchain-based token management:

### Integration Points

1. **Token Issuance**: When a capture is verified, trigger chaincode to mint Impact Token
2. **Token Verification**: Query blockchain to verify token authenticity
3. **Transaction History**: Retrieve token transaction history from ledger
4. **Token Transfer**: Execute chaincode for token trading/transfer

### Implementation Steps

1. Set up Hyperledger Fabric network
2. Deploy TreeTracker chaincode
3. Configure Fabric SDK in backend
4. Update API endpoints to interact with chaincode
5. Implement wallet management for users

### Chaincode Functions

```javascript
// Example chaincode functions
- CreateToken(captureId, planterId, value)
- TransferToken(tokenId, fromUser, toUser)
- QueryToken(tokenId)
- QueryTokensByOwner(planterId)
- UpdateTokenState(tokenId, newState)
```

## 📱 Offline Functionality

The application includes robust offline support:

### Features
- **Offline Queue**: Automatically queues captures when offline
- **Auto-Sync**: Syncs queued items when connection is restored
- **Status Indicators**: Shows online/offline status
- **Retry Logic**: Automatically retries failed uploads

### Implementation
The offline queue is managed by `lib/offlineQueue.ts` and uses localStorage for persistence.

## 🗺️ Geolocation

The application uses the browser's Geolocation API:

### Features
- **High Accuracy Mode**: Requests precise GPS coordinates
- **Error Handling**: Graceful handling of permission denials
- **Distance Calculation**: Haversine formula for distance between points
- **Coordinate Validation**: Ensures valid latitude/longitude values

## 🎨 Customization

### Theming
Modify colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#f0fdf4',
    // ... other shades
    900: '#14532d',
  },
}
```

### Map Configuration
Update map settings in `.env.local`:

```env
NEXT_PUBLIC_MAP_DEFAULT_LAT=0.0236
NEXT_PUBLIC_MAP_DEFAULT_LNG=37.9062
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=6
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create new tree capture with photo and GPS
- [ ] Test offline queue functionality
- [ ] Verify map markers display correctly
- [ ] Check token history and details
- [ ] Test notification system
- [ ] Verify profile editing
- [ ] Test responsive design on mobile
- [ ] Check all navigation links

### Future Testing
- Add unit tests with Jest
- Add integration tests with React Testing Library
- Add E2E tests with Playwright

## 📦 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

The easiest way to deploy is using Vercel:

```bash
npm install -g vercel
vercel
```

### Environment Variables

Ensure all environment variables are set in your deployment platform:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_HYPERLEDGER_ENDPOINT`
- `NEXT_PUBLIC_MAP_DEFAULT_LAT`
- `NEXT_PUBLIC_MAP_DEFAULT_LNG`
- `NEXT_PUBLIC_MAP_DEFAULT_ZOOM`

## 🔒 Security Considerations

- Implement proper authentication and authorization
- Validate all user inputs on both client and server
- Use HTTPS for all API communications
- Implement rate limiting for API endpoints
- Secure storage of sensitive data
- Regular security audits and updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Greenstand TreeTracker ecosystem.

## 🙏 Acknowledgments

- Greenstand for the TreeTracker concept and mission
- OpenStreetMap for map tiles
- All contributors to the open-source libraries used

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the Greenstand team
- Join the community discussions

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core capture functionality
- ✅ Token tracking
- ✅ Map visualization
- ✅ Offline support

### Phase 2 (Planned)
- [ ] Real backend integration
- [ ] Hyperledger Fabric integration
- [ ] Mobile app synchronization
- [ ] Advanced analytics

### Phase 3 (Future)
- [ ] Token marketplace
- [ ] Social features
- [ ] Gamification
- [ ] Multi-language support

---

Built with 🌳 by the TreeTracker team