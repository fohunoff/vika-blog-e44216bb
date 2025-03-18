
import { Skeleton } from "@/components/ui/skeleton";
import BlogHeader from '../BlogHeader';
import Footer from '../Footer';

const EntryLoading = () => {
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      <div className="blog-container max-w-4xl mx-auto px-4 py-16">
        {/* Back button skeleton */}
        <Skeleton className="h-8 w-32 mb-8" />
        
        {/* Image skeleton */}
        <Skeleton className="w-full h-[300px] md:h-[500px] rounded-xl mb-8" />
        
        {/* Title skeleton */}
        <Skeleton className="h-12 w-3/4 mb-6" />
        
        {/* Meta information skeleton */}
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        {/* Content skeleton - paragraphs */}
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-4/5 mb-8" />
        
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        
        {/* Related entries section skeleton */}
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default EntryLoading;
