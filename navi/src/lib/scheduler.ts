import { Database } from './database';
import { AIToolsScraper } from './ai-tools-scraper';

export class ScrapingScheduler {
  private static instance: ScrapingScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  static getInstance(): ScrapingScheduler {
    if (!ScrapingScheduler.instance) {
      ScrapingScheduler.instance = new ScrapingScheduler();
    }
    return ScrapingScheduler.instance;
  }

  // 스케줄러 시작 (서버 시작 시 호출)
  start(): void {
    if (this.isRunning) {
      console.log('⚠️ 스케줄러가 이미 실행 중입니다');
      return;
    }

    console.log('🚀 스크래핑 스케줄러 시작');
    this.isRunning = true;

    // 즉시 한 번 실행
    this.runScraping();

    // 6시간마다 실행
    this.intervalId = setInterval(() => {
      this.runScraping();
    }, 6 * 60 * 60 * 1000); // 6시간
  }

  // 스케줄러 중지
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('🛑 스크래핑 스케줄러 중지');
    }
  }

  // 수동 스크래핑 실행
  async runScraping(): Promise<void> {
    console.log('🔄 정기 스크래핑 시작...');
    
    try {
      const scraper = new AIToolsScraper();
      await scraper.initialize();
      
      const results = await scraper.scrapeFromMultipleSources();
      await scraper.close();
      
      await Database.saveScrapingResults(results);
      
      console.log(`✅ 정기 스크래핑 완료: ${results.reduce((sum, r) => sum + r.totalCount, 0)}개 도구`);
      
    } catch (error) {
      console.error('❌ 정기 스크래핑 오류:', error);
    }
  }

  // 상태 확인
  getStatus(): {
    isRunning: boolean;
    nextRun: string | null;
  } {
    return {
      isRunning: this.isRunning,
      nextRun: this.intervalId ? new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() : null
    };
  }
}

// 서버 시작 시 자동 실행
export function initializeScheduler(): void {
  const scheduler = ScrapingScheduler.getInstance();
  scheduler.start();
  
  // 프로세스 종료 시 정리
  process.on('SIGINT', () => {
    scheduler.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    scheduler.stop();
    process.exit(0);
  });
}