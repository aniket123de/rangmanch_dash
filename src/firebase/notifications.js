import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Send a notification from a brand to a creator
 * @param {Object} notificationData - The notification data
 * @param {string} notificationData.receiverId - Creator's user ID
 * @param {string} notificationData.senderId - Brand's user ID
 * @param {string} notificationData.brandName - Brand name
 * @param {string} notificationData.industry - Brand industry
 * @param {string} notificationData.website - Brand website
 * @param {string} notificationData.location - Brand location
 * @param {Object} notificationData.socials - Brand social media links
 * @param {string} notificationData.message - Custom message from brand
 * @param {string} notificationData.brandLogo - Brand logo URL
 * @returns {Promise<string>} - Document ID of the created notification
 */
export const sendNotification = async (notificationData) => {
  try {
    const notification = {
      ...notificationData,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      readAt: null,
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);
    return docRef.id;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Fetch notifications for a specific user (creator)
 * @param {string} userId - The user ID to fetch notifications for
 * @param {Function} callback - Callback function to handle real-time updates
 * @returns {Function} - Unsubscribe function
 */
export const fetchNotifications = (userId, callback) => {
  console.log('fetchNotifications: Setting up listener for user:', userId);
  try {
    // TEMP: Show all notifications for admin/testing
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc')
    );
    // To restore filtering, use:
    // const q = query(
    //   collection(db, 'notifications'),
    //   where('receiverId', '==', userId),
    //   orderBy('createdAt', 'desc')
    // );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('fetchNotifications: Received snapshot with', snapshot.size, 'documents');
      const notifications = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        });
      });
      console.log('fetchNotifications: Processed notifications:', notifications.length);
      callback(notifications);
    }, (error) => {
      console.error('fetchNotifications: Error in snapshot listener:', error);
      callback([]);
    });

    console.log('fetchNotifications: Listener setup complete');
    return unsubscribe;
  } catch (error) {
    console.error('fetchNotifications: Error setting up notifications listener:', error);
    callback([]);
    return () => {};
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The notification document ID
 * @returns {Promise<void>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      status: 'viewed',
      readAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Update notification status (accept/reject)
 * @param {string} notificationId - The notification document ID
 * @param {string} status - New status ('accepted' or 'rejected')
 * @returns {Promise<void>}
 */
export const updateNotificationStatus = async (notificationId, status) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};

/**
 * Get brand information by user ID
 * @param {string} brandId - Brand's user ID
 * @returns {Promise<Object>} - Brand information
 */
export const getBrandInfo = async (brandId) => {
  try {
    // Validate brandId parameter
    if (!brandId || typeof brandId !== 'string' || brandId.trim() === '') {
      console.error('Invalid brandId provided to getBrandInfo:', brandId);
      return null;
    }
    
    const brandDoc = await getDoc(doc(db, 'brands', brandId.trim()));
    if (brandDoc.exists()) {
      return { id: brandDoc.id, ...brandDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching brand info for brandId:', brandId, error);
    throw error;
  }
};

/**
 * Get creator information by user ID
 * @param {string} creatorId - Creator's user ID
 * @returns {Promise<Object>} - Creator information
 */
export const getCreatorInfo = async (creatorId) => {
  try {
    const creatorDoc = await getDoc(doc(db, 'creators', creatorId));
    if (creatorDoc.exists()) {
      return { id: creatorDoc.id, ...creatorDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching creator info:', error);
    throw error;
  }
}; 