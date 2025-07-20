
export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 도구 카테고리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            다양한 카테고리별 AI 도구를 탐색해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "콘텐츠 창작", icon: "✍️", description: "글쓰기, 이미지 생성, 동영상 제작", count: 25 },
            { name: "업무 생산성", icon: "📊", description: "문서 작성, 데이터 분석, 자동화", count: 18 },
            { name: "학습 교육", icon: "🎓", description: "언어 학습, 과제 도움, 개념 설명", count: 12 },
            { name: "개발 코딩", icon: "💻", description: "코드 생성, 디버깅, 리뷰", count: 15 },
            { name: "마케팅 비즈니스", icon: "📈", description: "SEO, 광고, 고객 분석", count: 10 },
            { name: "기타", icon: "🔧", description: "유틸리티, 특화 도구", count: 8 }
          ].map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-3">{category.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                  {category.count}개 도구
                </span>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  탐색하기 →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
