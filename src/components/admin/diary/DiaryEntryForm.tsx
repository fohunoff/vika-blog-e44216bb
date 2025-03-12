
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DiaryEntryFormData } from "@/types/models";

interface DiaryEntryFormProps {
  formData: DiaryEntryFormData;
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
}

const DiaryEntryForm = ({
  formData,
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
  onMoodSelect
}: DiaryEntryFormProps) => {
  // Добавим отладочную информацию
  console.log("Форма. Выбранные теги:", selectedTags);
  console.log("Форма. Выбранные категории:", selectedCategories);
  console.log("Форма. Выбранные настроения:", selectedMoods);

  useEffect(() => {
    console.log("DiaryEntryForm - formData при загрузке:", formData);
  }, []);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="title">Заголовок</label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="shortDescription">Краткое описание</label>
        <Input
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={onInputChange}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="content">Содержание</label>
        <div className="min-h-[300px] border border-input rounded-md">
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={onEditorChange}
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
          onChange={onInputChange}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="date">Дата</label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.createdAt}
          onChange={onInputChange}
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
              onClick={() => onCategorySelect(category.id)}
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
              onClick={() => onMoodSelect(mood.id)}
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
              onClick={() => onTagSelect(tag.id)}
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
  );
};

export default DiaryEntryForm;
