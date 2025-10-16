'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TreePine, Coins, Clock, CheckCircle, Camera, TrendingUp, MapPin } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import CaptureCard from '@/components/CaptureCard';
import TokenCard from '@/components/TokenCard';
import { mockDashboardStats } from '@/lib/mockData';
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardContent() {
  const [stats, setStats] = useState(mockDashboardStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 🌳</h1>
        <p className="text-gray-600">Here's an overview of your reforestation impact.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Trees Planted"
          value={stats.totalTreesPlanted}
          icon={TreePine}
          trend={{ value: 12, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Impact Tokens"
          value={stats.totalTokens}
          icon={Coins}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Pending Verification"
          value={stats.pendingVerification}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Verified Trees"
          value={stats.verifiedTrees}
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/captures/new"
          className="bg-gradient-to-r from-green-600 to-primary-600 text-white rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Capture New Tree</h3>
              <p className="text-white/80 text-sm">Document your planting</p>
            </div>
          </div>
        </Link>

        <Link
          href="/map"
          className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">View Map</h3>
              <p className="text-gray-600 text-sm">See your tree locations</p>
            </div>
          </div>
        </Link>

        <Link
          href="/tokens"
          className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Impact Tokens</h3>
              <p className="text-gray-600 text-sm">Track your rewards</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Captures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Captures</h2>
            <Link href="/captures" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentCaptures.slice(0, 3).map((capture) => (
              <CaptureCard key={capture.id} capture={capture} />
            ))}
          </div>
        </div>

        {/* Recent Tokens */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Tokens</h2>
            <Link href="/tokens" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentTokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="mt-8 bg-gradient-to-r from-green-600 to-primary-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-white/80 text-sm mb-1">Total Carbon Offset</p>
            <p className="text-3xl font-bold">
              {stats.recentTokens.reduce((sum, token) => sum + (token.ecologicalValue.carbonOffset || 0), 0).toFixed(1)} kg
            </p>
          </div>
          <div>
            <p className="text-white/80 text-sm mb-1">Water Retention</p>
            <p className="text-3xl font-bold">
              {stats.recentTokens.reduce((sum, token) => sum + (token.ecologicalValue.waterRetention || 0), 0)} L
            </p>
          </div>
          <div>
            <p className="text-white/80 text-sm mb-1">Token Value</p>
            <p className="text-3xl font-bold">${stats.tokenValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}