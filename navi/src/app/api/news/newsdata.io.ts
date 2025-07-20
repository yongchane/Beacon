import { NextRequest, NextResponse } from "next/server";
import type { 
  NewsDataResponse, 
  NewsDataErrorResponse, 
  TransformedNewsResponse
} from "@/types/newsdata";

/**
 * NewsData.io Latest News API Handler
 * Fetches AI-related news using NewsData.io API
 * 
 * API Documentation: https://newsdata.io/documentation
 * Categories: 'business', 'entertainment', 'environment', 'food', 'health', 
 *            'politics', 'science', 'sports', 'technology', 'top', 'world'
 * 
 * Note: NewsData.io doesn't have a specific 'ai' category, but 'technology' and 'science' 
 * categories are used with AI-related keywords for filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters with defaults
    const size = Math.min(parseInt(searchParams.get('size') || '10'), 50); // Max 50 for paid, 10 for free
    const page = searchParams.get('page');
    const language = searchParams.get('language') || 'en,ko';
    const category = searchParams.get('category') || 'technology,science';
    
    // AI-related search query
    const aiQuery = 'AI OR "artificial intelligence" OR "machine learning" OR "deep learning" OR ChatGPT OR OpenAI OR "neural network"';
    
    // Build API URL with proper parameters
    const params = new URLSearchParams({
      apikey: process.env.NEWSDATA_API_KEY || 'pub_323c7d8e975f4de18799dcea50dd0e81',
      size: size.toString(),
      category: category,
      language: language,
      q: aiQuery, // Search for AI-related content
    });
    
    // Add pagination if provided
    if (page) {
      params.append('page', page);
    }
    
    const apiUrl = `https://newsdata.io/api/1/latest?${params}`;
    console.log('Fetching from NewsData.io:', apiUrl.replace(/apikey=[^&]+/, 'apikey=***'));
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AI-Navigator/1.0',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsData.io API Error:', response.status, errorText);
      
      return NextResponse.json(
        { 
          success: false,
          error: 'NewsData.io API Error',
          status: response.status,
          message: errorText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json() as NewsDataResponse | NewsDataErrorResponse;
    
    // Validate response structure according to NewsData.io documentation
    if (data.status === 'error') {
      console.error('NewsData.io returned error:', data);
      return NextResponse.json(
        {
          success: false,
          error: 'API returned error',
          message: (data as NewsDataErrorResponse).results?.message || 'Unknown API error'
        },
        { status: 400 }
      );
    }
    
    // Transform response to match our expected format
    const transformedData: TransformedNewsResponse = {
      success: true,
      status: data.status,
      totalResults: (data as NewsDataResponse).totalResults || 0,
      results: (data as NewsDataResponse).results || [],
      nextPage: (data as NewsDataResponse).nextPage || null,
      source: 'newsdata.io',
      fetchedAt: new Date().toISOString()
    };
    
    console.log(`Successfully fetched ${transformedData.totalResults} AI news articles`);
    
    return NextResponse.json(transformedData);
    
  } catch (error) {
    console.error("Error fetching news from NewsData.io:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch news",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
