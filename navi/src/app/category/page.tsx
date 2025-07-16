
import { getAiTools } from '@/lib/getAiTools';
import ToolList from './components/ToolList';

// app/category/page.tsx

export default async function CategoryPage() {
  const allTools = await getAiTools();

  // 에러 또는 데이터가 없는 경우의 UI
  if (!allTools || allTools.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">AI Tools</h1>
        <p className="mt-4">AI 툴을 불러오지 못했거나, 등록된 툴이 없습니다.</p>
        <p>개발 환경(npm run dev)에서 실행 중인지 확인해주세요.</p>
      </div>
    );
  }

  // 고유한 카테고리 목록 추출
  const categories = ['All', ...Array.from(new Set(allTools.map(tool => tool.category)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Tools by Category</h1>
      <ToolList tools={allTools} categories={categories} />
    </div>
  );
}
