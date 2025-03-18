
export interface MainFeaturedSection {
  id: string;
  title: string;
  description: string;
  type: string;
}

export interface HeroData {
  tagline: string;
  title: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  mainImage: {
    src: string;
    alt: string;
  };
  badge: {
    text: string;
  };
  imageCaption: {
    title: string;
    subtitle: string;
  };
}

export interface AboutData {
  title: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
}

export interface NewsletterData {
  title: string;
  description: string;
  inputPlaceholder: string;
  successMessage: string;
}

export interface LatestPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc: string;
  link: string;
}

export interface Category {
  id: string;
  navTitle: string;
  link: string;
  title?: string;
  description?: string;
  imageSrc?: string;
}
