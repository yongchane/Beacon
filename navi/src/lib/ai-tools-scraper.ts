import puppeteer from 'puppeteer';
import { SimpleScraper } from './simple-scraper';

export interface AITool {
  name: string;
  description: string;
  category: string;
  url: string;
  pricing: string;
  rating?: number;
  tags: string[];
  imageUrl?: string;
}

export interface ScrapingResult {
  category: string;
  tools: AITool[];
  totalCount: number;
}

export class AIToolsScraper {
  private browser: import('puppeteer').Browser | null = null;

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-features=VizDisplayCompositor',
          '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ],
        timeout: 30000
      });
      console.log('🚀 Puppeteer 브라우저 초기화 성공');
    } catch (error) {
      console.error('❌ Puppeteer 브라우저 초기화 실패:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      try {
        await this.browser.close();
        console.log('✅ Puppeteer 브라우저 정상 종료');
      } catch (error) {
        console.error('⚠️ 브라우저 종료 오류:', error);
      }
    }
  }

  async scrapeFromMultipleSources(): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // 여러 소스에서 데이터 수집
    const sources = [
      { name: 'futurepedia', url: 'https://www.futurepedia.io' },
      { name: 'toolify', url: 'https://www.toolify.ai' },
      { name: 'futuretools', url: 'https://www.futuretools.io' }
    ];

    console.log(`🚀 전체 스크래핑 시작 - ${sources.length}개 소스`);

    for (const source of sources) {
      try {
        const sourceResults = await this.scrapeFromSource(source);
        results.push(...sourceResults);
        
        // 소스 간 요청 간격 (5초)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        console.error(`❌ ${source.name} 스크래핑 오류:`, error);
        // 오류가 발생해도 다음 소스로 계속 진행
        continue;
      }
    }

    console.log(`📊 전체 스크래핑 완료: ${results.reduce((sum, r) => sum + r.totalCount, 0)}개 도구 수집`);
    
    const mergedResults = this.mergeAndDeduplicateResults(results);
    
    // 스크래핑 결과가 없으면 대체 스크래핑 시도
    if (mergedResults.length === 0 || mergedResults.every(r => r.totalCount === 0)) {
      console.log('⚠️ 기본 스크래핑 데이터가 없어 대체 소스에서 시도...');
      
      try {
        const simpleScraper = new SimpleScraper();
        await simpleScraper.initialize();
        
        const alternativeResults = await simpleScraper.scrapeAllSources();
        await simpleScraper.close();
        
        if (alternativeResults.length > 0 && alternativeResults.some(r => r.totalCount > 0)) {
          console.log('✅ 대체 스크래핑 성공!');
          return alternativeResults;
        }
      } catch (error) {
        console.error('❌ 대체 스크래핑 실패:', error);
      }
      
      console.log('⚠️ 모든 스크래핑 실패 - 샘플 데이터로 fallback');
      return await this.generateSampleData();
    }
    
    return mergedResults;
  }

  private async scrapeFromSource(source: { name: string; url: string }): Promise<ScrapingResult[]> {
    if (!this.browser) throw new Error('Browser not initialized');
    
    let page = null;
    try {
      page = await this.browser.newPage();
      
      // 페이지 설정
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log(`🔍 ${source.name} 스크래핑 시작: ${source.url}`);
      
      // 페이지 이동 (타임아웃 30초)
      await page.goto(source.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // 페이지 로딩 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let results = [];
      switch (source.name) {
        case 'futurepedia':
          results = await this.scrapeFuturepedia(page);
          break;
        case 'toolify':
          results = await this.scrapeToolify(page);
          break;
        case 'futuretools':
          results = await this.scrapeFuturetools(page);
          break;
        default:
          console.log(`⚠️ 알 수 없는 소스: ${source.name}`);
          return [];
      }
      
      console.log(`✅ ${source.name} 스크래핑 완료: ${results.reduce((sum, r) => sum + r.totalCount, 0)}개 도구 수집`);
      return results;
      
    } catch (error) {
      console.error(`❌ ${source.name} 스크래핑 오류:`, error);
      return [];
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          console.error(`⚠️ 페이지 종료 오류:`, closeError);
        }
      }
    }
  }

  private async scrapeFuturepedia(page: import('puppeteer').Page): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // 카테고리별 데이터 수집
    const categories = [
      { name: '콘텐츠 창작', url: '/ai-tools?category=content' },
      { name: '업무 생산성', url: '/ai-tools?category=productivity' },
      { name: '학습 교육', url: '/ai-tools?category=education' },
      { name: '개발 코딩', url: '/ai-tools?category=development' },
      { name: '마케팅 비즈니스', url: '/ai-tools?category=marketing' },
      { name: '이미지 생성', url: '/ai-tools?category=image' }
    ];

    for (const category of categories) {
      try {
        await page.goto(`https://www.futurepedia.io${category.url}`, { 
          waitUntil: 'networkidle2' 
        });

        const tools = await page.evaluate(() => {
          const toolElements = document.querySelectorAll('[data-testid="tool-card"]');
          return Array.from(toolElements).map((element: Element) => {
            const nameElement = element.querySelector('h3, .tool-name');
            const descElement = element.querySelector('.tool-description, p');
            const linkElement = element.querySelector('a');
            const priceElement = element.querySelector('.price, .pricing');
            const ratingElement = element.querySelector('.rating');
            const imageElement = element.querySelector('img');

            return {
              name: nameElement?.textContent?.trim() || '',
              description: descElement?.textContent?.trim() || '',
              url: linkElement?.href || '',
              pricing: priceElement?.textContent?.trim() || 'Unknown',
              rating: ratingElement?.textContent ? parseFloat(ratingElement.textContent) : undefined,
              imageUrl: imageElement?.src || '',
              tags: []
            };
          }).filter(tool => tool.name);
        });

        results.push({
          category: category.name,
          tools: tools.map(tool => ({
            ...tool,
            category: category.name
          })),
          totalCount: tools.length
        });

        // 페이지 간 요청 간격
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error scraping category ${category.name}:`, error);
      }
    }

    return results;
  }

  private async scrapeToolify(page: import('puppeteer').Page): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // Toolify 특화 스크래핑 로직
    const categories = [
      { name: '콘텐츠 창작', selector: '.category-content' },
      { name: '업무 생산성', selector: '.category-productivity' },
      { name: '학습 교육', selector: '.category-education' },
      { name: '개발 코딩', selector: '.category-development' },
      { name: '마케팅 비즈니스', selector: '.category-marketing' }
    ];

    for (const category of categories) {
      try {
        const tools = await page.evaluate(() => {
          const toolElements = document.querySelectorAll('.tool-item, .ai-tool-card');
          return Array.from(toolElements).map((element: Element) => {
            const nameElement = element.querySelector('.tool-title, h3');
            const descElement = element.querySelector('.tool-desc, .description');
            const linkElement = element.querySelector('a');
            const priceElement = element.querySelector('.price');

            return {
              name: nameElement?.textContent?.trim() || '',
              description: descElement?.textContent?.trim() || '',
              url: linkElement?.href || '',
              pricing: priceElement?.textContent?.trim() || 'Unknown',
              tags: []
            };
          }).filter(tool => tool.name);
        });

        results.push({
          category: category.name,
          tools: tools.map(tool => ({
            ...tool,
            category: category.name
          })),
          totalCount: tools.length
        });
      } catch (error) {
        console.error(`Error scraping Toolify category ${category.name}:`, error);
      }
    }

    return results;
  }

  private async scrapeFuturetools(page: import('puppeteer').Page): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // Future Tools 특화 스크래핑 로직
    try {
      const tools = await page.evaluate(() => {
        const toolElements = document.querySelectorAll('.tool-card, .grid-item');
        return Array.from(toolElements).map((element: Element) => {
          const nameElement = element.querySelector('.tool-name, h3');
          const descElement = element.querySelector('.tool-description, p');
          const linkElement = element.querySelector('a');
          const categoryElement = element.querySelector('.category, .tag');

          return {
            name: nameElement?.textContent?.trim() || '',
            description: descElement?.textContent?.trim() || '',
            url: linkElement?.href || '',
            category: categoryElement?.textContent?.trim() || 'General',
            pricing: 'Unknown',
            tags: []
          };
        }).filter(tool => tool.name);
      });

      // 카테고리별로 그룹화
      const categorizedTools = tools.reduce((acc: Record<string, typeof tools>, tool: typeof tools[0]) => {
        const category = tool.category || 'General';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(tool);
        return acc;
      }, {});

      Object.entries(categorizedTools).forEach(([category, toolsInCategory]) => {
        results.push({
          category,
          tools: toolsInCategory,
          totalCount: toolsInCategory.length
        });
      });
    } catch (error) {
      console.error('Error scraping Future Tools:', error);
    }

    return results;
  }

  private mergeAndDeduplicateResults(results: ScrapingResult[]): ScrapingResult[] {
    const merged: { [key: string]: AITool[] } = {};

    results.forEach(result => {
      if (!merged[result.category]) {
        merged[result.category] = [];
      }
      merged[result.category].push(...result.tools);
    });

    // 중복 제거 (이름 기준)
    const deduplicated = Object.entries(merged).map(([category, tools]) => {
      const uniqueTools = tools.filter((tool, index, self) => 
        index === self.findIndex(t => t.name.toLowerCase() === tool.name.toLowerCase())
      );

      return {
        category,
        tools: uniqueTools,
        totalCount: uniqueTools.length
      };
    });

    return deduplicated;
  }

  // 특정 카테고리만 스크래핑
  async scrapeCategory(category: string): Promise<ScrapingResult | null> {
    const allResults = await this.scrapeFromMultipleSources();
    return allResults.find(result => 
      result.category.toLowerCase().includes(category.toLowerCase())
    ) || null;
  }

  // 샘플 데이터 생성 (개발용)
  async generateSampleData(): Promise<ScrapingResult[]> {
    return [
      {
        category: '콘텐츠 창작',
        tools: [
          {
            name: 'ChatGPT',
            description: '대화형 AI로 다양한 텍스트 생성 및 질문 답변',
            category: '콘텐츠 창작',
            url: 'https://chat.openai.com',
            pricing: 'Free / $20/month',
            rating: 4.8,
            tags: ['텍스트 생성', '대화', 'AI 어시스턴트']
          },
          {
            name: 'Midjourney',
            description: '텍스트 프롬프트로 고품질 이미지 생성',
            category: '콘텐츠 창작',
            url: 'https://midjourney.com',
            pricing: '$10-60/month',
            rating: 4.9,
            tags: ['이미지 생성', '아트', '디자인']
          },
          {
            name: 'Jasper',
            description: '마케팅 및 콘텐츠 제작을 위한 AI 글쓰기 도구',
            category: '콘텐츠 창작',
            url: 'https://jasper.ai',
            pricing: '$49-125/month',
            rating: 4.7,
            tags: ['마케팅', '콘텐츠 제작', '글쓰기']
          }
        ],
        totalCount: 3
      },
      {
        category: '업무 생산성',
        tools: [
          {
            name: 'Notion AI',
            description: '노션 내에서 AI 글쓰기 및 정리 지원',
            category: '업무 생산성',
            url: 'https://notion.so',
            pricing: '$10/month',
            rating: 4.6,
            tags: ['문서 작성', '정리', '협업']
          },
          {
            name: 'Grammarly',
            description: 'AI 기반 문법 검사 및 글쓰기 도우미',
            category: '업무 생산성',
            url: 'https://grammarly.com',
            pricing: 'Free / $12-15/month',
            rating: 4.5,
            tags: ['문법 검사', '글쓰기', '교정']
          }
        ],
        totalCount: 2
      },
      {
        category: '개발 코딩',
        tools: [
          {
            name: 'GitHub Copilot',
            description: 'AI 페어 프로그래밍 도구',
            category: '개발 코딩',
            url: 'https://github.com/features/copilot',
            pricing: '$10/month',
            rating: 4.4,
            tags: ['코드 생성', '프로그래밍', '자동완성']
          },
          {
            name: 'Cursor',
            description: 'AI 통합 코드 에디터',
            category: '개발 코딩',
            url: 'https://cursor.sh',
            pricing: 'Free / $20/month',
            rating: 4.6,
            tags: ['코드 에디터', 'AI 코딩', '개발도구']
          }
        ],
        totalCount: 2
      }
    ];
  }
}