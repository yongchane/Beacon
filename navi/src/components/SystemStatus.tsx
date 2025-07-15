'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Database, Play } from 'lucide-react';

interface SystemStatus {
  cache: {
    isValid: boolean;
    lastUpdated: string | null;
    nextUpdate: string | null;
    totalTools: number;
  };
  scheduler: {
    isRunning: boolean;
    nextRun: string | null;
  };
  system: {
    environment: string;
    timestamp: string;
  };
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchStatus();
    // 30초마다 상태 업데이트
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/ai-tools/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Status fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerScraping = async () => {
    setTriggering(true);
    try {
      const response = await fetch('/api/ai-tools/status', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        console.log('스크래핑 트리거 성공');
        // 5초 후 상태 업데이트
        setTimeout(fetchStatus, 5000);
      }
    } catch (error) {
      console.error('스크래핑 트리거 오류:', error);
    } finally {
      setTriggering(false);
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('ko-KR');
  };

  const getTimeLeft = (nextUpdate: string | null) => {
    if (!nextUpdate) return 'N/A';
    
    const now = new Date().getTime();
    const next = new Date(nextUpdate).getTime();
    const diff = next - now;
    
    if (diff <= 0) return '업데이트 필요';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}시간 ${minutes}분 후`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">시스템 상태를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="h-5 w-5" />
          시스템 상태
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchStatus}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={triggerScraping}
            disabled={triggering}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            {triggering ? '실행 중...' : '수동 실행'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 캐시 상태 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Database className="h-4 w-4" />
            데이터 캐시
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">상태:</span>
              <span className={`font-medium ${
                status.cache.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {status.cache.isValid ? '유효' : '만료됨'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">총 도구:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {status.cache.totalTools}개
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">마지막 업데이트:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatTime(status.cache.lastUpdated)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">다음 업데이트:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {getTimeLeft(status.cache.nextUpdate)}
              </span>
            </div>
          </div>
        </div>

        {/* 스케줄러 상태 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            스케줄러
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">상태:</span>
              <span className={`font-medium ${
                status.scheduler.isRunning ? 'text-green-600' : 'text-red-600'
              }`}>
                {status.scheduler.isRunning ? '실행 중' : '중지됨'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">다음 실행:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatTime(status.scheduler.nextRun)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">환경:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {status.system.environment}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 시스템이 자동으로 6시간마다 AI 도구 데이터를 업데이트합니다. 
          수동으로 업데이트하려면 '수동 실행' 버튼을 클릭하세요.
        </p>
      </div>
    </div>
  );
}