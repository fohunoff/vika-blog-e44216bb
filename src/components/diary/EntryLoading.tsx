
import BlogHeader from '../BlogHeader';
import Footer from '../Footer';

const EntryLoading = () => {
  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      <div className="blog-container py-16 text-center">
        <p>Загрузка записи...</p>
      </div>
      <Footer />
    </main>
  );
};

export default EntryLoading;
