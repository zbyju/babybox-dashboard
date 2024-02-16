import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './contexts/auth-context';
import Loading from '@/app/loading';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return <Loading />
  }

  return children;
};

