
import { useFetchDiaryData } from "./hooks/useFetchDiaryData";
import { useEntryStateUpdates } from "./hooks/useEntryStateUpdates";
import { useDiaryMutations } from "./hooks/useDiaryMutations";

export const useApiOperations = (
  setIsDialogOpen: (isOpen: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setState?: (state: any) => void
) => {
  const {
    entries,
    setEntries,
    categories,
    tags,
    moods,
    isLoading,
    fetchData
  } = useFetchDiaryData();

  const {
    updateEntriesList,
    updateDialogState
  } = useEntryStateUpdates(setEntries, setState);

  const {
    createEntry,
    updateEntry,
    deleteEntry
  } = useDiaryMutations(
    updateEntriesList,
    updateDialogState,
    fetchData,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setEntries
  );

  return {
    entries,
    categories,
    tags,
    moods,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    fetchData
  };
};
