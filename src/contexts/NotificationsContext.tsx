import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { fetchNotifications, markNotificationAsRead, updateNotificationStatus } from '../firebase/notifications';

interface NotificationData {
  id: string;
  receiverId: string;
  senderId: string;
  brandName: string;
  industry: string;
  website: string;
  location: string;
  socials: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  message: string;
  brandLogo?: string;
  status: 'new' | 'viewed' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  formattedTimestamp?: string;
}

interface NotificationsContextType {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  updateStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
  refreshNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  const unreadCount = notifications.filter(n => n.status === 'new').length;

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Add formatted timestamp to notifications
  const addFormattedTimestamp = (notifications: NotificationData[]) => {
    return notifications.map(notification => ({
      ...notification,
      formattedTimestamp: formatTimestamp(notification.createdAt)
    }));
  };

  const setupNotificationsListener = (userId: string) => {
    if (unsubscribe) {
      unsubscribe();
    }

    const unsubscribeFn = fetchNotifications(userId, (notifications: NotificationData[]) => {
      const notificationsWithTimestamp = addFormattedTimestamp(notifications);
      setNotifications(notificationsWithTimestamp);
      setLoading(false);
    });

    setUnsubscribe(() => unsubscribeFn);
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        setupNotificationsListener(user.uid);
      } else {
        setNotifications([]);
        setLoading(false);
        if (unsubscribe) {
          unsubscribe();
          setUnsubscribe(null);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      await updateNotificationStatus(id, status);
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error updating notification status:', error);
      throw error;
    }
  };

  const refreshNotifications = () => {
    const user = auth.currentUser;
    if (user) {
      setupNotificationsListener(user.uid);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        updateStatus,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
