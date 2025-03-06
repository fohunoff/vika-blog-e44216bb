
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogHeader from "@/components/BlogHeader";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <BlogHeader />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md mx-auto animate-fade-up">
          <div className="mb-6 flex justify-center">
            <AlertTriangle size={80} className="text-blog-yellow" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">404</h1>
          
          <p className="text-xl md:text-2xl font-medium mb-3">Страница не найдена</p>
          
          <p className="text-gray-600 mb-8">
            Запрашиваемая страница не существует или была перемещена.
          </p>
          
          <Link to="/">
            <Button className="bg-blog-yellow hover:bg-blog-yellow-dark text-blog-black">
              <Home size={18} className="mr-2" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
