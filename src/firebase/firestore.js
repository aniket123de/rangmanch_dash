import { 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  collection, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import { db } from './firebase';

// ===== CREATOR FUNCTIONS =====

// Create or update creator profile
export const createOrUpdateCreatorProfile = async (uid, creatorData) => {
  try {
    const creatorRef = doc(db, 'creators', uid);
    await setDoc(creatorRef, {
      ...creatorData,
      uid: uid,
      updatedAt: serverTimestamp(),
      createdAt: creatorData.createdAt || serverTimestamp()
    }, { merge: true });
    
    return { success: true, creatorId: uid };
  } catch (error) {
    throw error;
  }
};

// Get creator profile by ID
export const getCreatorProfile = async (creatorId) => {
  try {
    const creatorRef = doc(db, 'creators', creatorId);
    const creatorSnap = await getDoc(creatorRef);
    
    if (creatorSnap.exists()) {
      return { id: creatorSnap.id, ...creatorSnap.data() };
    } else {
      throw new Error('Creator not found');
    }
  } catch (error) {
    throw error;
  }
};

// Get current user's creator profile
export const getMyCreatorProfile = async (uid) => {
  try {
    return await getCreatorProfile(uid);
  } catch (error) {
    throw error;
  }
};

// ===== BRAND DISCOVERY FUNCTIONS =====

// Get all brands (for creators to discover)
export const getAllBrands = async () => {
  try {
    const brandsRef = collection(db, 'brands');
    const q = query(brandsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const brands = [];
    querySnapshot.forEach((doc) => {
      brands.push({ id: doc.id, ...doc.data() });
    });
    
    return brands;
  } catch (error) {
    throw error;
  }
};

// Get brand profile by ID
export const getBrandProfile = async (brandId) => {
  try {
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);
    
    if (brandSnap.exists()) {
      return { id: brandSnap.id, ...brandSnap.data() };
    } else {
      throw new Error('Brand not found');
    }
  } catch (error) {
    throw error;
  }
};

// ===== USER FUNCTIONS =====

// Get user data by UID
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      // User document doesn't exist, return null instead of throwing error
      console.warn(`User document not found for UID: ${uid}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// ===== COLLABORATION FUNCTIONS =====

// Create collaboration proposal
export const createCollaboration = async (collaborationData) => {
  try {
    const collabRef = doc(collection(db, 'collaborations'));
    const collabData = {
      ...collaborationData,
      id: collabRef.id,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, accepted, rejected
    };
    
    await setDoc(collabRef, collabData);
    return { success: true, collaborationId: collabRef.id };
  } catch (error) {
    throw error;
  }
};

// Get collaborations for a creator
export const getCreatorCollaborations = async (creatorId) => {
  try {
    const collabsRef = collection(db, 'collaborations');
    const q = query(
      collabsRef, 
      where('creatorId', '==', creatorId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const collaborations = [];
    querySnapshot.forEach((doc) => {
      collaborations.push({ id: doc.id, ...doc.data() });
    });
    
    return collaborations;
  } catch (error) {
    throw error;
  }
};

// Update collaboration status
export const updateCollaborationStatus = async (collaborationId, status) => {
  try {
    const collabRef = doc(db, 'collaborations', collaborationId);
    await updateDoc(collabRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// ===== CREATOR-SPECIFIC FUNCTIONS =====

// Get creator analytics data
export const getCreatorAnalytics = async (creatorId) => {
  try {
    // This would integrate with your existing analytics system
    // For now, returning a placeholder structure
    return {
      totalViews: 0,
      totalEngagement: 0,
      totalCollaborations: 0,
      averageRating: 0
    };
  } catch (error) {
    throw error;
  }
};

// Search brands by criteria
export const searchBrands = async (searchTerm, filters = {}) => {
  try {
    const brandsRef = collection(db, 'brands');
    let q = query(brandsRef, orderBy('createdAt', 'desc'));
    
    // Add filters if provided
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    const querySnapshot = await getDocs(q);
    const brands = [];
    
    querySnapshot.forEach((doc) => {
      const brandData = { id: doc.id, ...doc.data() };
      
      // Filter by search term if provided
      if (!searchTerm || 
          brandData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brandData.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        brands.push(brandData);
      }
    });
    
    return brands;
  } catch (error) {
    throw error;
  }
}; 