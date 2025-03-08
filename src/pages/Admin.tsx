
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminDiaryEntries from "@/components/admin/diary/AdminDiaryEntries";
import AdminDiaryCategories from "@/components/admin/diary/AdminDiaryCategories";
import AdminDiaryTags from "@/components/admin/diary/AdminDiaryTags";
import AdminDiaryMoods from "@/components/admin/diary/AdminDiaryMoods";
import { LogOut } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in via localStorage (simplified auth)
    const adminAuth = localStorage.getItem('admin-auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="entries" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="entries">Записи дневника</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="tags">Теги</TabsTrigger>
            <TabsTrigger value="moods">Настроения</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries">
            <AdminDiaryEntries />
          </TabsContent>
          
          <TabsContent value="categories">
            <AdminDiaryCategories />
          </TabsContent>
          
          <TabsContent value="tags">
            <AdminDiaryTags />
          </TabsContent>
          
          <TabsContent value="moods">
            <AdminDiaryMoods />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
