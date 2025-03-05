
import http from 'http';

// Mock data for our API
const recipes = [
  {
    id: '1',
    title: 'Паста Карбонара',
    description: 'Классическая итальянская паста с беконом и сливочным соусом',
    category: { id: '1', name: 'pasta', displayName: 'Паста' },
    time: '30 минут',
    difficulty: 'Легко',
    imageSrc: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    tags: [{ id: '1', name: 'Итальянская кухня' }, { id: '2', name: 'Быстрые рецепты' }]
  },
  {
    id: '2',
    title: 'Борщ',
    description: 'Традиционный украинский борщ со свежей зеленью и сметаной',
    category: { id: '2', name: 'soups', displayName: 'Супы' },
    time: '1 час 30 минут',
    difficulty: 'Средне',
    imageSrc: 'https://images.unsplash.com/photo-1584949602334-4e99f98286a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    tags: [{ id: '3', name: 'Русская кухня' }, { id: '4', name: 'Первые блюда' }]
  },
  {
    id: '3',
    title: 'Шоколадный брауни',
    description: 'Влажный шоколадный брауни с орехами и карамелью',
    category: { id: '3', name: 'desserts', displayName: 'Десерты' },
    time: '45 минут',
    difficulty: 'Легко',
    imageSrc: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    tags: [{ id: '5', name: 'Выпечка' }, { id: '6', name: 'Сладости' }]
  }
];

const categories = [
  { id: '1', name: 'pasta', displayName: 'Паста' },
  { id: '2', name: 'soups', displayName: 'Супы' },
  { id: '3', name: 'desserts', displayName: 'Десерты' },
  { id: '4', name: 'salads', displayName: 'Салаты' },
  { id: '5', name: 'breakfast', displayName: 'Завтраки' }
];

const tags = [
  { id: '1', name: 'Итальянская кухня' },
  { id: '2', name: 'Быстрые рецепты' },
  { id: '3', name: 'Русская кухня' },
  { id: '4', name: 'Первые блюда' },
  { id: '5', name: 'Выпечка' },
  { id: '6', name: 'Сладости' },
  { id: '7', name: 'Веганские блюда' },
  { id: '8', name: 'Низкокалорийные' }
];

// Helper to filter recipes by category and/or search query
function filterRecipes(categoryId, search) {
  return recipes.filter(recipe => {
    const matchesCategory = categoryId ? recipe.category.id === categoryId : true;
    const matchesSearch = search 
      ? recipe.title.toLowerCase().includes(search.toLowerCase()) || 
        recipe.description.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });
}

// Create a server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API routes
  if (pathname === '/api/recipes' && req.method === 'GET') {
    const categoryId = url.searchParams.get('categoryId');
    const search = url.searchParams.get('search');
    const filteredRecipes = filterRecipes(categoryId, search);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filteredRecipes));
  } 
  else if (pathname === '/api/recipes/categories' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(categories));
  } 
  else if (pathname === '/api/recipes/tags' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tags));
  }
  else if (pathname.match(/^\/api\/recipes\/\w+$/) && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const recipe = recipes.find(r => r.id === id);
    
    if (recipe) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(recipe));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Recipe not found' }));
    }
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
