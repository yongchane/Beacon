
import "server-only";

type AiTool = {
  id: string;
  name: string;
  description: string;
  category: string;
  // Browse AI API 응답에 따라 필요한 다른 필드들을 추가할 수 있습니다.
};

type ApiResponse = {
  result: {
    // API 응답 구조에 따라 이 부분을 조정해야 합니다.
    // 예를 들어, 로봇의 captured_lists 안에 데이터가 있을 수 있습니다.
    captured_lists: {
      [key: string]: AiTool[];
    };
  };
  // 기타 API 응답 필드
};

export async function getAiTools(): Promise<AiTool[]> {
  // npm run dev 일 때만 실행되도록 환경 변수 체크
  if (process.env.NODE_ENV !== 'development') {
    console.log("Not in development mode, skipping API call.");
    return [];
  }

  const apiKey = process.env.BROWSE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("BROWSE_AI_API_KEY is not defined in .env.local");
  }

  // Browse AI의 "List Robots" 엔드포인트를 사용하여 로봇 ID를 가져오거나,
  // 이미 알고 있는 특정 로봇의 "Run Robot" 또는 "Get Task" 엔드포인트를 사용해야 합니다.
  // 여기서는 예시로 특정 로봇(ROBOT_ID)을 실행하고 그 결과를 가져오는 것을 가정합니다.
  // 실제 ROBOT_ID를 입력해야 합니다.
  const ROBOT_ID = "YOUR_ROBOT_ID"; // <-- 여기에 실제 로봇 ID를 입력하세요.

  try {
    // 1. 로봇 실행 (필요한 경우)
    // const runResponse = await fetch(`https://api.browse.ai/v2/robots/${ROBOT_ID}/run`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${apiKey}` },
    // });
    // const runData = await runResponse.json();
    // const taskId = runData.result.id;

    // 2. 실행된 작업(Task)의 결과 가져오기
    // 여기서는 가장 최근에 성공한 작업의 결과를 가져오는 것을 가정합니다.
    // 실제로는 특정 task ID를 사용해야 할 수 있습니다.
    const response = await fetch(
      `https://api.browse.ai/v2/robots/${ROBOT_ID}/tasks/latest/result`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        // Next.js 13+ 의 fetch 확장 기능: 1시간 동안 캐시
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // API 응답 구조에 따라 실제 데이터가 있는 위치를 파싱해야 합니다.
    // captured_lists의 첫 번째 리스트를 사용한다고 가정합니다.
    const toolListKey = Object.keys(data.result.captured_lists)[0];
    const tools = data.result.captured_lists[toolListKey] || [];

    return tools;

  } catch (error) {
    console.error("Failed to fetch AI tools:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
}
