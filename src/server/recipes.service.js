
// Mock data for recipes
const recipes = [
  {
    id: 'pumpkin-soup',
    title: 'Тыквенный суп-пюре с имбирем',
    description: 'Нежный, согревающий суп с ароматом осенних специй и ноткой имбиря.',
    content: 'Тыквенный суп-пюре — идеальное блюдо для холодных осенних дней. Имбирь придает ему пикантность, а кокосовое молоко — нежность и шелковистость.',
    category: {
      id: 'soups',
      name: 'soups',
      displayName: 'Супы'
    },
    time: '30 минут',
    difficulty: 'Легко',
    imageSrc: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=2574',
    servings: 4,
    tags: [
      { id: 'autumn', name: 'осень' },
      { id: 'pumpkin', name: 'тыква' },
      { id: 'soup', name: 'суп' }
    ]
  },
  {
    id: 'apple-pie',
    title: 'Яблочный пирог с корицей',
    description: 'Классический яблочный пирог с ароматной корицей и хрустящей корочкой.',
    content: 'Яблочный пирог — классика домашней выпечки. Сочная начинка из яблок с корицей под хрустящей корочкой никого не оставит равнодушным.',
    category: {
      id: 'desserts',
      name: 'desserts',
      displayName: 'Десерты'
    },
    time: '60 минут',
    difficulty: 'Средне',
    imageSrc: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?auto=format&fit=crop&q=80&w=2574',
    servings: 8,
    tags: [
      { id: 'apple', name: 'яблоки' },
      { id: 'pie', name: 'выпечка' },
      { id: 'dessert', name: 'десерт' }
    ]
  },
  {
    id: 'pasta-carbonara',
    title: 'Паста Карбонара',
    description: 'Классическая итальянская паста с беконом, яйцом и сыром Пармезан.',
    content: 'Паста Карбонара — одно из самых известных блюд итальянской кухни. Секрет идеальной карбонары в качественных ингредиентах и точном соблюдении технологии приготовления.',
    category: {
      id: 'pasta',
      name: 'pasta',
      displayName: 'Паста'
    },
    time: '20 минут',
    difficulty: 'Средне',
    imageSrc: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=2574',
    servings: 2,
    tags: [
      { id: 'pasta', name: 'паста' },
      { id: 'italian', name: 'итальянская кухня' },
      { id: 'bacon', name: 'бекон' }
    ]
  },
  {
    id: 'berry-smoothie',
    title: 'Ягодный смузи',
    description: 'Освежающий смузи из сезонных ягод с добавлением йогурта и меда.',
    content: 'Ягодный смузи — отличный способ зарядиться витаминами в любое время года. Используйте свежие или замороженные ягоды по вашему вкусу.',
    category: {
      id: 'drinks',
      name: 'drinks',
      displayName: 'Напитки'
    },
    time: '10 минут',
    difficulty: 'Легко',
    imageSrc: 'https://images.unsplash.com/photo-1553530979-31b9d820532f?auto=format&fit=crop&q=80&w=2574',
    servings: 2,
    tags: [
      { id: 'berries', name: 'ягоды' },
      { id: 'smoothie', name: 'смузи' },
      { id: 'breakfast', name: 'завтрак' }
    ]
  }
];

// List of categories
const categories = [
  { id: 'soups', name: 'soups', displayName: 'Супы' },
  { id: 'main', name: 'main', displayName: 'Основные блюда' },
  { id: 'salads', name: 'salads', displayName: 'Салаты' },
  { id: 'desserts', name: 'desserts', displayName: 'Десерты' },
  { id: 'drinks', name: 'drinks', displayName: 'Напитки' },
  { id: 'pasta', name: 'pasta', displayName: 'Паста' }
];

// List of tags
const tags = [
  { id: 'autumn', name: 'осень' },
  { id: 'pumpkin', name: 'тыква' },
  { id: 'soup', name: 'суп' },
  { id: 'apple', name: 'яблоки' },
  { id: 'pie', name: 'выпечка' },
  { id: 'dessert', name: 'десерт' },
  { id: 'pasta', name: 'паста' },
  { id: 'italian', name: 'итальянская кухня' },
  { id: 'bacon', name: 'бекон' },
  { id: 'berries', name: 'ягоды' },
  { id: 'smoothie', name: 'смузи' },
  { id: 'breakfast', name: 'завтрак' }
];

// Get all recipes with optional filters
const getAllRecipes = (categoryId = null, searchQuery = null) => {
  let filteredRecipes = [...recipes];
  
  if (categoryId) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.category.id === categoryId);
  }
  
  if (searchQuery) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return filteredRecipes;
};

// Get a recipe by ID
const getRecipeById = (id) => {
  return recipes.find(recipe => recipe.id === id);
};

// Get all categories
const getAllCategories = () => {
  return categories;
};

// Get all tags
const getAllTags = () => {
  return tags;
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  getAllCategories,
  getAllTags
};
