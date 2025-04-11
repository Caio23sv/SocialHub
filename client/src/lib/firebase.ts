import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
  User
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk9QzTHpYqa6o1k4zj7YugbTogZplL1-E",
  authDomain: "yah8-a72df.firebaseapp.com",
  databaseURL: "https://yah8-a72df-default-rtdb.firebaseio.com",
  projectId: "yah8-a72df",
  storageBucket: "yah8-a72df.firebasestorage.app",
  messagingSenderId: "886794974355",
  appId: "1:886794974355:web:66bf33152c582483328966",
  measurementId: "G-2WK519MKE3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Types for authentication
export interface SignUpParams {
  email: string;
  password: string;
  username: string;
  displayName: string;
  photoURL?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

// Helper functions for authentication with email and password
export const signUpWithEmailPassword = async (params: SignUpParams): Promise<UserCredential> => {
  try {
    const { email, password, displayName, photoURL } = params;
    
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with displayName and photoURL if provided
    await updateProfile(userCredential.user, {
      displayName,
      photoURL: photoURL || null
    });
    
    return userCredential;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

export const signInWithEmailPassword = async (params: SignInParams): Promise<UserCredential> => {
  try {
    const { email, password } = params;
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// Helper functions for Google authentication
export const signInWithGoogle = async () => {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error during Google sign in:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};