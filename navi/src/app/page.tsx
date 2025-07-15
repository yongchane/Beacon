import { Search, Sparkles, TrendingUp, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Navigator</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                로그인
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                시작하기
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI 도구를 쉽게 찾고 배우세요
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            ChatGPT를 넘어서는 다양한 AI 도구들을 발견하고, 개인 맞춤형 추천을 받아보세요.
            초보자도 쉽게 따라할 수 있는 가이드와 함께합니다.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="원하는 AI 도구나 기능을 검색해보세요..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            개인 맞춤 추천 받기
          </button>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            카테고리별 AI 도구
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "콘텐츠 창작", icon: "✍️", description: "글쓰기, 이미지 생성, 동영상 제작" },
              { name: "업무 생산성", icon: "📊", description: "문서 작성, 데이터 분석, 자동화" },
              { name: "학습 교육", icon: "🎓", description: "언어 학습, 과제 도움, 개념 설명" },
              { name: "개발 코딩", icon: "💻", description: "코드 생성, 디버깅, 리뷰" },
              { name: "마케팅 비즈니스", icon: "📈", description: "SEO, 광고, 고객 분석" },
              { name: "기타", icon: "🔧", description: "유틸리티, 특화 도구" }
            ].map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Tools */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            이주의 추천 도구
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Claude", category: "AI 어시스턴트", description: "대화형 AI로 다양한 업무 지원", rating: 4.8 },
              { name: "Midjourney", category: "이미지 생성", description: "텍스트로 고품질 이미지 생성", rating: 4.9 },
              { name: "Notion AI", category: "문서 작성", description: "노션 내에서 AI 글쓰기 지원", rating: 4.7 }
            ].map((tool, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{tool.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{tool.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  자세히 보기 →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              최신 AI 뉴스
            </h3>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              모든 뉴스 보기
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "OpenAI GPT-4의 새로운 기능 업데이트", date: "2024.07.15", summary: "멀티모달 기능이 강화되고 더 정확한 답변 제공" },
              { title: "Google Bard, 한국어 지원 확대", date: "2024.07.14", summary: "한국어 처리 성능이 크게 향상되어 더 자연스러운 대화 가능" },
              { title: "새로운 AI 이미지 생성 도구 출시", date: "2024.07.13", summary: "Adobe Firefly 경쟁작으로 주목받는 새로운 생성 AI" }
            ].map((news, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{news.date}</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{news.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{news.summary}</p>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  읽어보기 →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            AI 활용 가이드
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            초보자를 위한 단계별 가이드와 프롬프트 작성법을 배워보세요.
            실제 사용 사례와 함께 제공됩니다.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            학습 시작하기
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 AI Navigator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
