
import { ReactNode } from 'react';
import BlogHeader from '@/nextjs-migration/components/BlogHeader';
import Footer from '@/nextjs-migration/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className = '' }: MainLayoutProps) => {
  return (
    <main className={`min-h-screen pt-24 ${className}`}>
      <BlogHeader />
      {children}
      <Footer />
    </main>
  );
};

export default MainLayout;
