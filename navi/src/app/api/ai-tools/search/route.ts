import { NextRequest, NextResponse } from 'next/server';
import { AIToolsScraper } from '@/lib/ai-tools-scraper';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }
  
  try {
    const scraper = new AIToolsScraper();
    const allData = await scraper.generateSampleData();
    
    // 모든 도구를 하나의 배열로 평탄화
    const allTools = allData.flatMap(categoryData => categoryData.tools);
    
    // 검색 필터링
    const filteredTools = allTools.filter(tool => {
      const matchesQuery = 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = category ? 
        tool.category.toLowerCase().includes(category.toLowerCase()) : true;
      
      return matchesQuery && matchesCategory;
    });
    
    // 카테고리별로 그룹화
    const groupedResults = filteredTools.reduce((acc, tool) => {
      const category = tool.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {} as Record<string, typeof filteredTools>);
    
    // 응답 형식 변환
    const searchResults = Object.entries(groupedResults).map(([category, tools]) => ({
      category,
      tools,
      totalCount: tools.length
    }));
    
    return NextResponse.json({
      query,
      category,
      results: searchResults,
      totalMatches: filteredTools.length
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search AI tools' },
      { status: 500 }
    );
  }
}