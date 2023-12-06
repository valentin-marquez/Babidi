export interface Article {
  id: number;
  post_id: number;
  title: string;
  description: string;
  author_id: string;
  created_at: Date;
  status: string;
  updated_at: Date;
  slug: string;
  image_urls: string;
  full_name: string;
  username: string;
  category_name: string;
  category_slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}
