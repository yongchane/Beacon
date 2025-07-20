import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/lib/news-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const size = parseInt(searchParams.get('size') || '10');
    const page = searchParams.get('page');

    let newsData;

    if (query) {
      // Search for specific AI topics
      newsData = await newsService.searchAINews(query, {
        size,
        page: page || undefined,
      });
    } else {
      // Get general AI news
      newsData = await newsService.getAINews({
        size,
        page: page || undefined,
      });
    }

    return NextResponse.json({
      success: true,
      data: newsData,
    });
  } catch (error) {
    console.error('News API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'trending':
        const topics = await newsService.getTrendingAITopics();
        return NextResponse.json({
          success: true,
          data: topics,
        });

      case 'search':
        const searchResults = await newsService.searchAINews(params.query, params.options);
        return NextResponse.json({
          success: true,
          data: searchResults,
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('News API POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}