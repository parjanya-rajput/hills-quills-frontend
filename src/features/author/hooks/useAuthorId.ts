import { useAuth, isAuthorUser } from '@/features/auth/hooks/useAuth';

export function useAuthorId(): number | null {
  const { user } = useAuth();

  // return -1 as authorId case will not be executed because of ProtectedRoute in layout
  return isAuthorUser(user) ? user.id : null;
}