import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { TreeCapture } from '@/types';
import { formatDateTime, getStatusColor, getStatusBadgeText } from '@/lib/utils';

interface CaptureCardProps {
  capture: TreeCapture;
}

export default function CaptureCard({ capture }: CaptureCardProps) {
  const getStatusIcon = () => {
    switch (capture.status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'flagged':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Link href={`/captures/${capture.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
        {/* Image */}
        <div className="relative h-48 w-full">
          <Image
            src={capture.photoUrl}
            alt={`Tree capture - ${capture.species || 'Unknown species'}`}
            fill
            className="object-cover"
          />
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(capture.status)}`}>
            {getStatusIcon()}
            <span>{getStatusBadgeText(capture.status)}</span>
          </div>
          {/* Follow-up Badge */}
          {capture.isFollowUp && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
              Follow-up
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Species */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {capture.species || 'Unknown Species'}
          </h3>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {capture.gpsCoordinates.latitude.toFixed(6)}, {capture.gpsCoordinates.longitude.toFixed(6)}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDateTime(capture.timestamp)}</span>
          </div>

          {/* Notes */}
          {capture.notes && (
            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
              {capture.notes}
            </p>
          )}

          {/* Token Info */}
          {capture.tokenId && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Impact Token</span>
                <Link
                  href={`/tokens/${capture.tokenId}`}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Token →
                </Link>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {capture.status === 'rejected' && capture.rejectionReason && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-red-600">
                <strong>Reason:</strong> {capture.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}