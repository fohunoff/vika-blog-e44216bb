import { dbAsync } from '../db/config.js';

// Get all cafes
export const getCafes = async (req, res) => {
  try {
    const cafes = await dbAsync.all('SELECT * FROM cafes');

    // Преобразуем JSON строки в массивы для совместимости с фронтендом
    const processedCafes = cafes.map(cafe => ({
      ...cafe,
      categoryIds: tryParseJson(cafe.categoryIds, []),
      tagIds: tryParseJson(cafe.tagIds, [])
    }));

    res.json(processedCafes);
  } catch (error) {
    console.error('Error fetching cafes:', error);
    res.status(500).json({ message: 'Failed to fetch cafes' });
  }
};

// Get a single cafe by ID
export const getCafeById = async (req, res) => {
  try {
    const { id } = req.params;
    const cafe = await dbAsync.get('SELECT * FROM cafes WHERE id = ?', [id]);

    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }

    // Преобразуем JSON строки в массивы
    const processedCafe = {
      ...cafe,
      categoryIds: tryParseJson(cafe.categoryIds, []),
      tagIds: tryParseJson(cafe.tagIds, [])
    };

    res.json(processedCafe);
  } catch (error) {
    console.error('Error fetching cafe:', error);
    res.status(500).json({ message: 'Failed to fetch cafe' });
  }
};

// Вспомогательная функция для безопасного парсинга JSON
function tryParseJson(jsonString, defaultValue = null) {
  if (!jsonString) return defaultValue;

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn('Error parsing JSON string:', e);
    return defaultValue;
  }
}

// Get enriched cafes with category and tag names
export const getEnrichedCafes = async (req, res) => {
  try {
    // Get all cafes
    const cafes = await dbAsync.all('SELECT * FROM cafes');

    // Get all categories and tags
    const categories = await dbAsync.all('SELECT * FROM cafe_categories');
    const tags = await dbAsync.all('SELECT * FROM cafe_tags');

    // Enrich cafes with category and tag names
    const enrichedCafes = cafes.map(cafe => {
      let cafeCategories = [];
      let cafeTags = [];

      try {
        // Parse category IDs and tag IDs (stored as JSON strings)
        const categoryIds = tryParseJson(cafe.categoryIds, []);
        const tagIds = tryParseJson(cafe.tagIds, []);

        // Map IDs to names
        cafeCategories = categoryIds
            .map(id => {
              const category = categories.find(c => c.id === id);
              return category ? category.name : null;
            })
            .filter(Boolean);

        cafeTags = tagIds
            .map(id => {
              const tag = tags.find(t => t.id === id);
              return tag ? tag.name : null;
            })
            .filter(Boolean);
      } catch (error) {
        console.error('Error parsing cafe IDs:', error);
      }

      return {
        ...cafe,
        // Преобразуем JSON строки в массивы
        categoryIds: tryParseJson(cafe.categoryIds, []),
        tagIds: tryParseJson(cafe.tagIds, []),
        // Добавляем имена категорий и тегов
        categories: cafeCategories,
        tags: cafeTags
      };
    });

    res.json(enrichedCafes);
  } catch (error) {
    console.error('Error fetching enriched cafes:', error);
    res.status(500).json({ message: 'Failed to fetch enriched cafes' });
  }
};

// Остальные функции контроллера...
export const createCafe = async (req, res) => {
  // ... (без изменений)
};

export const updateCafe = async (req, res) => {
  // ... (без изменений)
};

export const deleteCafe = async (req, res) => {
  // ... (без изменений)
};

// Get all cafe categories
export const getCafeCategories = async (req, res) => {
  try {
    const categories = await dbAsync.all('SELECT * FROM cafe_categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching cafe categories:', error);
    res.status(500).json({ message: 'Failed to fetch cafe categories' });
  }
};

// Get a single cafe category by ID
export const getCafeCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await dbAsync.get('SELECT * FROM cafe_categories WHERE id = ?', [id]);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching cafe category:', error);
    res.status(500).json({ message: 'Failed to fetch cafe category' });
  }
};

// Get all cafe tags
export const getCafeTags = async (req, res) => {
  try {
    const tags = await dbAsync.all('SELECT * FROM cafe_tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching cafe tags:', error);
    res.status(500).json({ message: 'Failed to fetch cafe tags' });
  }
};

// Get a single cafe tag by ID
export const getCafeTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await dbAsync.get('SELECT * FROM cafe_tags WHERE id = ?', [id]);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Error fetching cafe tag:', error);
    res.status(500).json({ message: 'Failed to fetch cafe tag' });
  }
};

// Get cafe tags by IDs
export const getCafeTagsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Valid tag IDs array required' });
    }

    // Create placeholders for SQL query (?, ?, ...)
    const placeholders = ids.map(() => '?').join(',');
    const tags = await dbAsync.all(`SELECT * FROM cafe_tags WHERE id IN (${placeholders})`, ids);

    res.json(tags);
  } catch (error) {
    console.error('Error fetching cafe tags by IDs:', error);
    res.status(500).json({ message: 'Failed to fetch cafe tags' });
  }
};

// Get all cafe price ranges
export const getCafePriceRanges = async (req, res) => {
  try {
    const priceRanges = await dbAsync.all('SELECT * FROM cafe_price_ranges');
    res.json(priceRanges);
  } catch (error) {
    console.error('Error fetching cafe price ranges:', error);
    res.status(500).json({ message: 'Failed to fetch cafe price ranges' });
  }
};

// Get a single cafe price range by ID
export const getCafePriceRangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const priceRange = await dbAsync.get('SELECT * FROM cafe_price_ranges WHERE id = ?', [id]);

    if (!priceRange) {
      return res.status(404).json({ message: 'Price range not found' });
    }

    res.json(priceRange);
  } catch (error) {
    console.error('Error fetching cafe price range:', error);
    res.status(500).json({ message: 'Failed to fetch cafe price range' });
  }
};
