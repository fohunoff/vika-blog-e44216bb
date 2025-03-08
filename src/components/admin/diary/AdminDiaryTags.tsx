
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { DiaryTag } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash, Plus } from "lucide-react";

const AdminDiaryTags = () => {
  const { api } = useApi();
  const [tags, setTags] = useState<DiaryTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await api.diary.getTags();
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить теги. Пожалуйста, попробуйте позже."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
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
    setSelectedTag(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (tag: DiaryTag) => {
    setFormData({
      id: tag.id,
      name: tag.name
    });
    setSelectedTag(tag.id);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (tagId: string) => {
    setSelectedTag(tagId);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // This would be an API call in a real application
      toast({
        title: "Изменения сохранены",
        description: selectedTag 
          ? "Тег успешно обновлен" 
          : "Новый тег успешно создан"
      });
      
      // Mock update tags list
      if (selectedTag) {
        setTags(tags.map(tag => 
          tag.id === selectedTag ? { ...tag, name: formData.name } : tag
        ));
      } else {
        const newTag = {
          id: `tag-diary-${Date.now()}`,
          name: formData.name
        };
        setTags([...tags, newTag]);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving tag:", error);
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
        title: "Тег удален",
        description: "Тег успешно удален"
      });
      
      // Mock update tags list
      setTags(tags.filter(tag => tag.id !== selectedTag));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: "Не удалось удалить тег. Пожалуйста, попробуйте позже."
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Загрузка данных...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление тегами дневника</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить тег
        </Button>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Теги не найдены
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
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(tag)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500" onClick={() => openDeleteDialog(tag.id)}>
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
              {selectedTag ? 'Редактировать тег' : 'Добавить новый тег'}
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
          <p>Вы уверены, что хотите удалить этот тег? Это действие невозможно отменить.</p>
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

export default AdminDiaryTags;
