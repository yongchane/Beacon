/**
 * NewsData.io API Response Types
 * Based on official documentation: https://newsdata.io/documentation
 */

export interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  keywords?: string[];
  creator?: string[];
  video_url?: string;
  description?: string;
  content?: string;
  pubDate: string;
  image_url?: string;
  source_id: string;
  source_priority: number;
  source_name: string;
  source_url: string;
  source_icon?: string;
  language: string;
  country: string[];
  category: string[];
  ai_tag?: string;
  sentiment?: string;
  sentiment_stats?: string;
  ai_region?: string;
  ai_org?: string;
  duplicate?: boolean;
}

export interface NewsDataResponse {
  status: 'success' | 'error';
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string;
}

export interface NewsDataErrorResponse {
  status: 'error';
  results: {
    message: string;
    code: string;
  };
}

export interface TransformedNewsResponse {
  success: boolean;
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string | null;
  source: string;
  fetchedAt: string;
}

export interface NewsApiError {
  success: false;
  error: string;
  message: string;
  status?: number;
}

// Valid NewsData.io categories
export type NewsDataCategory = 
  | 'business' 
  | 'entertainment' 
  | 'environment' 
  | 'food' 
  | 'health' 
  | 'politics' 
  | 'science' 
  | 'sports' 
  | 'technology' 
  | 'top' 
  | 'world';

// Supported languages (ISO 639-1 codes)
export type NewsDataLanguage = 
  | 'en' 
  | 'ko' 
  | 'zh' 
  | 'ja' 
  | 'es' 
  | 'fr' 
  | 'de' 
  | 'it' 
  | 'pt' 
  | 'ru' 
  | 'ar';

export interface NewsDataRequestParams {
  apikey: string;
  size?: number; // 1-50 (10 default for free plan)
  page?: string; // pagination token
  q?: string; // search query
  qInTitle?: string; // search in title only
  qInMeta?: string; // search in URL, description, title
  country?: string; // ISO 3166-1 alpha-2 country codes
  category?: string; // comma-separated categories
  language?: string; // comma-separated language codes
  domain?: string; // specific domains to include
  excludeDomain?: string; // domains to exclude
  from_date?: string; // YYYY-MM-DD format
  to_date?: string; // YYYY-MM-DD format
  sentiment?: 'positive' | 'neutral' | 'negative';
  prioritydomain?: 'top' | 'medium' | 'low';
}