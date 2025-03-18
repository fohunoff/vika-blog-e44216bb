
import { ReactNode } from 'react';
import BlogHeader from '../BlogHeader';
import Footer from '../Footer';

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
