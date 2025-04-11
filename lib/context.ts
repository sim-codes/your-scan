import { ID, Models } from "react-native-appwrite";
import { create } from "zustand";
import { account } from "@/lib/appwrite";
import Toast from "react-native-toast-message";

type User = Models.User<Models.Preferences>;

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
      const session = await account.createEmailPasswordSession(email, password);
      const loggedIn = await account.get();
      set({ user: loggedIn, isLoading: false });

      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: `Welcome back, ${loggedIn.name || 'User'}!`,
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
      await account.deleteSession("current");
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
      await account.create(ID.unique(), email, password, fullName);

      // Auto-login after registration
      const session = await account.createEmailPasswordSession(email, password);
      const loggedIn = await account.get();
      set({ user: loggedIn, isLoading: false });

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
    try {
      const loggedIn = await account.get();
      set({ user: loggedIn, isLoading: false });
      console.log('User authenticated:', loggedIn.name);
    } catch (err) {
      set({ user: null, isLoading: false });
      // Silent error - user is simply not logged in
      console.log('No active session found');
    }
  }
}));

// Helper function to extract error message from Appwrite errors
function extractErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    // Handle Appwrite specific error format
    if ('message' in error) {
      return (error as { message: string }).message;
    }

    // Handle potential response error format
    if ('response' in error &&
      typeof (error as any).response === 'object' &&
      (error as any).response &&
      'message' in (error as any).response) {
      return (error as any).response.message;
    }
  }
  return 'An unexpected error occurred';
}

// Initialize the auth state when the app loads
export function initializeAuth() {
  useUserStore.getState().init();
}
