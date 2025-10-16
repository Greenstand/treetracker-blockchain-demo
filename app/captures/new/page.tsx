'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, MapPin, Upload, Loader, CheckCircle } from 'lucide-react';
import { geolocation, GeolocationPosition } from '@/lib/geolocation';
import { api } from '@/lib/api';
import { offlineQueue } from '@/lib/offlineQueue';
import { CaptureSubmission } from '@/types';

function NewCaptureForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const followUpCaptureId = searchParams.get('followUp');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    photo: null as File | null,
    photoPreview: null as string | null,
    species: '',
    notes: '',
  });

  // Get location on mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await geolocation.getCurrentPosition();
      setLocation(position);
    } catch (err: any) {
      setLocationError(err.message || 'Failed to get location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.photo) {
      setError('Please select a photo');
      return;
    }

    if (!location) {
      setError('Location is required. Please enable location access.');
      return;
    }

    setIsLoading(true);

    try {
      const submission: CaptureSubmission = {
        photo: formData.photo,
        gpsCoordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
        },
        timestamp: new Date(),
        species: formData.species || undefined,
        notes: formData.notes || undefined,
        isFollowUp: !!followUpCaptureId,
        originalCaptureId: followUpCaptureId || undefined,
      };

      // Check if online
      if (navigator.onLine) {
        await api.submitTreeCapture(submission);
      } else {
        // Add to offline queue
        offlineQueue.addToQueue('capture', submission);
      }

      setIsSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/captures');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit capture');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Capture Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your tree capture has been {navigator.onLine ? 'submitted for verification' : 'queued for upload'}.
          </p>
          {!navigator.onLine && (
            <p className="text-sm text-yellow-600 mb-4">
              You're offline. Your capture will be uploaded automatically when you reconnect.
            </p>
          )}
          <p className="text-sm text-gray-500">Redirecting to captures page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {followUpCaptureId ? 'Follow-up Tree Capture' : 'New Tree Capture'}
        </h1>
        <p className="text-gray-600">
          {followUpCaptureId
            ? 'Upload a new photo to verify tree survival'
            : 'Document your newly planted tree with a photo and location'}
        </p>
      </div>

      {/* Offline Warning */}
      {!navigator.onLine && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>You're offline.</strong> Your capture will be queued and uploaded automatically when you reconnect.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tree Photo <span className="text-red-500">*</span>
          </label>
          {formData.photoPreview ? (
            <div className="relative">
              <img
                src={formData.photoPreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, photo: null, photoPreview: null })}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload photo</span>
              <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            GPS Location <span className="text-red-500">*</span>
          </label>
          {isGettingLocation ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Getting location...</span>
            </div>
          ) : location ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Location captured</p>
                  <p className="text-sm text-green-700 mt-1">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Accuracy: ±{location.accuracy.toFixed(0)}m</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 mb-2">{locationError || 'Location not available'}</p>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Species */}
        <div className="mb-6">
          <label htmlFor="species" className="block text-sm font-semibold text-gray-700 mb-2">
            Tree Species (Optional)
          </label>
          <input
            type="text"
            id="species"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            placeholder="e.g., Mango, Acacia, Eucalyptus"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional information about this tree..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !location || !formData.photo}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Submit Capture</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default function NewCapturePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewCaptureForm />
    </Suspense>
  );
}
