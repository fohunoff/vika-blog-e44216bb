
import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import EntryHeader from '@/components/diary/EntryHeader';
import EntryMeta from '@/components/diary/EntryMeta';
import EntryDescription from '@/components/diary/EntryDescription';
import EntryContent from '@/components/diary/EntryContent';
import EntryFooter from '@/components/diary/EntryFooter';
import RelatedEntries from '@/components/diary/RelatedEntries';
import EntryLoading from '@/components/diary/EntryLoading';
import EntryNotFound from '@/components/diary/EntryNotFound';
import { useApi } from '@/hooks/useApi';

const DiaryEntryPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Redirect to diary page if no ID is provided
  if (!id) {
    return <Navigate to="/diary" />;
  }
  
  // Import the SSR data from Next.js page
  // This is a transitional approach - we're getting the pre-rendered HTML from Next.js
  // but still using React Router for navigation
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Add a class to the body to indicate we're in SSR mode
    document.body.classList.add('ssr-mode');
    
    return () => {
      document.body.classList.remove('ssr-mode');
    };
  }, [id]);

  return (
    <MainLayout>
      <div className="blog-container py-8 md:py-16">
        <Link to="/diary" className="inline-flex items-center text-gray-500 hover:text-blog-yellow mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4"/> Назад к дневнику
        </Link>
        
        {/* 
          This is a transitional component that will eventually be replaced
          with fully server-rendered content from Next.js. For now, we're using
          this empty div as a placeholder for the SSR content.
        */}
        <div id="ssr-diary-entry-content">
          <EntryLoading />
        </div>
      </div>
    </MainLayout>
  );
};

export default DiaryEntryPage;
