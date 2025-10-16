'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { mockPlanterProfile } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockPlanterProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Here you would call the API to update the profile
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-green-600"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{profile.name.charAt(0)}</span>
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-semibold">{profile.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{profile.email || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phoneNumber}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{profile.phoneNumber}</span>
                </div>
              )}
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Region</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.region}
                  onChange={(e) => setEditedProfile({ ...editedProfile, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{profile.region}</span>
                </div>
              )}
            </div>

            {/* Project Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Code</label>
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
                  {profile.projectCode}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Member Since</label>
              <div className="flex items-center space-x-2 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{profile.createdAt ? formatDate(profile.createdAt) : 'Not available'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{profile.totalTreesPlanted}</p>
            <p className="text-sm text-gray-600 mt-1">Trees Planted</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{profile.verifiedTrees}</p>
            <p className="text-sm text-gray-600 mt-1">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{profile.pendingSubmissions}</p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{profile.totalImpactTokens}</p>
            <p className="text-sm text-gray-600 mt-1">Impact Tokens</p>
          </div>
        </div>
      </div>
    </div>
  );
}