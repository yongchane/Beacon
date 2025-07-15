import { NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { ScrapingScheduler } from '@/lib/scheduler';

export async function GET() {
  try {
    const cacheStatus = await Database.getCacheStatus();
    const scheduler = ScrapingScheduler.getInstance();
    const schedulerStatus = scheduler.getStatus();
    
    return NextResponse.json({
      cache: cacheStatus,
      scheduler: schedulerStatus,
      system: {
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Status API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get system status' },
      { status: 500 }
    );
  }
}

// 수동 스크래핑 트리거
export async function POST() {
  try {
    const scheduler = ScrapingScheduler.getInstance();
    
    // 백그라운드에서 스크래핑 실행
    scheduler.runScraping();
    
    return NextResponse.json({
      success: true,
      message: 'Manual scraping triggered'
    });
  } catch (error) {
    console.error('Manual scraping trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger scraping' },
      { status: 500 }
    );
  }
}