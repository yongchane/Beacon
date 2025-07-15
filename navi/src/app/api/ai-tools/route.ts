import { NextRequest, NextResponse } from 'next/server';
import { AIToolsScraper } from '@/lib/ai-tools-scraper';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const source = searchParams.get('source') || 'scrape'; // 'sample' or 'scrape' - 기본값을 scrape으로 변경
  
  try {
    const scraper = new AIToolsScraper();
    
    if (source === 'sample') {
      // 샘플 데이터 반환 (개발용)
      const sampleData = await scraper.generateSampleData();
      
      if (category) {
        const filteredData = sampleData.filter(item => 
          item.category.toLowerCase().includes(category.toLowerCase())
        );
        return NextResponse.json(filteredData);
      }
      
      return NextResponse.json(sampleData);
    } else {
      // 실제 스크래핑 (운영용) - 캐시 우선
      
      // 1. 캐시에서 데이터 확인
      const cachedData = await Database.getScrapingResults();
      
      if (cachedData.length > 0) {
        console.log('⚡ 캐시된 데이터 반환');
        
        // 카테고리 필터링
        if (category) {
          const filteredData = cachedData.filter(item => 
            item.category.toLowerCase().includes(category.toLowerCase())
          );
          return NextResponse.json(filteredData);
        }
        
        // 백그라운드에서 데이터 업데이트 트리거
        Database.triggerBackgroundScraping();
        
        return NextResponse.json(cachedData);
      }
      
      // 2. 캐시가 없으면 실시간 스크래핑
      console.log('🔍 캐시가 없어 실시간 스크래핑 실행...');
      
      const scraper = new AIToolsScraper();
      await scraper.initialize();
      
      try {
        if (category) {
          const categoryData = await scraper.scrapeCategory(category);
          return NextResponse.json(categoryData ? [categoryData] : []);
        } else {
          const allData = await scraper.scrapeFromMultipleSources();
          
          // 스크래핑 결과를 캐시에 저장
          if (allData.length > 0 && allData.some(item => item.totalCount > 0)) {
            await Database.saveScrapingResults(allData);
          }
          
          // 스크래핑 결과가 없으면 샘플 데이터로 fallback
          if (allData.length === 0 || allData.every(item => item.totalCount === 0)) {
            console.log('실제 스크래핑 데이터가 없어 샘플 데이터로 fallback');
            const fallbackData = await scraper.generateSampleData();
            return NextResponse.json(fallbackData);
          }
          
          return NextResponse.json(allData);
        }
      } finally {
        await scraper.close();
      }
    }
  } catch (error) {
    console.error('AI Tools API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI tools data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category, tools } = await request.json();
    
    // 여기서 데이터베이스에 저장하는 로직 구현
    // 현재는 콘솔에만 출력
    console.log('Saving AI tools data:', { category, tools });
    
    return NextResponse.json({ 
      success: true, 
      message: `${tools.length} tools saved for category: ${category}` 
    });
  } catch (error) {
    console.error('Save AI Tools Error:', error);
    return NextResponse.json(
      { error: 'Failed to save AI tools data' },
      { status: 500 }
    );
  }
}