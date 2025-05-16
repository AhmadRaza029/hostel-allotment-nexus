
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type UserType = 'student' | 'admin';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  userType: UserType | null;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signIn: (email: string, password: string, type: UserType) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check if user is admin
        if (currentSession?.user) {
          const isUserAdmin = currentSession.user.app_metadata?.role === 'admin';
          setIsAdmin(isUserAdmin);
          setUserType(isUserAdmin ? 'admin' : 'student');
        } else {
          setUserType(null);
        }
        
        // Handle events
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const isUserAdmin = currentSession.user.app_metadata?.role === 'admin';
        setIsAdmin(isUserAdmin);
        setUserType(isUserAdmin ? 'admin' : 'student');
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful!",
        description: "Please check your email for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string, type: UserType) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      // Verify user type matches
      if (type === 'admin' && data.user?.app_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("You're not authorized as an administrator");
      } else if (type === 'student' && data.user?.app_metadata?.role === 'admin') {
        await supabase.auth.signOut();
        throw new Error("Please use the administrator login");
      }
      
      setUserType(type);
      toast({
        title: "Login successful!",
      });
      navigate(type === 'admin' ? '/admin' : '/dashboard');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUserType(null);
      toast({
        title: "Successfully signed out",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      isAdmin, 
      userType, 
      signUp, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function RequireAuth({ children, admin = false }: { children: React.ReactNode, admin?: boolean }) {
  const { user, isLoading, isAdmin, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
    
    if (!isLoading && admin && !isAdmin) {
      navigate('/dashboard');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area",
        variant: "destructive"
      });
    }

    // Redirect if user type doesn't match expected type
    if (!isLoading && user && userType) {
      if (admin && userType !== 'admin') {
        navigate('/dashboard');
      } else if (!admin && userType === 'admin' && window.location.pathname.startsWith('/dashboard')) {
        navigate('/admin');
      }
    }
  }, [user, isLoading, isAdmin, userType, admin, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }
  
  if (admin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
