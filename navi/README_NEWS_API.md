# NewsData.io API Integration Guide

## 설정 완료된 기능

### 1. 환경 설정
- `.env.local` 파일에 API 키 설정 필요
- `NEWSDATA_API_KEY=your_api_key_here` 추가

### 2. 구현된 파일들

#### `/src/lib/news-service.ts`
- NewsData.io API와 통신하는 서비스 클래스
- AI 관련 뉴스 필터링 기능
- 키워드 검색 및 트렌딩 토픽 분석

#### `/src/app/api/news/route.ts`
- REST API 엔드포인트 (`/api/news`)
- GET: 뉴스 조회 및 검색
- POST: 트렌딩 토픽 분석

#### `/src/components/AINewsSection.tsx`
- 홈페이지용 뉴스 섹션 컴포넌트
- 실시간 새로고침 기능
- 로딩 및 에러 상태 처리

#### `/src/app/news/page.tsx`
- 전용 뉴스 페이지
- 검색 기능
- 페이지네이션 지원

### 3. API 사용법

#### 기본 AI 뉴스 조회
```
GET /api/news?size=10&timeframe=48
```

#### 키워드 검색
```
GET /api/news?q=ChatGPT&size=20&timeframe=24
```

#### 트렌딩 토픽 조회
```
POST /api/news
Content-Type: application/json

{
  "action": "trending"
}
```

### 4. 주요 기능

- **AI 뉴스 필터링**: AI, 머신러닝, ChatGPT 등 관련 키워드로 자동 필터링
- **다국어 지원**: 한국어, 영어 뉴스 동시 지원
- **시간 필터**: 1-48시간 범위 설정 가능
- **카테고리 필터**: 기술, 과학 카테고리 우선
- **실시간 업데이트**: 새로고침 버튼으로 최신 뉴스 조회

### 5. 시작하기

1. NewsData.io에서 API 키 발급: https://newsdata.io/register
2. `.env.local` 파일에 API 키 추가
3. 개발 서버 실행: `npm run dev`
4. 홈페이지에서 "최신 AI 뉴스" 섹션 확인
5. `/news` 페이지에서 상세 뉴스 확인

### 6. 제한사항

- **무료 플랜**: 월 200건 요청 제한
- **응답 크기**: 무료 사용자는 요청당 10개 기사
- **시간 범위**: 최대 48시간 이전 뉴스까지

### 7. 에러 처리

- API 키 누락 시 경고 메시지
- 네트워크 오류 시 재시도 버튼
- 빈 결과 시 안내 메시지
- 로딩 상태 표시