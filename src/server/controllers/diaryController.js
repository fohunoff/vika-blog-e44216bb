
import { db } from '../db/config.js';

// Импорт файлов с данными для режима без базы данных
import diaryEntries from '../../data/diary.json';
import diaryCategories from '../../data/diary/diary-categories.json';
import diaryTags from '../../data/diary/diary-tags.json';
import diaryMoods from '../../data/diary/diary-moods.json';

/**
 * Получить все записи дневника
 */
export const getAllDiaryEntries = async (req, res) => {
  try {
    // Проверяем, доступна ли база данных
    if (db) {
      db.all('SELECT * FROM diary_entries', [], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(200).json(diaryEntries);
        }
        return res.status(200).json(rows);
      });
    } else {
      // Если базы данных нет, используем локальные данные
      return res.status(200).json(diaryEntries);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json(diaryEntries);
  }
};

/**
 * Получить запись дневника по ID
 */
export const getDiaryEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем, доступна ли база данных
    if (db) {
      db.get('SELECT * FROM diary_entries WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Database error:', err);
          const entry = diaryEntries.find(entry => entry.id === id);
          if (!entry) {
            return res.status(404).json({ message: 'Diary entry not found' });
          }
          return res.status(200).json(entry);
        }
        
        if (!row) {
          return res.status(404).json({ message: 'Diary entry not found' });
        }
        
        return res.status(200).json(row);
      });
    } else {
      // Если базы данных нет, используем локальные данные
      const entry = diaryEntries.find(entry => entry.id === id);
      if (!entry) {
        return res.status(404).json({ message: 'Diary entry not found' });
      }
      return res.status(200).json(entry);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Получить обогащённые записи дневника (с данными о категориях и тегах)
 */
export const getEnrichedDiaryEntries = async (req, res) => {
  try {
    // Проверяем, доступна ли база данных
    if (db) {
      // Здесь можно использовать JOIN запросы для получения связанных данных
      // Но для простоты примера, будем просто получать все записи и обогащать их на стороне сервера
      db.all('SELECT * FROM diary_entries', [], async (err, entries) => {
        if (err) {
          console.error('Database error:', err);
          // Если ошибка, используем локальные данные
          const enrichedEntries = enrichDiaryEntries(diaryEntries);
          return res.status(200).json(enrichedEntries);
        }
        
        try {
          // Получаем все категории и теги из базы
          const categories = await getDataFromDb('SELECT * FROM diary_categories');
          const tags = await getDataFromDb('SELECT * FROM diary_tags');
          const moods = await getDataFromDb('SELECT * FROM diary_moods');
          
          // Обогащаем записи данными о категориях и тегах
          const enrichedEntries = entries.map(entry => {
            const category = categories.find(c => c.id === entry.categoryId);
            const entryTags = entry.tagIds ? 
              entry.tagIds.split(',').map(id => tags.find(t => t.id === id)).filter(Boolean) : 
              [];
            const mood = moods.find(m => m.id === entry.moodId);
            
            return {
              ...entry,
              category: category?.name,
              tags: entryTags.map(t => t?.name),
              mood: mood?.name
            };
          });
          
          return res.status(200).json(enrichedEntries);
        } catch (error) {
          console.error('Error enriching entries:', error);
          // В случае ошибки используем локальные данные
          const enrichedEntries = enrichDiaryEntries(entries);
          return res.status(200).json(enrichedEntries);
        }
      });
    } else {
      // Если базы данных нет, используем локальные данные
      const enrichedEntries = enrichDiaryEntries(diaryEntries);
      return res.status(200).json(enrichedEntries);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Создать новую запись дневника
 */
export const createDiaryEntry = async (req, res) => {
  try {
    console.log('Creating diary entry with data:', req.body);
    
    const { 
      title, 
      content, 
      shortDescription, 
      imageSrc, 
      date, 
      categoryIds, 
      tagIds, 
      moodIds 
    } = req.body;
    
    // Базовая валидация
    if (!title || !content || !date) {
      return res.status(400).json({ message: 'Title, content and date are required' });
    }
    
    // Преобразуем массивы в строки для БД (или используем первый элемент для единичных полей)
    const categoryId = Array.isArray(categoryIds) && categoryIds.length > 0 ? categoryIds[0] : null;
    const moodId = Array.isArray(moodIds) && moodIds.length > 0 ? moodIds[0] : null;
    const tagIdsString = Array.isArray(tagIds) ? tagIds.join(',') : '';
    
    // Генерируем новый ID
    const newId = `diary-entry-${Date.now()}`;
    
    // Формируем новую запись
    const newEntry = {
      id: newId,
      title,
      content,
      shortDescription: shortDescription || '',
      imageSrc: imageSrc || '',
      date,
      categoryId,
      categoryIds,
      tagIds: Array.isArray(tagIds) ? tagIds : [],
      moodId,
      moodIds
    };
    
    // Проверяем, доступна ли база данных
    if (db) {
      const sql = `
        INSERT INTO diary_entries (
          id, title, content, shortDescription, imageSrc, date, 
          categoryId, tagIds, moodId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(sql, [
        newId, title, content, shortDescription || '', imageSrc || '', date,
        categoryId, tagIdsString, moodId
      ], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error creating diary entry', error: err.message });
        }
        
        // Возвращаем созданную запись
        return res.status(201).json(newEntry);
      });
    } else {
      // Если базы данных нет, просто возвращаем созданную запись
      // В реальном приложении здесь можно было бы сохранять в JSON файл
      console.log('Database not available, returning created entry without saving');
      return res.status(201).json(newEntry);
    }
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Обновить запись дневника
 */
export const updateDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating diary entry ${id} with data:`, req.body);
    
    const { 
      title, 
      content, 
      shortDescription, 
      imageSrc, 
      date, 
      categoryIds, 
      tagIds, 
      moodIds 
    } = req.body;
    
    // Базовая валидация
    if (!title || !content || !date) {
      return res.status(400).json({ message: 'Title, content and date are required' });
    }
    
    // Преобразуем массивы в строки для БД (или используем первый элемент для единичных полей)
    const categoryId = Array.isArray(categoryIds) && categoryIds.length > 0 ? categoryIds[0] : null;
    const moodId = Array.isArray(moodIds) && moodIds.length > 0 ? moodIds[0] : null;
    const tagIdsString = Array.isArray(tagIds) ? tagIds.join(',') : '';
    
    // Проверяем, доступна ли база данных
    if (db) {
      // Сначала проверяем, существует ли запись
      db.get('SELECT * FROM diary_entries WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error checking diary entry', error: err.message });
        }
        
        if (!row) {
          return res.status(404).json({ message: 'Diary entry not found' });
        }
        
        // Обновляем запись
        const sql = `
          UPDATE diary_entries SET
            title = ?, content = ?, shortDescription = ?, imageSrc = ?, 
            date = ?, categoryId = ?, tagIds = ?, moodId = ?
          WHERE id = ?
        `;
        
        db.run(sql, [
          title, content, shortDescription || '', imageSrc || '',
          date, categoryId, tagIdsString, moodId, id
        ], function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating diary entry', error: err.message });
          }
          
          // Формируем обновленную запись для ответа
          const updatedEntry = {
            id,
            title,
            content,
            shortDescription: shortDescription || '',
            imageSrc: imageSrc || '',
            date,
            categoryId,
            categoryIds,
            tagIds: Array.isArray(tagIds) ? tagIds : [],
            moodId,
            moodIds
          };
          
          return res.status(200).json(updatedEntry);
        });
      });
    } else {
      // Если базы данных нет, проверяем наличие записи в локальных данных
      const entryIndex = diaryEntries.findIndex(entry => entry.id === id);
      if (entryIndex === -1) {
        return res.status(404).json({ message: 'Diary entry not found' });
      }
      
      // Формируем обновленную запись
      const updatedEntry = {
        id,
        title,
        content,
        shortDescription: shortDescription || '',
        imageSrc: imageSrc || '',
        date,
        categoryId,
        categoryIds,
        tagIds: Array.isArray(tagIds) ? tagIds : [],
        moodId,
        moodIds
      };
      
      // В реальном приложении здесь можно было бы обновлять JSON файл
      console.log('Database not available, returning updated entry without saving');
      return res.status(200).json(updatedEntry);
    }
  } catch (error) {
    console.error('Error updating diary entry:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Удалить запись дневника
 */
export const deleteDiaryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting diary entry ${id}`);
    
    // Проверяем, доступна ли база данных
    if (db) {
      // Сначала проверяем, существует ли запись
      db.get('SELECT * FROM diary_entries WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error checking diary entry', error: err.message });
        }
        
        if (!row) {
          return res.status(404).json({ message: 'Diary entry not found' });
        }
        
        // Удаляем запись
        db.run('DELETE FROM diary_entries WHERE id = ?', [id], function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error deleting diary entry', error: err.message });
          }
          
          return res.status(200).json({ message: 'Diary entry deleted successfully' });
        });
      });
    } else {
      // Если базы данных нет, проверяем наличие записи в локальных данных
      const entryIndex = diaryEntries.findIndex(entry => entry.id === id);
      if (entryIndex === -1) {
        return res.status(404).json({ message: 'Diary entry not found' });
      }
      
      // В реальном приложении здесь можно было бы обновлять JSON файл
      console.log('Database not available, returning success without actual deletion');
      return res.status(200).json({ message: 'Diary entry deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Получить категории дневника
export const getAllDiaryCategories = async (req, res) => {
  try {
    // Проверяем, доступна ли база данных
    if (db) {
      db.all('SELECT * FROM diary_categories', [], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(200).json(diaryCategories);
        }
        return res.status(200).json(rows);
      });
    } else {
      // Если базы данных нет, используем локальные данные
      return res.status(200).json(diaryCategories);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json(diaryCategories);
  }
};

// Получить теги дневника
export const getAllDiaryTags = async (req, res) => {
  try {
    // Проверяем, доступна ли база данных
    if (db) {
      db.all('SELECT * FROM diary_tags', [], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(200).json(diaryTags);
        }
        return res.status(200).json(rows);
      });
    } else {
      // Если базы данных нет, используем локальные данные
      return res.status(200).json(diaryTags);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json(diaryTags);
  }
};

// Получить настроения дневника
export const getAllDiaryMoods = async (req, res) => {
  try {
    // Проверяем, доступна ли база данных
    if (db) {
      db.all('SELECT * FROM diary_moods', [], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(200).json(diaryMoods);
        }
        return res.status(200).json(rows);
      });
    } else {
      // Если базы данных нет, используем локальные данные
      return res.status(200).json(diaryMoods);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json(diaryMoods);
  }
};

// Вспомогательные функции

/**
 * Получить данные из базы данных
 */
const getDataFromDb = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not available'));
      return;
    }
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

/**
 * Обогатить записи дневника данными о категориях и тегах (для локальных данных)
 */
const enrichDiaryEntries = (entries) => {
  return entries.map(entry => {
    const category = diaryCategories.find(c => c.id === entry.categoryId);
    const entryTags = (entry.tagIds || [])
      .map(id => diaryTags.find(t => t.id === id))
      .filter(Boolean);
    const mood = diaryMoods.find(m => m.id === entry.moodId);
    
    return {
      ...entry,
      category: category?.name,
      tags: entryTags.map(t => t?.name),
      mood: mood?.name
    };
  });
};
