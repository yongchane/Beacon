// NewsData.io API service for fetching AI-related news
export interface NewsArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source_id: string;
  source_name: string;
  image_url?: string;
  category: string[];
  keywords?: string[];
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string;
}

class NewsService {
  private baseUrl = 'https://newsdata.io/api/1';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEWSDATA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('NewsData.io API key not found. Please set NEWSDATA_API_KEY in environment variables.');
      throw new Error('NewsData.io API key is required');
    }
  }

  /**
   * Fetch latest AI-related news
   */
  async getAINews(options: {
    size?: number; // number of articles (10 for free, 50 for paid)
    page?: string; // pagination token
  } = {}): Promise<NewsResponse> {
    const { size = 10, page } = options;
    
    // AI-related keywords for better filtering
    const aiKeywords = [
      'artificial intelligence',
      'AI',
      'machine learning',
      'ChatGPT',
      'OpenAI',
      'Google AI',
      'deep learning',
      'neural network',
      'AI tool',
      'AI technology'
    ].join(' OR ');

    const params = new URLSearchParams({
      apikey: this.apiKey,
      q: aiKeywords,
      language: 'en,ko', // English and Korean
      category: 'technology,science',
      size: size.toString(),
    });
    
    // Note: timeframe parameter requires paid plan
    // For free plan, we'll get the latest articles without timeframe filter

    if (page) {
      params.append('page', page);
    }

    try {
      const url = `${this.baseUrl}/latest?${params}`;
      console.log('Fetching news from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Navigator/1.0',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`NewsData.io API error: ${response.status} ${response.statusText || 'Unknown error'} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Successfully fetched news:', data.totalResults || 0, 'articles');
      return data;
    } catch (error) {
      console.error('Error fetching AI news:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch news: ${error.message}`);
      }
      throw new Error('Failed to fetch news: Unknown error');
    }
  }

  /**
   * Search for specific AI topics
   */
  async searchAINews(query: string, options: {
    size?: number;
    page?: string;
  } = {}): Promise<NewsResponse> {
    const { size = 10, page } = options;

    const params = new URLSearchParams({
      apikey: this.apiKey,
      q: `(${query}) AND (AI OR "artificial intelligence" OR "machine learning")`,
      language: 'en,ko',
      category: 'technology,science',
      size: size.toString(),
    });
    
    // Note: timeframe parameter requires paid plan

    if (page) {
      params.append('page', page);
    }

    try {
      const url = `${this.baseUrl}/latest?${params}`;
      console.log('Searching news at:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Navigator/1.0',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search API Error Response:', errorText);
        throw new Error(`NewsData.io API error: ${response.status} ${response.statusText || 'Unknown error'} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Successfully searched news:', data.totalResults || 0, 'articles');
      return data;
    } catch (error) {
      console.error('Error searching AI news:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to search news: ${error.message}`);
      }
      throw new Error('Failed to search news: Unknown error');
    }
  }

  /**
   * Get trending AI news topics
   */
  async getTrendingAITopics(): Promise<string[]> {
    try {
      const news = await this.getAINews({ size: 50 });
      
      // Extract keywords and find trending topics
      const keywordFrequency: Record<string, number> = {};
      
      news.results.forEach(article => {
        if (article.keywords) {
          article.keywords.forEach(keyword => {
            const cleanKeyword = keyword.toLowerCase().trim();
            if (cleanKeyword.length > 2) {
              keywordFrequency[cleanKeyword] = (keywordFrequency[cleanKeyword] || 0) + 1;
            }
          });
        }
      });

      // Return top 10 trending topics
      return Object.entries(keywordFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([keyword]) => keyword);
    } catch (error) {
      console.error('Error getting trending topics:', error);
      return [];
    }
  }
}

export const newsService = new NewsService();