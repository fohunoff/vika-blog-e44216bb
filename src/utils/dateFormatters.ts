
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Format date to Russian locale
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ru });
  } catch (e) {
    return dateString;
  }
};
