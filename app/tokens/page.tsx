'use client';

import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Filter } from 'lucide-react';
import TokenCard from '@/components/TokenCard';
import { mockImpactTokens } from '@/lib/mockData';
import { TokenState } from '@/types';

export default function TokensPage() {
  const [tokens, setTokens] = useState(mockImpactTokens);
  const [filteredTokens, setFilteredTokens] = useState(mockImpactTokens);
  const [stateFilter, setStateFilter] = useState<TokenState | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = tokens;

    // Apply state filter
    if (stateFilter !== 'all') {
      filtered = filtered.filter((token) => token.state === stateFilter);
    }

    setFilteredTokens(filtered);
  }, [tokens, stateFilter]);

  // Calculate totals
  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
  const totalCarbonOffset = tokens.reduce(
    (sum, token) => sum + (token.ecologicalValue.carbonOffset || 0),
    0
  );
  const totalWaterRetention = tokens.reduce(
    (sum, token) => sum + (token.ecologicalValue.waterRetention || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Tokens</h1>
        <p className="text-gray-600">Track and manage your environmental impact tokens</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-600 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Tokens</span>
            <Coins className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold">{tokens.length}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Value</span>
            <TrendingUp className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold">{totalValue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Carbon Offset</span>
            <span className="text-xl opacity-90">🌍</span>
          </div>
          <p className="text-3xl font-bold">{totalCarbonOffset.toFixed(1)} kg</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Water Saved</span>
            <span className="text-xl opacity-90">💧</span>
          </div>
          <p className="text-3xl font-bold">{totalWaterRetention} L</p>
        </div>
      </div>

      {/* Token State Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Token Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {tokens.filter((t) => t.state === 'basic').length}
            </p>
            <p className="text-sm text-gray-600">Basic</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {tokens.filter((t) => t.state === 'mature').length}
            </p>
            <p className="text-sm text-gray-600">Mature</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {tokens.filter((t) => t.state === 'traded').length}
            </p>
            <p className="text-sm text-gray-600">Traded</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {tokens.filter((t) => t.state === 'redeemed').length}
            </p>
            <p className="text-sm text-gray-600">Redeemed</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as TokenState | 'all')}
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
          >
            <option value="all">All States</option>
            <option value="basic">Basic</option>
            <option value="mature">Mature</option>
            <option value="traded">Traded</option>
            <option value="redeemed">Redeemed</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTokens.length} of {tokens.length} tokens
        </p>
      </div>

      {/* Tokens Grid */}
      {filteredTokens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tokens found</h3>
          <p className="text-gray-600">
            {stateFilter !== 'all'
              ? 'Try adjusting your filter'
              : 'Start planting trees to earn Impact Tokens'}
          </p>
        </div>
      )}
    </div>
  );
}