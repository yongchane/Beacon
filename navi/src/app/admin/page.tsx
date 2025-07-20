export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            시스템 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI 도구 관리 시스템 페이지입니다.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            관리 기능
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            관리 기능이 추가될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
}