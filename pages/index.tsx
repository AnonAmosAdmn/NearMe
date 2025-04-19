// index.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/homePage');
  }, []);

  return null;
};

export default Index;
