
'use client';

import { useState, useMemo } from 'react';

// Tool 타입을 서버 컴포넌트와 공유하기 위해 이상적으로는 별도 파일(types.ts)로 분리하는 것이 좋습니다.
type AiTool = {
  id: string;
  name: string;
  description: string;
  category: string;
  // 다른 필드들...
};

interface ToolListProps {
  tools: AiTool[];
  categories: string[];
}

export default function ToolList({ tools, categories }: ToolListProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = useMemo(() => {
    console.log(`Filtering for category: ${selectedCategory}`); // 필터링 동작 확인용 로그
    if (selectedCategory === 'All') {
      return tools;
    }
    return tools.filter(tool => tool.category === selectedCategory);
  }, [selectedCategory, tools]);

  return (
    <div>
      {/* 카테고리 필터 버튼 */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 필터링된 툴 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div key={tool.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
              {tool.category}
            </span>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-10">
            <p>해당 카테고리에 맞는 툴이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
