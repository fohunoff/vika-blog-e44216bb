
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { DiaryCategory } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash, Plus } from "lucide-react";

const AdminDiaryCategories = () => {
  const { api } = useApi();
  const [categories, setCategories] = useState<DiaryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.diary.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить категории. Пожалуйста, попробуйте позже."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [api]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateDialog = () => {
    setFormData({
      id: '',
      name: ''
    });
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: DiaryCategory) => {
    setFormData({
      id: category.id,
      name: category.name
    });
    setSelectedCategory(category.id);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // This would be an API call in a real application
      toast({
        title: "Изменения сохранены",
        description: selectedCategory 
          ? "Категория успешно обновлена" 
          : "Новая категория успешно создана"
      });
      
      // Mock update categories list
      if (selectedCategory) {
        setCategories(categories.map(category => 
          category.id === selectedCategory ? { ...category, name: formData.name } : category
        ));
      } else {
        const newCategory = {
          id: `category-diary-${Date.now()}`,
          name: formData.name
        };
        setCategories([...categories, newCategory]);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Не удалось сохранить изменения. Пожалуйста, попробуйте позже."
      });
    }
  };

  const handleDelete = async () => {
    try {
      // This would be an API call in a real application
      toast({
        title: "Категория удалена",
        description: "Категория успешно удалена"
      });
      
      // Mock update categories list
      setCategories(categories.filter(category => category.id !== selectedCategory));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: "Не удалось удалить категорию. Пожалуйста, попробуйте позже."
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Загрузка данных...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление категориями дневника</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить категорию
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Категории не найдены
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500" onClick={() => openDeleteDialog(category.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Редактировать категорию' : 'Добавить новую категорию'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Название</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить эту категорию? Это действие невозможно отменить.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDiaryCategories;
