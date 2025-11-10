import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { api } from '../config/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há usuário salvo
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.data.user);
    return data;
  };

  const register = async (email, password, nome) => {
    const data = await api.register(email, password, nome);
    if (data.data?.session?.access_token) {
      localStorage.setItem('access_token', data.data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      setUser(data.data.user);
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

