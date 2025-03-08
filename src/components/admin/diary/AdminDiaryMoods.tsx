
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { DiaryMood } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash, Plus } from "lucide-react";

const AdminDiaryMoods = () => {
  const { api } = useApi();
  const [moods, setMoods] = useState<DiaryMood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const moodsData = await api.diary.getMoods();
        setMoods(moodsData);
      } catch (error) {
        console.error("Error fetching moods:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить настроения. Пожалуйста, попробуйте позже."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoods();
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
    setSelectedMood(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (mood: DiaryMood) => {
    setFormData({
      id: mood.id,
      name: mood.name
    });
    setSelectedMood(mood.id);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (moodId: string) => {
    setSelectedMood(moodId);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // This would be an API call in a real application
      toast({
        title: "Изменения сохранены",
        description: selectedMood 
          ? "Настроение успешно обновлено" 
          : "Новое настроение успешно создано"
      });
      
      // Mock update moods list
      if (selectedMood) {
        setMoods(moods.map(mood => 
          mood.id === selectedMood ? { ...mood, name: formData.name } : mood
        ));
      } else {
        const newMood = {
          id: `mood-${Date.now()}`,
          name: formData.name
        };
        setMoods([...moods, newMood]);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving mood:", error);
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
        title: "Настроение удалено",
        description: "Настроение успешно удалено"
      });
      
      // Mock update moods list
      setMoods(moods.filter(mood => mood.id !== selectedMood));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting mood:", error);
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: "Не удалось удалить настроение. Пожалуйста, попробуйте позже."
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Загрузка данных...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление настроениями дневника</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить настроение
        </Button>
      </div>

      {moods.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Настроения не найдены
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
              {moods.map((mood) => (
                <TableRow key={mood.id}>
                  <TableCell className="font-medium">{mood.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(mood)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500" onClick={() => openDeleteDialog(mood.id)}>
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
              {selectedMood ? 'Редактировать настроение' : 'Добавить новое настроение'}
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
          <p>Вы уверены, что хотите удалить это настроение? Это действие невозможно отменить.</p>
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

export default AdminDiaryMoods;
