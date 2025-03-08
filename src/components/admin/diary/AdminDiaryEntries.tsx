
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { DiaryEntry } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash, Plus } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

type DiaryEntryFormData = {
  id?: string;
  title: string;
  content: string;
  shortDescription: string;
  imageSrc: string;
  date: string;
  categoryId: string;
  tagIds: string[];
  moodId: string;
};

const AdminDiaryEntries = () => {
  const { api } = useApi();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [tags, setTags] = useState<{id: string, name: string}[]>([]);
  const [moods, setMoods] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState<DiaryEntryFormData>({
    title: '',
    content: '',
    shortDescription: '',
    imageSrc: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    tagIds: [],
    moodId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesData, categoriesData, tagsData, moodsData] = await Promise.all([
          api.diary.getDiaryEntries(),
          api.diary.getCategories(),
          api.diary.getTags(),
          api.diary.getMoods()
        ]);
        
        setEntries(entriesData);
        setCategories(categoriesData);
        setTags(tagsData);
        setMoods(moodsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить данные. Пожалуйста, попробуйте позже."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    setFormData(prev => ({ ...prev, tagIds: newSelectedTags }));
  };

  const openCreateDialog = () => {
    setFormData({
      title: '',
      content: '',
      shortDescription: '',
      imageSrc: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: categories[0]?.id || '',
      tagIds: [],
      moodId: moods[0]?.id || ''
    });
    setSelectedTags([]);
    setSelectedEntry(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: DiaryEntry) => {
    setFormData({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      shortDescription: entry.shortDescription || '',
      imageSrc: entry.imageSrc || '',
      date: entry.date,
      categoryId: entry.categoryId,
      tagIds: Array.isArray(entry.tagIds) ? entry.tagIds : [],
      moodId: entry.moodId
    });
    setSelectedTags(Array.isArray(entry.tagIds) ? entry.tagIds : []);
    setSelectedEntry(entry.id);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (entryId: string) => {
    setSelectedEntry(entryId);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // This would be an API call in a real application
      toast({
        title: "Изменения сохранены",
        description: selectedEntry 
          ? "Запись дневника успешно обновлена" 
          : "Новая запись дневника успешно создана"
      });
      
      // Mock update entries list
      if (selectedEntry) {
        setEntries(entries.map(entry => 
          entry.id === selectedEntry ? { ...entry, ...formData } : entry
        ));
      } else {
        const newEntry = {
          ...formData,
          id: `entry-${Date.now()}`
        };
        setEntries([...entries, newEntry as DiaryEntry]);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving entry:", error);
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
        title: "Запись удалена",
        description: "Запись дневника успешно удалена"
      });
      
      // Mock update entries list
      setEntries(entries.filter(entry => entry.id !== selectedEntry));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        variant: "destructive",
        title: "Ошибка удаления",
        description: "Не удалось удалить запись. Пожалуйста, попробуйте позже."
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Загрузка данных...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление записями дневника</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить запись
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Записи дневника не найдены
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Настроение</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => {
                const category = categories.find(c => c.id === entry.categoryId);
                const mood = moods.find(m => m.id === entry.moodId);
                
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.title}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{category?.name || 'Нет категории'}</TableCell>
                    <TableCell>{mood?.name || 'Нет настроения'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500" onClick={() => openDeleteDialog(entry.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEntry ? 'Редактировать запись' : 'Добавить новую запись'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Заголовок</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="shortDescription">Краткое описание</label>
              <Input
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="content">Содержание</label>
              <div className="min-h-[300px] border border-input rounded-md">
                <Editor
                  apiKey="no-api-key" // В реальном проекте здесь должен быть ключ API TinyMCE
                  initialValue={formData.content}
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help'
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="imageSrc">URL изображения</label>
              <Input
                id="imageSrc"
                name="imageSrc"
                value={formData.imageSrc}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="date">Дата</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="category">Категория</label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => handleSelectChange('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="mood">Настроение</label>
              <Select 
                value={formData.moodId} 
                onValueChange={(value) => handleSelectChange('moodId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите настроение" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map(mood => (
                    <SelectItem key={mood.id} value={mood.id}>
                      {mood.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label>Теги</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
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
          <p>Вы уверены, что хотите удалить эту запись дневника? Это действие невозможно отменить.</p>
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

export default AdminDiaryEntries;

