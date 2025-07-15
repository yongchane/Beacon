'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, ExternalLink, Tag } from 'lucide-react';

interface AITool {
  name: string;
  description: string;
  category: string;
  url: string;
  pricing: string;
  rating?: number;
  tags: string[];
  imageUrl?: string;
}

interface ScrapingResult {
  category: string;
  tools: AITool[];
  totalCount: number;
}

interface Category {
  name: string;
  count: number;
  description: string;
}

interface SearchResults {
  query: string;
  totalMatches: number;
  results: ScrapingResult[];
}

export default function AIToolsDemo() {
  const [tools, setTools] = useState<ScrapingResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 카테고리 목록 가져오기
      const categoriesResponse = await fetch('/api/ai-tools/categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
      
      // AI 도구 데이터 가져오기 (실제 스크래핑)
      const toolsResponse = await fetch('/api/ai-tools?source=scrape');
      const toolsData = await toolsResponse.json();
      setTools(toolsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/ai-tools/search?q=${encodeURIComponent(searchQuery)}${
          selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''
        }`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    if (category) {
      try {
        const response = await fetch(`/api/ai-tools?category=${encodeURIComponent(category)}&source=scrape`);
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Category filter error:', error);
      }
    } else {
      fetchData();
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchResults(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayData = searchResults?.results || tools;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI 도구 카테고리별 목록
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Puppeteer API를 통해 수집된 카테고리별 AI 도구들을 확인해보세요.
        </p>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="AI 도구 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleCategoryFilter('')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              !selectedCategory 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryFilter(category.name)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.name 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* 검색 결과 정보 */}
        {searchResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>&apos;{searchResults.query}&apos;</strong> 검색 결과: {searchResults.totalMatches}개 도구 발견
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* AI 도구 목록 */}
      <div className="space-y-8">
        {displayData.map((categoryData: ScrapingResult, index: number) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {categoryData.category}
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                  {categoryData.totalCount}개
                </span>
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData.tools.map((tool: AITool, toolIndex: number) => (
                  <div
                    key={toolIndex}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {tool.name}
                      </h3>
                      {tool.rating && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm">{tool.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-green-600">
                        {tool.pricing}
                      </span>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">방문하기</span>
                      </a>
                    </div>
                    
                    {tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchResults ? '검색 결과가 없습니다.' : '데이터를 불러오는 중...'}
          </p>
        </div>
      )}
    </div>
  );
}