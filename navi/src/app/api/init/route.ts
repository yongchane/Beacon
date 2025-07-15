import { NextResponse } from 'next/server';
import { initializeScheduler } from '@/lib/scheduler';

let isInitialized = false;

export async function GET() {
  try {
    if (!isInitialized) {
      console.log('🚀 시스템 초기화 시작...');
      initializeScheduler();
      isInitialized = true;
      console.log('✅ 시스템 초기화 완료');
    }
    
    return NextResponse.json({
      success: true,
      message: 'System initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ 시스템 초기화 오류:', error);
    return NextResponse.json(
      { error: 'Failed to initialize system' },
      { status: 500 }
    );
  }
}