import { create } from "zustand";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { auth } from "@/FirebaseConfig";

// Define types for input parameters
interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
}

interface UserStore {
  // State
  user: User | null;
  isLoading: boolean;

  // Actions
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  init: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,

  login: async ({ email, password }: LoginParams) => {
    set({ isLoading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, isLoading: false });

      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: `Welcome back, ${userCredential.user.displayName || 'User'}!`,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Login error:', error);

      // Extract error message for better user feedback
      const errorMessage = extractErrorMessage(error);

      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: errorMessage || 'Please check your credentials and try again',
      });

      throw new Error(errorMessage || 'Authentication failed');
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, isLoading: false });

      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'You have been successfully logged out',
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Logout error:', error);

      const errorMessage = extractErrorMessage(error);

      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: errorMessage || 'Please try again',
      });

      throw new Error(errorMessage || 'Logout failed');
    }
  },

  register: async ({ email, password, fullName }: RegisterParams) => {
    set({ isLoading: true });
    try {
      // Create the account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with the full name
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      set({ user: userCredential.user, isLoading: false });

      Toast.show({
        type: 'success',
        text1: 'Registration successful',
        text2: `Welcome, ${fullName}!`,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Registration error:', error);

      const errorMessage = extractErrorMessage(error);

      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: errorMessage || 'Please try again with different information',
      });

      throw new Error(errorMessage || 'Registration failed');
    }
  },

  init: async () => {
    set({ isLoading: true });
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          set({ user, isLoading: false });
          console.log('User authenticated:', user.displayName);
        } else {
          set({ user: null, isLoading: false });
          console.log('No active session found');
        }
        unsubscribe();
        resolve();
      });
    });
  }
}));

// Helper function to extract error message from Firebase errors
function extractErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    // Handle Firebase auth error format
    if ('code' in error && 'message' in error) {
      const errorCode = (error as { code: string }).code;
      const errorMessage = (error as { message: string }).message;

      // Map specific Firebase error codes to user-friendly messages
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        return 'Invalid email or password';
      } else if (errorCode === 'auth/email-already-in-use') {
        return 'This email is already registered';
      } else if (errorCode === 'auth/weak-password') {
        return 'Password is too weak';
      } else if (errorCode === 'auth/invalid-email') {
        return 'Invalid email address';
      }

      return errorMessage;
    }

    // Handle general error messages
    if ('message' in error) {
      return (error as { message: string }).message;
    }
  }
  return 'An unexpected error occurred';
}

// Initialize the auth state when the app loads
export function initializeAuth() {
  useUserStore.getState().init();
}
