import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import type { User } from '@shared/schema';

// Collection references
const USERS_COLLECTION = 'users';

// Helper interface for user profile in Firestore
export interface FirestoreUserProfile {
  id: number;
  username: string;
  name: string;
  email?: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  avatar?: string | null;
  isSeller?: boolean;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  stripeCustomerId?: string | null;
  stripeAccountId?: string | null;
  firebaseUid?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates a new user profile in Firestore
 */
export async function createUserProfile(userData: FirestoreUserProfile): Promise<FirestoreUserProfile> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userData.id.toString());
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return userData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

/**
 * Retrieves a user profile from Firestore by ID
 */
export async function getUserProfileById(userId: number): Promise<FirestoreUserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId.toString());
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as FirestoreUserProfile;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting user profile with ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Retrieves a user profile from Firestore by Firebase UID
 */
export async function getUserProfileByFirebaseUid(firebaseUid: string): Promise<FirestoreUserProfile | null> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('firebaseUid', '==', firebaseUid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as FirestoreUserProfile;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting user profile with Firebase UID ${firebaseUid}:`, error);
    throw error;
  }
}

/**
 * Updates a user profile in Firestore
 */
export async function updateUserProfile(
  userId: number, 
  updates: Partial<FirestoreUserProfile>
): Promise<FirestoreUserProfile> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId.toString());
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
    
    // Get the updated document
    const updatedUserDoc = await getDoc(userRef);
    
    if (!updatedUserDoc.exists()) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return updatedUserDoc.data() as FirestoreUserProfile;
  } catch (error) {
    console.error(`Error updating user profile with ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Links a Firebase Auth user to an existing profile
 */
export async function linkFirebaseUser(userId: number, firebaseUid: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId.toString());
    await updateDoc(userRef, {
      firebaseUid,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error linking Firebase user to profile with ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Updates or creates a user's seller status
 */
export async function updateSellerStatus(userId: number, isSeller: boolean): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId.toString());
    await updateDoc(userRef, {
      isSeller,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error updating seller status for user with ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Updates a user's Stripe information
 */
export async function updateUserStripeInfo(
  userId: number, 
  stripeCustomerId: string, 
  stripeAccountId?: string
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId.toString());
    await updateDoc(userRef, {
      stripeCustomerId,
      ...(stripeAccountId ? { stripeAccountId } : {}),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error updating Stripe info for user with ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Converts a Firestore user profile to a standard User object
 */
export function firestoreToUser(firestoreUser: FirestoreUserProfile): User {
  return {
    id: firestoreUser.id,
    username: firestoreUser.username,
    password: '', // Password is not stored in Firestore
    name: firestoreUser.name,
    bio: firestoreUser.bio || null,
    location: firestoreUser.location || null,
    website: firestoreUser.website || null,
    avatar: firestoreUser.avatar || null,
    followersCount: firestoreUser.followersCount || 0,
    followingCount: firestoreUser.followingCount || 0,
    postsCount: firestoreUser.postsCount || 0,
    isSeller: firestoreUser.isSeller || false,
    stripeCustomerId: firestoreUser.stripeCustomerId || null,
    stripeAccountId: firestoreUser.stripeAccountId || null
  };
}

/**
 * Converts a standard User object to a Firestore user profile
 */
export function userToFirestore(user: User, firebaseUid?: string): FirestoreUserProfile {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    location: user.location,
    website: user.website,
    avatar: user.avatar,
    followersCount: user.followersCount || 0,
    followingCount: user.followingCount || 0,
    postsCount: user.postsCount || 0,
    isSeller: user.isSeller || false,
    stripeCustomerId: user.stripeCustomerId,
    stripeAccountId: user.stripeAccountId,
    firebaseUid,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
// Collection references
const ADS_COLLECTION = 'ads';

export interface FirestoreAd {
  id: string;
  sellerId: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function createAd(adData: Omit<FirestoreAd, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreAd> {
  try {
    const adRef = doc(collection(db, ADS_COLLECTION));
    const newAd: FirestoreAd = {
      ...adData,
      id: adRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(adRef, newAd);
    return newAd;
  } catch (error) {
    console.error('Error creating ad:', error);
    throw error;
  }
}
