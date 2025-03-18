
export interface Category {
  id: string;
  navTitle: string;
  link: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  bgColor?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  link: string;
}
