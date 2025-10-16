'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Filter, Search } from 'lucide-react';
import CaptureCard from '@/components/CaptureCard';
import { mockTreeCaptures } from '@/lib/mockData';
import { CaptureStatus } from '@/types';

export default function CapturesPage() {
  const [captures, setCaptures] = useState(mockTreeCaptures);
  const [filteredCaptures, setFilteredCaptures] = useState(mockTreeCaptures);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaptureStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = captures;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((capture) => capture.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (capture) =>
          capture.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          capture.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          capture.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCaptures(filtered);
  }, [captures, statusFilter, searchQuery]);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tree Captures</h1>
          <p className="text-gray-600">View and manage all your documented trees</p>
        </div>
        <Link
          href="/captures/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center space-x-2"
        >
          <Camera className="w-5 h-5" />
          <span>New Capture</span>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <p className="text-sm text-gray-600 mb-1">Total Captures</p>
          <p className="text-2xl font-bold text-gray-900">{captures.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <p className="text-sm text-gray-600 mb-1">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {captures.filter((c) => c.status === 'verified').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {captures.filter((c) => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <p className="text-sm text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {captures.filter((c) => c.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by species, notes, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CaptureStatus | 'all')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
              <option value="queued">Queued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredCaptures.length} of {captures.length} captures
        </p>
      </div>

      {/* Captures Grid */}
      {filteredCaptures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaptures.map((capture) => (
            <CaptureCard key={capture.id} capture={capture} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No captures found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start documenting your trees by creating your first capture'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              href="/captures/new"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              <Camera className="w-5 h-5" />
              <span>Create First Capture</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}