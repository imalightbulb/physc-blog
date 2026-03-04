export interface PostFrontmatter {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  cover_image: string | null;
  published: boolean;
  date: string;
  slug: string;
}

export interface AdminPostInput {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  cover_image?: string | null;
  published?: boolean;
  date?: string;
  slug?: string;
  content: string;
}

export interface AdminPostRecord extends PostFrontmatter {
  content: string;
  filename: string;
  updatedAt: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
