import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  login: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@repik:token');
    const user = localStorage.getItem('@repik:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });

  // useEffect(() => {
  //   if (data.token) {
  //     api.defaults.headers.common['authorization'] = `Bearer ${data.token}`;
  //     // api.defaults.headers['authorization'] = `Bearer ${data.token}`;
  //     return;
  //   }

  //   // delete api.defaults.headers['authorization'];
  // }, [data]);

  const signIn = useCallback(async ({ login, password }: SignInCredentials) => {
    const response = await api.post('sessions', { login, password });
    const { user, token } = response.data;

    localStorage.setItem('@repik:token', token);
    localStorage.setItem('@repik:user', JSON.stringify(user));

    setData({ user, token });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
