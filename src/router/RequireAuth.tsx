import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function RequireAuth({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/signin" />;
}
