import { AIToolsScraper } from '../lib/ai-tools-scraper';

async function main() {
  const scraper = new AIToolsScraper();
  
  try {
    console.log('🚀 AI Tools Scraper 시작...');
    
    // 브라우저 초기화
    await scraper.initialize();
    console.log('✅ Puppeteer 브라우저 초기화 완료');
    
    // 개발용 샘플 데이터 생성 (실제 스크래핑 전 테스트용)
    console.log('\n📊 샘플 데이터 생성 중...');
    const sampleData = await scraper.generateSampleData();
    
    console.log('\n=== 카테고리별 AI 도구 결과 ===');
    sampleData.forEach(category => {
      console.log(`\n📁 ${category.category} (${category.totalCount}개)`);
      console.log('━'.repeat(50));
      
      category.tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   📝 ${tool.description}`);
        console.log(`   💰 ${tool.pricing}`);
        console.log(`   ⭐ ${tool.rating || 'N/A'}`);
        console.log(`   🔗 ${tool.url}`);
        console.log(`   🏷️  ${tool.tags.join(', ')}`);
        console.log('');
      });
    });
    
    // 실제 스크래핑 시작
    console.log('\n🔍 실제 웹사이트 스크래핑 시작...');
    const scrapedData = await scraper.scrapeFromMultipleSources();
    
    console.log('\n=== 스크래핑 결과 ===');
    scrapedData.forEach(category => {
      console.log(`\n📁 ${category.category} (${category.totalCount}개)`);
      console.log('━'.repeat(50));
      
      category.tools.slice(0, 5).forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   📝 ${tool.description}`);
        console.log(`   💰 ${tool.pricing}`);
        console.log(`   🔗 ${tool.url}`);
        console.log('');
      });
      
      if (category.tools.length > 5) {
        console.log(`   ... 그 외 ${category.tools.length - 5}개 도구`);
      }
    });
    
    // 실제 스크래핑 데이터와 샘플 데이터 비교
    const totalScrapedTools = scrapedData.reduce((sum, category) => sum + category.totalCount, 0);
    console.log('\n📊 실제 스크래핑 통계');
    console.log('━'.repeat(30));
    console.log(`총 카테고리: ${scrapedData.length}개`);
    console.log(`총 AI 도구: ${totalScrapedTools}개`);
    console.log(`평균 카테고리당 도구: ${Math.round(totalScrapedTools / scrapedData.length)}개`);
    
    // 특정 카테고리만 스크래핑 테스트
    console.log('\n🎯 특정 카테고리 스크래핑 테스트...');
    const contentCategory = await scraper.scrapeCategory('콘텐츠 창작');
    
    if (contentCategory) {
      console.log(`\n📁 ${contentCategory.category} 카테고리 세부 정보:`);
      console.log('━'.repeat(50));
      contentCategory.tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}`);
        console.log(`   📝 ${tool.description}`);
        console.log(`   💰 ${tool.pricing}`);
        console.log(`   ⭐ ${tool.rating || 'N/A'}`);
        console.log('');
      });
    }
    
    // 최종 JSON 형태로 출력 (실제 스크래핑 데이터)
    console.log('\n📄 실제 스크래핑 JSON 데이터:');
    console.log(JSON.stringify(scrapedData, null, 2));
    
    // 샘플 데이터와 비교
    console.log('\n🔄 샘플 데이터와 비교:');
    console.log('━'.repeat(40));
    console.log(`실제 스크래핑: ${totalScrapedTools}개 도구`);
    console.log(`샘플 데이터: ${sampleData.reduce((sum, category) => sum + category.totalCount, 0)}개 도구`);
    console.log(`스크래핑 효율성: ${totalScrapedTools > 0 ? '성공' : '데이터 부족'}`);
    
    // 실제 스크래핑이 실패한 경우 샘플 데이터 표시
    if (totalScrapedTools === 0) {
      console.log('\n⚠️ 실제 스크래핑 데이터가 없어 샘플 데이터를 표시합니다.');
      console.log('\n📄 샘플 데이터 JSON:');
      console.log(JSON.stringify(sampleData, null, 2));
    }
    
  } catch (error) {
    console.error('❌ 스크래핑 중 오류 발생:', error);
  } finally {
    await scraper.close();
    console.log('\n✅ 스크래핑 완료 및 브라우저 종료');
  }
}

// 스크립트 실행
main().catch(console.error);