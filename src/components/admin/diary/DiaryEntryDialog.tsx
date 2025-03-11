
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { DiaryEntryFormData } from "@/types/models";
import DiaryEntryForm from "./DiaryEntryForm";

interface DiaryEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: DiaryEntryFormData;
  selectedEntry: string | null;
  categories: {id: string, name: string}[];
  tags: {id: string, name: string}[];
  moods: {id: string, name: string}[];
  selectedCategories: string[];
  selectedTags: string[];
  selectedMoods: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEditorChange: (content: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onTagSelect: (tagId: string) => void;
  onMoodSelect: (moodId: string) => void;
  onSave: () => void;
}

const DiaryEntryDialog = ({
  isOpen,
  onOpenChange,
  formData,
  selectedEntry,
  categories,
  tags,
  moods,
  selectedCategories,
  selectedTags,
  selectedMoods,
  onInputChange,
  onEditorChange,
  onCategorySelect,
  onTagSelect,
  onMoodSelect,
  onSave
}: DiaryEntryDialogProps) => {
  // Добавим отладочную информацию
  console.log("DiaryEntryDialog - formData перед рендерингом:", formData);
  console.log("DiaryEntryDialog - selectedTags:", selectedTags);
  console.log("DiaryEntryDialog - selectedCategories:", selectedCategories);
  console.log("DiaryEntryDialog - selectedMoods:", selectedMoods);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedEntry ? 'Редактировать запись' : 'Добавить новую запись'}
          </DialogTitle>
        </DialogHeader>
        
        <DiaryEntryForm 
          formData={formData}
          categories={categories}
          tags={tags}
          moods={moods}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          selectedMoods={selectedMoods}
          onInputChange={onInputChange}
          onEditorChange={onEditorChange}
          onCategorySelect={onCategorySelect}
          onTagSelect={onTagSelect}
          onMoodSelect={onMoodSelect}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={() => {
            // Добавим последний вывод для отладки перед сохранением
            console.log("Данные перед отправкой на сервер:", formData);
            onSave();
          }}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiaryEntryDialog;
