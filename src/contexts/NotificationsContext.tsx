import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationData {
  id: string;
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
  timestamp: string;
  status: 'new' | 'viewed' | 'accepted' | 'rejected';
  brandLogo?: string;
  message: string;
}

interface NotificationsContextType {
  notifications: NotificationData[];
  unreadCount: number;
  setNotifications: (notifications: NotificationData[]) => void;
  markAsRead: (id: string) => void;
  addNotification: (notification: NotificationData) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

// Demo data
const demoNotifications: NotificationData[] = [
  {
    id: '1',
    brandName: 'StyleCraft Fashion',
    industry: 'Fashion & Lifestyle',
    website: 'https://stylecraft.com',
    location: 'Mumbai, Maharashtra',
    socials: {
      instagram: '@stylecraft_official',
      twitter: '@stylecraft',
      linkedin: 'stylecraft-fashion',
      facebook: 'StyleCraftFashion',
    },
    timestamp: '2 hours ago',
    status: 'new',
    brandLogo: 'https://via.placeholder.com/60x60/FF6B6B/ffffff?text=SC',
    message: 'StyleCraft Fashion wants to collaborate with you for their upcoming summer collection campaign.',
  },
  {
    id: '2',
    brandName: 'TechGear Pro',
    industry: 'Technology & Electronics',
    website: 'https://techgearpro.com',
    location: 'Bangalore, Karnataka',
    socials: {
      instagram: '@techgearpro',
      twitter: '@techgear_pro',
      linkedin: 'techgear-pro',
    },
    timestamp: '1 day ago',
    status: 'viewed',
    brandLogo: 'https://via.placeholder.com/60x60/4ECDC4/ffffff?text=TG',
    message: 'TechGear Pro is interested in featuring your tech reviews for their new product launch.',
  },
  {
    id: '3',
    brandName: 'GreenLife Organics',
    industry: 'Health & Wellness',
    website: 'https://greenlifeorganics.com',
    location: 'Pune, Maharashtra',
    socials: {
      instagram: '@greenlife_organics',
      twitter: '@greenlifeorg',
      linkedin: 'greenlife-organics',
      facebook: 'GreenLifeOrganics',
    },
    timestamp: '3 days ago',
    status: 'accepted',
    brandLogo: 'https://via.placeholder.com/60x60/95E1D3/ffffff?text=GL',
    message: 'GreenLife Organics has selected you for their wellness ambassador program.',
  },
];

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotificationsState] = useState<NotificationData[]>(demoNotifications);

  const unreadCount = notifications.filter(n => n.status === 'new').length;

  const setNotifications = (newNotifications: NotificationData[]) => {
    setNotificationsState(newNotifications);
  };

  const markAsRead = (id: string) => {
    setNotificationsState(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, status: 'viewed' } : notification
      )
    );
  };

  const addNotification = (notification: NotificationData) => {
    setNotificationsState(prev => [notification, ...prev]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        setNotifications,
        markAsRead,
        addNotification,
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
