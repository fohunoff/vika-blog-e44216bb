
import { db } from '../db/init.js';

// Get all cafes
export const getCafes = async (req, res) => {
  try {
    const cafes = await db.all('SELECT * FROM cafes');
    res.json(cafes);
  } catch (error) {
    console.error('Error fetching cafes:', error);
    res.status(500).json({ message: 'Failed to fetch cafes' });
  }
};

// Get a single cafe by ID
export const getCafeById = async (req, res) => {
  try {
    const { id } = req.params;
    const cafe = await db.get('SELECT * FROM cafes WHERE id = ?', [id]);
    
    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    
    res.json(cafe);
  } catch (error) {
    console.error('Error fetching cafe:', error);
    res.status(500).json({ message: 'Failed to fetch cafe' });
  }
};

// Create a new cafe
export const createCafe = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      shortDescription, 
      imageSrc, 
      location, 
      openHours, 
      priceRange, 
      rating, 
      categoryIds, 
      tagIds, 
      website, 
      phone, 
      address 
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !location || !priceRange || !rating) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    
    // Convert arrays to JSON strings for storage
    const categoryIdsString = JSON.stringify(categoryIds || []);
    const tagIdsString = JSON.stringify(tagIds || []);
    
    const result = await db.run(
      `INSERT INTO cafes (
        id, name, description, shortDescription, imageSrc, location, 
        openHours, priceRange, rating, categoryIds, tagIds, website, phone, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        // Generate a simple ID based on name
        name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description,
        shortDescription || '',
        imageSrc || '',
        location,
        openHours || '',
        priceRange,
        rating,
        categoryIdsString,
        tagIdsString,
        website || '',
        phone || '',
        address || ''
      ]
    );
    
    res.status(201).json({ 
      message: 'Cafe created successfully', 
      id: name.toLowerCase().replace(/\s+/g, '-')
    });
  } catch (error) {
    console.error('Error creating cafe:', error);
    res.status(500).json({ message: 'Failed to create cafe' });
  }
};

// Update an existing cafe
export const updateCafe = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      shortDescription, 
      imageSrc, 
      location, 
      openHours, 
      priceRange, 
      rating, 
      categoryIds, 
      tagIds, 
      website, 
      phone, 
      address 
    } = req.body;
    
    // Check if cafe exists
    const existingCafe = await db.get('SELECT * FROM cafes WHERE id = ?', [id]);
    if (!existingCafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    
    // Convert arrays to JSON strings for storage
    const categoryIdsString = categoryIds ? JSON.stringify(categoryIds) : existingCafe.categoryIds;
    const tagIdsString = tagIds ? JSON.stringify(tagIds) : existingCafe.tagIds;
    
    await db.run(
      `UPDATE cafes SET 
        name = ?, 
        description = ?, 
        shortDescription = ?, 
        imageSrc = ?, 
        location = ?, 
        openHours = ?, 
        priceRange = ?, 
        rating = ?, 
        categoryIds = ?, 
        tagIds = ?, 
        website = ?, 
        phone = ?, 
        address = ?
      WHERE id = ?`,
      [
        name || existingCafe.name,
        description || existingCafe.description,
        shortDescription !== undefined ? shortDescription : existingCafe.shortDescription,
        imageSrc || existingCafe.imageSrc,
        location || existingCafe.location,
        openHours !== undefined ? openHours : existingCafe.openHours,
        priceRange || existingCafe.priceRange,
        rating || existingCafe.rating,
        categoryIdsString,
        tagIdsString,
        website !== undefined ? website : existingCafe.website,
        phone !== undefined ? phone : existingCafe.phone,
        address !== undefined ? address : existingCafe.address,
        id
      ]
    );
    
    res.json({ message: 'Cafe updated successfully' });
  } catch (error) {
    console.error('Error updating cafe:', error);
    res.status(500).json({ message: 'Failed to update cafe' });
  }
};

// Delete a cafe
export const deleteCafe = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if cafe exists
    const existingCafe = await db.get('SELECT * FROM cafes WHERE id = ?', [id]);
    if (!existingCafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    
    await db.run('DELETE FROM cafes WHERE id = ?', [id]);
    res.json({ message: 'Cafe deleted successfully' });
  } catch (error) {
    console.error('Error deleting cafe:', error);
    res.status(500).json({ message: 'Failed to delete cafe' });
  }
};

// Get all cafe categories
export const getCafeCategories = async (req, res) => {
  try {
    const categories = await db.all('SELECT * FROM cafe_categories');
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
    const category = await db.get('SELECT * FROM cafe_categories WHERE id = ?', [id]);
    
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
    const tags = await db.all('SELECT * FROM cafe_tags');
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
    const tag = await db.get('SELECT * FROM cafe_tags WHERE id = ?', [id]);
    
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
    const tags = await db.all(`SELECT * FROM cafe_tags WHERE id IN (${placeholders})`, ids);
    
    res.json(tags);
  } catch (error) {
    console.error('Error fetching cafe tags by IDs:', error);
    res.status(500).json({ message: 'Failed to fetch cafe tags' });
  }
};

// Get all cafe price ranges
export const getCafePriceRanges = async (req, res) => {
  try {
    const priceRanges = await db.all('SELECT * FROM cafe_price_ranges');
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
    const priceRange = await db.get('SELECT * FROM cafe_price_ranges WHERE id = ?', [id]);
    
    if (!priceRange) {
      return res.status(404).json({ message: 'Price range not found' });
    }
    
    res.json(priceRange);
  } catch (error) {
    console.error('Error fetching cafe price range:', error);
    res.status(500).json({ message: 'Failed to fetch cafe price range' });
  }
};

// Get enriched cafes with category and tag names
export const getEnrichedCafes = async (req, res) => {
  try {
    // Get all cafes
    const cafes = await db.all('SELECT * FROM cafes');
    // Get all categories and tags
    const categories = await db.all('SELECT * FROM cafe_categories');
    const tags = await db.all('SELECT * FROM cafe_tags');
    
    // Enrich cafes with category and tag names
    const enrichedCafes = cafes.map(cafe => {
      let cafeCategories = [];
      let cafeTags = [];
      
      try {
        // Parse category IDs and tag IDs (stored as JSON strings)
        const categoryIds = JSON.parse(cafe.categoryIds || '[]');
        const tagIds = JSON.parse(cafe.tagIds || '[]');
        
        // Map IDs to names
        cafeCategories = categoryIds
          .map(id => categories.find(c => c.id === id)?.name)
          .filter(Boolean);
          
        cafeTags = tagIds
          .map(id => tags.find(t => t.id === id)?.name)
          .filter(Boolean);
      } catch (error) {
        console.error('Error parsing cafe IDs:', error);
      }
      
      return {
        ...cafe,
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
