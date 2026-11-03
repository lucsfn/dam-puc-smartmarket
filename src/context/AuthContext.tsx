import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';

type AuthContextData = {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (email: string, senha: string) => Promise<void>;
  recuperarSenha: (email: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      }),
    [],
  );

  const value: AuthContextData = {
    user,
    loading,
    login: async (email, senha) => {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    },
    cadastrar: async (email, senha) => {
      await createUserWithEmailAndPassword(auth, email.trim(), senha);
    },
    recuperarSenha: (email) => sendPasswordResetEmail(auth, email.trim()),
    sair: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
