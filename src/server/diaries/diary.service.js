
// Mock data for diary entries
const diaryEntries = [
  {
    id: 'autumn-thoughts',
    title: 'Осенние размышления',
    date: '15 октября 2023',
    content: 'Сегодня я гуляла по парку и наблюдала, как желтеют листья. Осень всегда навевает на меня особое настроение — смесь меланхолии и умиротворения. Решила начать новую книгу и заварить любимый чай с корицей.',
    mood: 'Умиротворение',
    tags: ['осень', 'книги', 'прогулки'],
    imageSrc: 'https://images.unsplash.com/photo-1506202687253-52e1b29d3527?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'new-recipe',
    title: 'Эксперименты на кухне',
    date: '2 ноября 2023',
    content: 'Пробовала приготовить новый рецепт тыквенного пирога. Добавила немного имбиря и корицы — получилось восхитительно! Домашние оценили, особенно с чашкой горячего какао.',
    mood: 'Вдохновение',
    tags: ['кулинария', 'эксперименты', 'осенние рецепты'],
    imageSrc: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'weekend-plans',
    title: 'Планы на выходные',
    date: '10 ноября 2023',
    content: 'Составила список дел на предстоящие выходные: посетить новую выставку в галерее, встретиться с друзьями в том уютном кафе на углу и закончить вязать шарф, который начала еще месяц назад.',
    mood: 'Предвкушение',
    tags: ['планы', 'хобби', 'друзья'],
    imageSrc: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'winter-coming',
    title: 'Приближение зимы',
    date: '28 ноября 2023',
    content: 'Сегодня выпал первый снег. Я люблю это волшебное время, когда природа замирает в ожидании зимы. Достала теплые свитера и решила, что пора обновить зимний гардероб.',
    mood: 'Ностальгия',
    tags: ['зима', 'погода', 'уют'],
    imageSrc: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'morning-rituals',
    title: 'Утренние ритуалы',
    date: '5 декабря 2023',
    content: 'Начала практиковать новый утренний ритуал - вставать на 30 минут раньше, чтобы выпить чашку чая в тишине и помедитировать. Всего неделя, а уже чувствую себя более сосредоточенной и спокойной.',
    mood: 'Умиротворение',
    tags: ['утро', 'ритуалы', 'медитация'],
    imageSrc: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'new-year-thoughts',
    title: 'Мысли о новом годе',
    date: '20 декабря 2023',
    content: 'Задумалась о том, как быстро пролетел этот год. Столько всего произошло, столько планов реализовано, но и многое осталось незавершенным. Пора составлять список целей на следующий год.',
    mood: 'Задумчивость',
    tags: ['новый год', 'планы', 'рефлексия'],
    imageSrc: 'https://images.unsplash.com/photo-1482330454287-3cf6209df976?auto=format&fit=crop&q=80&w=2000',
  }
];

// List of all moods
const diaryMoods = [
  { id: 'joy', name: 'Радость' },
  { id: 'serenity', name: 'Умиротворение' },
  { id: 'inspiration', name: 'Вдохновение' },
  { id: 'nostalgia', name: 'Ностальгия' },
  { id: 'thoughtfulness', name: 'Задумчивость' },
  { id: 'anticipation', name: 'Предвкушение' },
  { id: 'sadness', name: 'Грусть' },
  { id: 'curiosity', name: 'Любопытство' }
];

// List of all tags
const diaryTags = [
  'осень', 'зима', 'книги', 'прогулки', 'кулинария', 'эксперименты', 
  'осенние рецепты', 'планы', 'хобби', 'друзья', 'погода', 'уют',
  'утро', 'ритуалы', 'медитация', 'новый год', 'рефлексия'
];

// Get all diary entries with optional filters
const getAllDiaryEntries = (searchQuery = '', mood = null) => {
  let entries = [...diaryEntries];
  
  if (searchQuery) {
    entries = entries.filter(entry => 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (mood) {
    entries = entries.filter(entry => entry.mood === mood);
  }
  
  return entries;
};

// Get a diary entry by ID
const getDiaryEntryById = (id) => {
  return diaryEntries.find(entry => entry.id === id);
};

// Get all moods
const getAllMoods = () => {
  return diaryMoods;
};

// Get all tags with counts
const getAllTags = () => {
  // Count tag occurrences
  const tagCounts = {};
  diaryEntries.forEach(entry => {
    entry.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Convert to array with counts
  return diaryTags.map(tag => ({
    name: tag,
    count: tagCounts[tag] || 0
  }));
};

module.exports = {
  getAllDiaryEntries,
  getDiaryEntryById,
  getAllMoods,
  getAllTags
};
