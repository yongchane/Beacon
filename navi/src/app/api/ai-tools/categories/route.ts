import { NextResponse } from 'next/server';
import { AIToolsScraper } from '@/lib/ai-tools-scraper';

export async function GET() {
  try {
    const scraper = new AIToolsScraper();
    const sampleData = await scraper.generateSampleData();
    
    // 카테고리 목록과 각 카테고리별 도구 수 반환
    const categories = sampleData.map(item => ({
      name: item.category,
      count: item.totalCount,
      description: getCategoryDescription(item.category)
    }));
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    '콘텐츠 창작': '글쓰기, 이미지 생성, 동영상 제작 등 창작 활동을 지원하는 AI 도구',
    '업무 생산성': '문서 작성, 데이터 분석, 업무 자동화를 도와주는 AI 도구',
    '학습 교육': '언어 학습, 과제 도움, 개념 설명 등 교육을 지원하는 AI 도구',
    '개발 코딩': '코드 생성, 디버깅, 리뷰 등 개발 작업을 지원하는 AI 도구',
    '마케팅 비즈니스': 'SEO, 광고, 고객 분석 등 비즈니스 활동을 지원하는 AI 도구',
    '이미지 생성': '텍스트로 이미지를 생성하거나 편집하는 AI 도구'
  };
  
  return descriptions[category] || '다양한 AI 도구들';
}