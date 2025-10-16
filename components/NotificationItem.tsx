import { Bell, CheckCircle, XCircle, AlertCircle, Coins, Camera } from 'lucide-react';
import { Notification } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'verification_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'verification_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'token_issued':
        return <Coins className="w-5 h-5 text-yellow-600" />;
      case 'survival_check_required':
        return <Camera className="w-5 h-5 text-blue-600" />;
      case 'system_alert':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    if (!notification.isRead) {
      return 'bg-primary-50 border-primary-200';
    }
    return 'bg-white border-gray-200';
  };

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const content = (
    <div
      className={`p-4 rounded-lg border ${getBgColor()} hover:shadow-md transition cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 ml-2 mt-1"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-2">{formatRelativeTime(notification.createdAt)}</p>
        </div>
      </div>
    </div>
  );

  if (notification.actionUrl) {
    return <Link href={notification.actionUrl}>{content}</Link>;
  }

  return content;
}