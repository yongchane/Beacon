import puppeteer from 'puppeteer';
import { AITool, ScrapingResult } from './ai-tools-scraper';

export class SimpleScraper {
  private browser: import('puppeteer').Browser | null = null;

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: false, // 디버깅을 위해 headless를 false로 설정
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--window-size=1920,1080'
        ],
        timeout: 30000
      });
      console.log('🚀 SimpleScraper 브라우저 초기화 성공');
    } catch (error) {
      console.error('❌ SimpleScraper 브라우저 초기화 실패:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ SimpleScraper 브라우저 정상 종료');
    }
  }

  async scrapeGitHubAwesome(): Promise<ScrapingResult[]> {
    if (!this.browser) throw new Error('Browser not initialized');
    
    const page = await this.browser.newPage();
    
    try {
      console.log('🔍 GitHub Awesome AI Tools 스크래핑 시작...');
      
      // GitHub Awesome AI Tools 리포지토리 접근
      await page.goto('https://github.com/mahseema/awesome-ai-tools', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await page.waitForSelector('article');
      await new Promise(resolve => setTimeout(resolve, 3000));

      const tools = await page.evaluate(() => {
        const links = document.querySelectorAll('article a[href^=\"http\"]');
        const toolsData: any[] = [];
        
        links.forEach(link => {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim();
          
          if (href && text && !href.includes('github.com') && !href.includes('mailto:')) {
            const parent = link.parentElement;
            const description = parent?.textContent?.replace(text, '').trim().replace(/^[-•]\s*/, '') || '';
            
            toolsData.push({
              name: text,
              description: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
              url: href,
              pricing: 'Unknown',
              category: 'AI Tools',
              tags: [],
              rating: undefined
            });
          }
        });
        
        return toolsData.slice(0, 20); // 처음 20개만 반환
      });

      console.log(`✅ GitHub에서 ${tools.length}개 AI 도구 수집 완료`);
      
      return [{
        category: 'AI Tools (GitHub)',
        tools: tools,
        totalCount: tools.length
      }];
      
    } catch (error) {
      console.error('❌ GitHub 스크래핑 오류:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  async scrapeProductHunt(): Promise<ScrapingResult[]> {
    if (!this.browser) throw new Error('Browser not initialized');
    
    const page = await this.browser.newPage();
    
    try {
      console.log('🔍 Product Hunt AI 도구 스크래핑 시작...');
      
      // Product Hunt AI 카테고리 접근
      await page.goto('https://www.producthunt.com/topics/artificial-intelligence', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 5000));

      const tools = await page.evaluate(() => {
        const productCards = document.querySelectorAll('[data-test=\"product-item\"]');
        const toolsData: any[] = [];
        
        productCards.forEach((card, index) => {
          if (index >= 15) return; // 최대 15개로 제한
          
          const nameElement = card.querySelector('h3, [data-test=\"product-name\"]');
          const descElement = card.querySelector('p, [data-test=\"product-description\"]');
          const linkElement = card.querySelector('a[href*=\"/posts/\"]');
          
          if (nameElement && descElement) {
            const name = nameElement.textContent?.trim() || '';
            const description = descElement.textContent?.trim() || '';
            const url = linkElement ? `https://www.producthunt.com${linkElement.getAttribute('href')}` : '';
            
            if (name && description) {
              toolsData.push({
                name: name,
                description: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
                url: url,
                pricing: 'Unknown',
                category: 'AI Tools',
                tags: ['Product Hunt', 'AI'],
                rating: undefined
              });
            }
          }
        });
        
        return toolsData;
      });

      console.log(`✅ Product Hunt에서 ${tools.length}개 AI 도구 수집 완료`);
      
      return [{
        category: 'AI Tools (Product Hunt)',
        tools: tools,
        totalCount: tools.length
      }];
      
    } catch (error) {
      console.error('❌ Product Hunt 스크래핑 오류:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  async scrapeAlternativeTo(): Promise<ScrapingResult[]> {
    if (!this.browser) throw new Error('Browser not initialized');
    
    const page = await this.browser.newPage();
    
    try {
      console.log('🔍 AlternativeTo AI 도구 스크래핑 시작...');
      
      // AlternativeTo AI 카테고리 접근
      await page.goto('https://alternativeto.net/category/ai-ml/?sort=likes', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      const tools = await page.evaluate(() => {
        const appCards = document.querySelectorAll('.app-card, .appItem');
        const toolsData: any[] = [];
        
        appCards.forEach((card, index) => {
          if (index >= 20) return; // 최대 20개로 제한
          
          const nameElement = card.querySelector('.app-name a, .appTitle a, h3 a');
          const descElement = card.querySelector('.app-description, .appDescription, p');
          const linkElement = card.querySelector('.app-name a, .appTitle a, h3 a');
          
          if (nameElement) {
            const name = nameElement.textContent?.trim() || '';
            const description = descElement?.textContent?.trim() || '';
            const relativeUrl = linkElement?.getAttribute('href') || '';
            const url = relativeUrl ? `https://alternativeto.net${relativeUrl}` : '';
            
            if (name) {
              toolsData.push({
                name: name,
                description: description.substring(0, 120) + (description.length > 120 ? '...' : ''),
                url: url,
                pricing: 'Unknown',
                category: 'AI Tools',
                tags: ['AlternativeTo', 'AI'],
                rating: undefined
              });
            }
          }
        });
        
        return toolsData;
      });

      console.log(`✅ AlternativeTo에서 ${tools.length}개 AI 도구 수집 완료`);
      
      return [{
        category: 'AI Tools (AlternativeTo)',
        tools: tools,
        totalCount: tools.length
      }];
      
    } catch (error) {
      console.error('❌ AlternativeTo 스크래핑 오류:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  async scrapeAllSources(): Promise<ScrapingResult[]> {
    console.log('🚀 모든 소스에서 AI 도구 스크래핑 시작...');
    
    const allResults: ScrapingResult[] = [];
    
    // GitHub Awesome AI Tools
    try {
      const githubResults = await this.scrapeGitHubAwesome();
      allResults.push(...githubResults);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('GitHub 스크래핑 건너뛰기:', error);
    }
    
    // Product Hunt
    try {
      const phResults = await this.scrapeProductHunt();
      allResults.push(...phResults);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Product Hunt 스크래핑 건너뛰기:', error);
    }
    
    // AlternativeTo
    try {
      const altResults = await this.scrapeAlternativeTo();
      allResults.push(...altResults);
    } catch (error) {
      console.error('AlternativeTo 스크래핑 건너뛰기:', error);
    }
    
    const totalTools = allResults.reduce((sum, result) => sum + result.totalCount, 0);
    console.log(`📊 전체 스크래핑 완료: ${totalTools}개 AI 도구 수집`);
    
    return allResults;
  }
}