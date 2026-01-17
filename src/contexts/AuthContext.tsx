import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, UserProfile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar perfil do usuário
  const fetchProfile = useCallback(async (userId: string) => {
    console.log('[AuthContext] fetchProfile iniciado para userId:', userId);
    
    try {
      console.log('[AuthContext] Fazendo query ao Supabase...');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('[AuthContext] Query completada!');
      console.log('[AuthContext] Data:', data);
      console.log('[AuthContext] Error:', error);

      if (error) {
        console.error('[AuthContext] Erro na query:', error.message, error.code);
        return null;
      }

      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/22b696ed-e64c-420f-a07d-eb89ece11458',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:fetchProfile',message:'profile loaded from DB',data:{userId,profile:data,free_credits_limit:data?.free_credits_limit,free_credits_used:data?.free_credits_used},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})}).catch(()=>{});
      // #endregion
      
      setProfile(data as UserProfile);
      console.log('[AuthContext] Profile definido no state:', data);
      
      return data as UserProfile;
    } catch (err) {
      console.error('[AuthContext] Erro catch:', err);
      return null;
    }
  }, []);

  // Atualizar perfil
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // Login com Magic Link (Email)
  const signInWithEmail = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao enviar email de login' };
    }
  }, []);

  // Login com Google
  const signInWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      return { success: false, error: 'Erro ao iniciar login com Google' };
    }
  }, []);

  // Logout
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  // Verificar sessão ao iniciar
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Obter sessão atual
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          console.log('[AuthContext] initAuth - Chamando fetchProfile...');
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        console.log('[AuthContext] onAuthStateChange - user:', newSession?.user?.id, newSession?.user?.email);

        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          console.log('[AuthContext] onAuthStateChange - Chamando fetchProfile...');
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
