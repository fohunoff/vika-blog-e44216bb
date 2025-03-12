
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { DiaryEntry } from "@/types/models";

interface DiaryEntryTableProps {
  entries: DiaryEntry[];
  categories: {id: string, name: string}[];
  moods: {id: string, name: string}[];
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (entryId: string) => void;
  displayMultipleNames: (ids: string[] | undefined, items: {id: string, name: string}[]) => string;
}

const DiaryEntryTable = ({
  entries,
  categories,
  moods,
  onEdit,
  onDelete,
  displayMultipleNames
}: DiaryEntryTableProps) => {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Записи дневника не найдены
        </CardContent>
      </Card>
    );
  }

  return (
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
              <TableCell>{entry.createdAt}</TableCell>
              <TableCell>{displayMultipleNames(entry.categoryIds || [entry.categoryId], categories)}</TableCell>
              <TableCell>{displayMultipleNames(entry.moodIds || [entry.moodId], moods)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(entry)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => onDelete(entry.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DiaryEntryTable;
