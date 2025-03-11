
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DiaryEntryTable from "./DiaryEntryTable";
import DiaryEntryDialog from "./DiaryEntryDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useDiaryEntries } from "./useDiaryEntries";

const AdminDiaryEntries = () => {
  const {
    entries,
    categories,
    tags,
    moods,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedEntry,
    selectedTags,
    selectedCategories,
    selectedMoods,
    formData,
    displayMultipleNames,
    handleInputChange,
    handleEditorChange,
    handleTagSelect,
    handleCategorySelect,
    handleMoodSelect,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    handleSave,
    handleDelete
  } = useDiaryEntries();

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

      <DiaryEntryTable 
        entries={entries}
        categories={categories}
        moods={moods}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        displayMultipleNames={displayMultipleNames}
      />

      <DiaryEntryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        selectedEntry={selectedEntry}
        categories={categories}
        tags={tags}
        moods={moods}
        selectedCategories={selectedCategories}
        selectedTags={selectedTags}
        selectedMoods={selectedMoods}
        onInputChange={handleInputChange}
        onEditorChange={handleEditorChange}
        onCategorySelect={handleCategorySelect}
        onTagSelect={handleTagSelect}
        onMoodSelect={handleMoodSelect}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDiaryEntries;
