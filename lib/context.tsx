import { ID, Models } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account } from "@/lib/appwrite";

type User = Models.User<Models.Preferences>;

interface UserContextType {
    current: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

// Create the context with an initial undefined value
const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string): Promise<void> {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const loggedIn = await account.get();
      setUser(loggedIn);
    //   toast('Welcome back. You are logged in');
    } catch (error) {
      console.error('Login error:', error);
    //   toast('Login failed');
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      await account.deleteSession("current");
      setUser(null);
    //   toast('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
    //   toast('Logout failed');
      throw error;
    }
  }

  async function register(email: string, password: string): Promise<void> {
    try {
      await account.create(ID.unique(), email, password);
      await login(email, password);
    //   toast('Account created');
    } catch (error) {
      console.error('Registration error:', error);
    //   toast('Registration failed');
      throw error;
    }
  }

  async function init(): Promise<void> {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
    //   toast('Welcome back. You are logged in');
    } catch (err) {
      setUser(null);
      // Silent error - user is simply not logged in
    }
  }

  useEffect(() => {
    init();
  }, []);

  const value: UserContextType = {
    current: user,
    login,
    logout,
    register
  };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
  );
}