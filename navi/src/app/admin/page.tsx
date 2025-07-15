import SystemStatus from '@/components/SystemStatus';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            시스템 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI 도구 스크래핑 시스템의 상태를 모니터링하고 관리할 수 있습니다.
          </p>
        </div>

        <SystemStatus />
      </div>
    </div>
  );
}