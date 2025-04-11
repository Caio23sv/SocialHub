import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOut as firebaseSignOut } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  getUserProfileByFirebaseUid, 
  createUserProfile, 
  userToFirestore, 
  firestoreToUser 
} from './firestore';
import { storage } from '../../server/storage';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setFirebaseUser(firebaseUser);
      
      try {
        if (firebaseUser) {
          // Check if user already exists in Firestore
          const firestoreUser = await getUserProfileByFirebaseUid(firebaseUser.uid);
          
          if (firestoreUser) {
            // User already exists, convert to our User model
            setUser(firestoreToUser(firestoreUser));
          } else {
            // User doesn't exist, create a new user in our backend
            // Then create a profile in Firestore
            const newUser = await createNewUser(firebaseUser);
            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const createNewUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      // Create user in our application's storage
      const newUser = await storage.createUser({
        username: firebaseUser.email?.split('@')[0] || `user_${Date.now()}`,
        password: '', // Use Firebase for auth, so no need for password
        name: firebaseUser.displayName || 'New User',
        bio: null,
        location: null,
        website: null,
        avatar: firebaseUser.photoURL,
        isSeller: false
      });
      
      // Save to Firestore with Firebase UID
      await createUserProfile(userToFirestore(newUser, firebaseUser.uid));
      
      return newUser;
    } catch (error) {
      console.error('Error creating new user:', error);
      throw error;
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // Auth state observer will handle the rest
    } catch (err) {
      console.error('Sign in error:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    firebaseUser,
    isLoading,
    error,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};