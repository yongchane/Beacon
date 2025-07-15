import { AITool, ScrapingResult } from './ai-tools-scraper';

// 간단한 JSON 파일 기반 데이터베이스 (개발용)
// 실제 배포에서는 PostgreSQL, MongoDB 등 사용
export class Database {
  private static DATA_FILE = './data/ai-tools.json';
  private static CACHE_FILE = './data/cache.json';

  static async saveScrapingResults(results: ScrapingResult[]): Promise<void> {
    try {
      const data = {
        lastUpdated: new Date().toISOString(),
        results: results,
        totalTools: results.reduce((sum, r) => sum + r.totalCount, 0)
      };

      // 실제 구현에서는 데이터베이스 저장
      console.log('💾 데이터베이스에 저장:', data.totalTools + '개 도구');
      
      // 메모리 캐시 (실제로는 Redis 등 사용)
      this.memoryCache = data;
      
    } catch (error) {
      console.error('❌ 데이터베이스 저장 오류:', error);
    }
  }

  static async getScrapingResults(): Promise<ScrapingResult[]> {
    try {
      // 메모리 캐시에서 먼저 확인
      if (this.memoryCache && this.isCacheValid()) {
        console.log('⚡ 캐시에서 데이터 반환');
        return this.memoryCache.results;
      }

      // 실제 구현에서는 데이터베이스 조회
      console.log('🔍 데이터베이스에서 데이터 조회');
      
      // 캐시가 없거나 만료된 경우 빈 배열 반환 (새로 스크래핑 필요)
      return [];
      
    } catch (error) {
      console.error('❌ 데이터베이스 조회 오류:', error);
      return [];
    }
  }

  static async getCacheStatus(): Promise<{
    isValid: boolean;
    lastUpdated: string | null;
    nextUpdate: string | null;
    totalTools: number;
  }> {
    if (!this.memoryCache) {
      return {
        isValid: false,
        lastUpdated: null,
        nextUpdate: null,
        totalTools: 0
      };
    }

    const lastUpdated = new Date(this.memoryCache.lastUpdated);
    const nextUpdate = new Date(lastUpdated.getTime() + this.CACHE_DURATION);

    return {
      isValid: this.isCacheValid(),
      lastUpdated: lastUpdated.toISOString(),
      nextUpdate: nextUpdate.toISOString(),
      totalTools: this.memoryCache.totalTools
    };
  }

  private static memoryCache: {
    lastUpdated: string;
    results: ScrapingResult[];
    totalTools: number;
  } | null = null;

  private static CACHE_DURATION = 6 * 60 * 60 * 1000; // 6시간

  private static isCacheValid(): boolean {
    if (!this.memoryCache) return false;
    
    const lastUpdated = new Date(this.memoryCache.lastUpdated).getTime();
    const now = Date.now();
    
    return (now - lastUpdated) < this.CACHE_DURATION;
  }

  // 백그라운드 스크래핑 트리거
  static async triggerBackgroundScraping(): Promise<void> {
    if (!this.isCacheValid()) {
      console.log('🔄 백그라운드 스크래핑 시작...');
      
      // 실제 구현에서는 큐 시스템 사용 (Bull, Agenda 등)
      try {
        const { AIToolsScraper } = await import('./ai-tools-scraper');
        const scraper = new AIToolsScraper();
        await scraper.initialize();
        
        const results = await scraper.scrapeFromMultipleSources();
        await scraper.close();
        
        await this.saveScrapingResults(results);
        console.log('✅ 백그라운드 스크래핑 완료');
        
      } catch (error) {
        console.error('❌ 백그라운드 스크래핑 오류:', error);
      }
    }
  }
}