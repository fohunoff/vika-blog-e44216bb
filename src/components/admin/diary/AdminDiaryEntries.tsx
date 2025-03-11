
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
import { Edit, Trash, Plus, Check } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type DiaryEntryFormData = {
  id?: string;
  title: string;
  content: string;
  shortDescription: string;
  imageSrc: string;
  date: string;
  categoryIds: string[]; // Changed from categoryId to categoryIds
  tagIds: string[];
  moodIds: string[]; // Changed from moodId to moodIds
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [formData, setFormData] = useState<DiaryEntryFormData>({
    title: '',
    content: '',
    shortDescription: '',
    imageSrc: '',
    date: new Date().toISOString().split('T')[0],
    categoryIds: [],
    tagIds: [],
    moodIds: []
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
        
        // Convert single categoryId and moodId to arrays for existing entries
        const updatedEntries = entriesData.map(entry => ({
          ...entry,
          categoryIds: entry.categoryIds || [entry.categoryId],
          moodIds: entry.moodIds || [entry.moodId]
        }));
        
        setEntries(updatedEntries);
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

  const handleTagSelect = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    setFormData(prev => ({ ...prev, tagIds: newSelectedTags }));
  };

  const handleCategorySelect = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
    setFormData(prev => ({ ...prev, categoryIds: newSelectedCategories }));
  };

  const handleMoodSelect = (moodId: string) => {
    const newSelectedMoods = selectedMoods.includes(moodId)
      ? selectedMoods.filter(id => id !== moodId)
      : [...selectedMoods, moodId];
    
    setSelectedMoods(newSelectedMoods);
    setFormData(prev => ({ ...prev, moodIds: newSelectedMoods }));
  };

  const openCreateDialog = () => {
    setFormData({
      title: '',
      content: '',
      shortDescription: '',
      imageSrc: '',
      date: new Date().toISOString().split('T')[0],
      categoryIds: [],
      tagIds: [],
      moodIds: []
    });
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedMoods([]);
    setSelectedEntry(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: DiaryEntry) => {
    // Convert single categoryId and moodId to arrays if needed
    const categoryIds = Array.isArray(entry.categoryIds) ? entry.categoryIds : [entry.categoryId];
    const moodIds = Array.isArray(entry.moodIds) ? entry.moodIds : [entry.moodId];
    
    setFormData({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      shortDescription: entry.shortDescription || '',
      imageSrc: entry.imageSrc || '',
      date: entry.date,
      categoryIds: categoryIds,
      tagIds: Array.isArray(entry.tagIds) ? entry.tagIds : [],
      moodIds: moodIds
    });
    setSelectedTags(Array.isArray(entry.tagIds) ? entry.tagIds : []);
    setSelectedCategories(categoryIds);
    setSelectedMoods(moodIds);
    setSelectedEntry(entry.id);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (entryId: string) => {
    setSelectedEntry(entryId);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      toast({
        title: "Изменения сохранены",
        description: selectedEntry 
          ? "Запись дневника успешно обновлена" 
          : "Новая запись дневника успешно создана"
      });
      
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
      toast({
        title: "Запись удалена",
        description: "Запись дневника успешно удалена"
      });
      
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

  // Helper function to display comma-separated names for multi-select fields
  const displayMultipleNames = (ids: string[] | undefined, items: {id: string, name: string}[]) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return 'Не выбрано';
    
    return ids
      .map(id => items.find(item => item.id === id)?.name)
      .filter(Boolean)
      .join(', ');
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
                <TableHead>Категории</TableHead>
                <TableHead>Настроения</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{displayMultipleNames(entry.categoryIds || [entry.categoryId], categories)}</TableCell>
                  <TableCell>{displayMultipleNames(entry.moodIds || [entry.moodId], moods)}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleEditorChange}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                  style={{ height: '250px' }}
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
              <label>Категории</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategorySelect(category.id)}
                    className="flex items-center"
                  >
                    {selectedCategories.includes(category.id) && (
                      <Check className="mr-1 h-3 w-3" />
                    )}
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <label>Настроения</label>
              <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                  <Button
                    key={mood.id}
                    type="button"
                    variant={selectedMoods.includes(mood.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMoodSelect(mood.id)}
                    className="flex items-center"
                  >
                    {selectedMoods.includes(mood.id) && (
                      <Check className="mr-1 h-3 w-3" />
                    )}
                    {mood.name}
                  </Button>
                ))}
              </div>
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
                    className="flex items-center"
                  >
                    {selectedTags.includes(tag.id) && (
                      <Check className="mr-1 h-3 w-3" />
                    )}
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
