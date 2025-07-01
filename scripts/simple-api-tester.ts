#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

interface EndpointTest {
  endpoint: string;
  method: string;
  description: string;
  parameters: {
    path?: Record<string, any>;
    query?: Record<string, any>;
    body?: any;
    files?: Record<string, string>;
  };
  requiresAuth: boolean;
  responseWithAuth?: any;
  responseWithoutAuth?: any;
  actualInputs?: string[];
  actualOutputs?: any;
  status: 'success' | 'error' | 'auth_required';
  errorMessage?: string;
}

interface APITestReport {
  timestamp: string;
  baseUrl: string;
  totalEndpoints: number;
  testedEndpoints: number;
  authToken?: string;
  endpoints: EndpointTest[];
  summary: {
    publicEndpoints: number;
    authRequiredEndpoints: number;
    workingEndpoints: number;
    errorEndpoints: number;
  };
}

class SimpleAPITester {
  private baseUrl: string;
  private spec: any = null;
  private authToken: string | null = null;
  private testResults: APITestReport;
  private testImagePath: string;
  private testVideoPath: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.testImagePath = path.join(process.cwd(), 'scripts', 'test-files', 'test-image.png');
    this.testVideoPath = path.join(process.cwd(), 'scripts', 'test-files', 'test-video.mp4');
    
    this.testResults = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      totalEndpoints: 0,
      testedEndpoints: 0,
      endpoints: [],
      summary: {
        publicEndpoints: 0,
        authRequiredEndpoints: 0,
        workingEndpoints: 0,
        errorEndpoints: 0
      }
    };
  }

  async loadOpenAPISpec(): Promise<void> {
    console.log('🔍 Загружаем OpenAPI спецификацию...');
    
    try {
      // Пробуем загрузить спецификацию с FastAPI docs
      const docsUrl = 'https://youtube-jfmi.onrender.com/fastapi/loyiha/youtube/clone';
      console.log(`📄 Загружаем документацию из: ${docsUrl}`);
      
      const response = await fetch(docsUrl);
      const text = await response.text();
      
      // Ищем JSON spec в HTML странице
      const jsonMatch = text.match(/\{"openapi":"3\.1\.0".*?\}\}$/);
      if (jsonMatch) {
        this.spec = JSON.parse(jsonMatch[0]);
        console.log(`✅ Спецификация загружена: ${this.spec.info?.title} v${this.spec.info?.version}`);
        console.log(`📋 Найдено ${Object.keys(this.spec.paths || {}).length} endpoint'ов`);
      } else {
        console.log('⚠️ OpenAPI спецификация не найдена в HTML, создаем базовую...');
        this.spec = await this.createBasicSpec();
      }

      this.testResults.totalEndpoints = Object.keys(this.spec.paths || {}).length;
      
    } catch (error) {
      console.error('❌ Ошибка загрузки спецификации:', error);
      throw error;
    }
  }

  async createBasicSpec(): Promise<any> {
    // Создаем базовую спецификацию с известными endpoint'ами
    return {
      paths: {
        "/user/get_users": { get: { summary: "Получить список пользователей" } },
        "/user/post_user": { post: { summary: "Создать пользователя" } },
        "/user/me": { get: { summary: "Получить текущего пользователя" } },
        "/login/token": { post: { summary: "Получить токен авторизации" } },
        "/video/get_videos": { get: { summary: "Получить список видео" } },
        "/video/post_video": { post: { summary: "Загрузить видео" } },
        "/video/{video_id}": { 
          get: { summary: "Получить видео по ID" },
          put: { summary: "Обновить видео" },
          delete: { summary: "Удалить видео" }
        },
        "/channel/get_channels": { get: { summary: "Получить список каналов" } },
        "/channel/post_channel": { post: { summary: "Создать канал" } },
        "/channel/{channel_id}": { 
          get: { summary: "Получить канал по ID" },
          put: { summary: "Обновить канал" },
          delete: { summary: "Удалить канал" }
        }
      }
    };
  }

  async authenticateUser(): Promise<void> {
    console.log('🔐 Попытка аутентификации...');
    
    try {
      // Сначала попробуем создать тестового пользователя
      const testUser = {
        username: `test_user_${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!'
      };

      console.log('👤 Создаем тестового пользователя...');
      const registerResponse = await fetch(`${this.baseUrl}user/post_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });

      if (registerResponse.ok || registerResponse.status === 409) {
        console.log('✅ Пользователь создан или уже существует');
        
        // Пробуем войти
        console.log('🔑 Входим в систему...');
        const formData = new URLSearchParams();
        formData.append('username', testUser.email);
        formData.append('password', testUser.password);

        const loginResponse = await fetch(`${this.baseUrl}login/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });

        if (loginResponse.ok) {
          const tokenData = await loginResponse.json();
          this.authToken = tokenData.access_token;
          this.testResults.authToken = 'ПОЛУЧЕН';
          console.log('✅ Авторизация успешна');
        } else {
          console.log('⚠️ Не удалось получить токен');
        }
      } else {
        console.log('⚠️ Не удалось создать пользователя');
      }
    } catch (error) {
      console.log('⚠️ Ошибка аутентификации:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async testEndpoint(path: string, method: string, operation: any): Promise<EndpointTest> {
    console.log(`\n🧪 Тестируем ${method.toUpperCase()} ${path}`);
    
    const test: EndpointTest = {
      endpoint: path,
      method: method.toUpperCase(),
      description: operation.summary || operation.description || 'Нет описания',
      parameters: {},
      requiresAuth: false,
      status: 'success'
    };

    // Заменяем path параметры на тестовые значения
    let testPath = path;
    if (path.includes('{')) {
      testPath = path.replace(/{video_id}/g, '1')
                    .replace(/{channel_id}/g, '1')
                    .replace(/{user_id}/g, '1')
                    .replace(/{id}/g, '1');
    }

    try {
      // Тестируем без авторизации
      console.log('  📝 Тест без авторизации...');
      const responseWithoutAuth = await this.makeRequest(testPath, method, null);
      test.responseWithoutAuth = {
        status: responseWithoutAuth.status,
        data: responseWithoutAuth.data,
        success: responseWithoutAuth.status < 400
      };

      // Если получили 401, значит требует авторизации
      if (responseWithoutAuth.status === 401) {
        test.requiresAuth = true;
        console.log('  🔒 Требует авторизацию');
      }

      // Тестируем с авторизацией если есть токен
      if (this.authToken) {
        console.log('  🔐 Тест с авторизацией...');
        const responseWithAuth = await this.makeRequest(testPath, method, this.authToken);
        test.responseWithAuth = {
          status: responseWithAuth.status,
          data: responseWithAuth.data,
          success: responseWithAuth.status < 400
        };

        // Если без токена 401, а с токеном работает - значит требует авторизацию
        if (test.responseWithoutAuth.status === 401 && responseWithAuth.status !== 401) {
          test.requiresAuth = true;
        }
      }

      // Определяем входные параметры
      test.actualInputs = this.determineInputs(path, method);
      
      // Определяем что возвращает
      const workingResponse = test.responseWithAuth?.success ? test.responseWithAuth : test.responseWithoutAuth;
      if (workingResponse?.success) {
        test.actualOutputs = workingResponse.data;
        test.status = 'success';
      } else if (test.responseWithoutAuth.status === 401) {
        test.status = 'auth_required';
      } else {
        test.status = 'error';
        test.errorMessage = workingResponse?.data?.detail || 'Ошибка запроса';
      }

    } catch (error) {
      test.status = 'error';
      test.errorMessage = error instanceof Error ? error.message : 'Сетевая ошибка';
      console.log(`  ❌ Ошибка: ${test.errorMessage}`);
    }

    return test;
  }

  async makeRequest(path: string, method: string, authToken: string | null): Promise<{status: number, data: any}> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log(`    🔑 Используем токен: ${authToken.slice(0, 20)}...`);
    } else {
      console.log(`    🌐 Запрос без авторизации`);
    }

    const options: RequestInit = {
      method: method.toUpperCase(),
      headers
    };

    // Для POST/PUT запросов добавляем тестовые данные
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      const testData = this.generateTestData(path, method);
      
      if (testData.isFile) {
        // Для файловых загрузок
        const formData = new FormData();
        
        // Определяем тип файла и добавляем соответствующий файл
        if (path.includes('video') || path.includes('shorts')) {
          if (fs.existsSync(this.testVideoPath)) {
            const videoBuffer = fs.readFileSync(this.testVideoPath);
            const videoBlob = new Blob([videoBuffer], { type: 'video/mp4' });
            
            // Разные endpoint'ы ожидают разные имена полей
            if (path.includes('shorts')) {
              formData.append('video', videoBlob, 'test-video.mp4');
            } else {
              formData.append('vidyo', videoBlob, 'test-video.mp4'); // видео endpoint использует 'vidyo'
            }
          }
        } else if (path.includes('image') || path.includes('profile') || path.includes('banner')) {
          if (fs.existsSync(this.testImagePath)) {
            const imageBuffer = fs.readFileSync(this.testImagePath);
            const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
            formData.append('image', imageBlob, 'test-image.png');
          }
        }

        // Добавляем дополнительные поля для video upload
        if (path.includes('/video/post_video')) {
          formData.append('title', testData.data.title);
          formData.append('description', testData.data.description);
          formData.append('category', testData.data.category);
        }

        options.body = formData;
        // Не устанавливаем Content-Type для FormData - браузер установит автоматически с boundary
      } else {
        // Для JSON данных
        if (path.includes('/login/token')) {
          // Для login endpoint используем form-urlencoded
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
          const formData = new URLSearchParams();
          Object.entries(testData.data).forEach(([key, value]) => {
            formData.append(key, String(value));
          });
          options.body = formData;
        } else {
          // Для остальных endpoint'ов используем JSON
          headers['Content-Type'] = 'application/json';
          options.body = JSON.stringify(testData.data);
        }
      }
    }

    try {
      const response = await fetch(url, options);
      
      let data;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      } catch {
        data = await response.text();
      }

      return { status: response.status, data };
    } catch (error) {
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateTestData(path: string, method: string): {data: any, isFile: boolean} {
    const isFile = path.includes('video') || path.includes('image') || path.includes('shorts') ||
                   path.includes('profile') || path.includes('banner') || path.includes('upload');

    // Пользователи
    if (path.includes('/user/post_user')) {
      return {
        data: {
          username: `testuser${Date.now()}`,
          email: `test${Date.now()}@example.com`,
          password: 'TestPassword123!'
        },
        isFile: false
      };
    }

    if (path.includes('/user/post_image') || path.includes('/user/put_image')) {
      return {
        data: {},
        isFile: true
      };
    }

    // Каналы
    if (path.includes('/channel/post_channel')) {
      return {
        data: {
          name: `Test Channel ${Date.now()}`,
          description: 'Test channel description'
        },
        isFile: false
      };
    }

    if (path.includes('/channel/post_profile_image') || path.includes('/channel/put_profile_image')) {
      return { data: {}, isFile: true };
    }

    if (path.includes('/channel/post_banner_image') || path.includes('/channel/put_banner_image')) {
      return { data: {}, isFile: true };
    }

    // Видео
    if (path.includes('/video/post_video')) {
      return {
        data: {
          title: `Test Video ${Date.now()}`,
          description: 'Test video description',
          category: 'Texnologiya'
        },
        isFile: true
      };
    }

    if (path.includes('/video/put_video')) {
      return {
        data: {
          title: `Updated Video ${Date.now()}`,
          description: 'Updated video description',
          category: 'Ta\'lim'
        },
        isFile: false
      };
    }

    // Shorts
    if (path.includes('/shorts/post_shorts')) {
      return {
        data: {},
        isFile: true
      };
    }

    // Подписки
    if (path.includes('/subscription/post_subscription')) {
      return {
        data: { channel_id: 1 },
        isFile: false
      };
    }

    // Лайки
    if (path.includes('/like/post_like')) {
      return {
        data: { 
          video_id: 1,
          is_like: true
        },
        isFile: false
      };
    }

    // Комментарии
    if (path.includes('/comment/post_comment')) {
      return {
        data: {
          video_id: 1,
          comment: 'Test comment'
        },
        isFile: false
      };
    }

    // История
    if (path.includes('/history/post_histor')) {
      return {
        data: { video_id: 1 },
        isFile: false
      };
    }

    // Плейлисты
    if (path.includes('/playlist/post_playlist')) {
      return {
        data: {
          name: `Test Playlist ${Date.now()}`,
          is_personal: true
        },
        isFile: false
      };
    }

    if (path.includes('/playlist_video')) {
      return {
        data: {
          playlist_id: 1,
          video_id: 1
        },
        isFile: false
      };
    }

    // Авторизация
    if (path.includes('/login/token')) {
      return {
        data: {
          username: 'test@example.com',
          password: 'testpass123'
        },
        isFile: false
      };
    }

    if (path.includes('/login/refresh_token')) {
      return {
        data: {
          refresh_token: 'fake_refresh_token'
        },
        isFile: false
      };
    }

    return {
      data: {
        name: 'Test Data',
        description: 'Test description'
      },
      isFile: false
    };
  }

  determineInputs(path: string, method: string): string[] {
    const inputs: string[] = [];

    // Path параметры
    if (path.includes('{')) {
      const pathParams = path.match(/{([^}]+)}/g);
      if (pathParams) {
        inputs.push(...pathParams.map(p => `Path: ${p}`));
      }
    }

    // Query параметры из спецификации
    if (path.includes('/video/get_video')) {
      inputs.push('Query: ident (ID видео, опционально)', 'Query: category (категория, опционально)');
    } else if (path.includes('/channel/get_channel')) {
      inputs.push('Query: name (имя канала, опционально)');
    } else if (path.includes('/subscription/delete_subscription')) {
      inputs.push('Query: ident (ID подписки, обязательно)');
    } else if (path.includes('/video/delete_video')) {
      inputs.push('Query: video_id (ID видео, обязательно)');
    } else if (path.includes('/comment/delete_comment')) {
      inputs.push('Query: comment_id (ID комментария, обязательно)');
    } else if (path.includes('/history/delete_history')) {
      inputs.push('Query: ident (ID истории, обязательно)');
    } else if (path.includes('/playlist/delete_playlist')) {
      inputs.push('Query: ident (ID плейлиста, обязательно)');
    } else if (path.includes('/playlist_video/delete_playlist_video')) {
      inputs.push('Query: ident (ID видео в плейлисте, обязательно)');
    } else if (path.includes('/shorts/delete_shorts')) {
      inputs.push('Query: ident (ID shorts, обязательно)');
    } else if (path.includes('/like/delete_like')) {
      inputs.push('Query: ident (ID лайка, обязательно)');
    }

    // Body параметры для POST/PUT
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      if (path.includes('/user/post_user') || path.includes('/user/put_user')) {
        inputs.push('Body: username (строка)', 'Body: email (email)', 'Body: password (строка)');
      } else if (path.includes('/user/post_image') || path.includes('/user/put_image')) {
        inputs.push('File: image (изображение, обязательно)');
      } else if (path.includes('/channel/post_channel') || path.includes('/channel/put_channel')) {
        inputs.push('Body: name (строка)', 'Body: description (строка)');
      } else if (path.includes('/channel') && path.includes('image')) {
        inputs.push('File: image (изображение, обязательно)');
      } else if (path.includes('/video/post_video')) {
        inputs.push('File: vidyo (видеофайл, обязательно)', 'Body: title (строка)', 'Body: description (строка)', 'Body: category (enum)');
      } else if (path.includes('/video/put_video')) {
        inputs.push('Body: title (строка)', 'Body: description (строка)', 'Body: category (enum)');
      } else if (path.includes('/shorts/post_shorts')) {
        inputs.push('File: video (видеофайл, обязательно)');
      } else if (path.includes('/subscription/post_subscription')) {
        inputs.push('Body: channel_id (число)');
      } else if (path.includes('/like/post_like')) {
        inputs.push('Body: video_id (число)', 'Body: is_like (boolean)');
      } else if (path.includes('/comment/post_comment') || path.includes('/comment/put_comment')) {
        inputs.push('Body: video_id (число)', 'Body: comment (строка)');
      } else if (path.includes('/history/post_histor')) {
        inputs.push('Body: video_id (число)');
      } else if (path.includes('/playlist/post_playlist') || path.includes('/playlist/put_playlist')) {
        inputs.push('Body: name (строка)', 'Body: is_personal (boolean)');
      } else if (path.includes('/playlist_video')) {
        inputs.push('Body: playlist_id (число)', 'Body: video_id (число)');
      } else if (path.includes('/login/token')) {
        inputs.push('Body: username (строка)', 'Body: password (строка)', 'Body: grant_type (опционально)');
      } else if (path.includes('/login/refresh_token')) {
        inputs.push('Body: refresh_token (строка)');
      } else {
        inputs.push('Body: JSON data');
      }
    }

    if (inputs.length === 0) {
      inputs.push('Нет входных параметров');
    }

    return inputs;
  }

  async runCompleteTest(): Promise<void> {
    console.log('🚀 Запуск полного тестирования API...\n');

    try {
      await this.loadOpenAPISpec();
      await this.authenticateUser();

      const endpoints = this.getEndpointsFromSpec();
      
      // Подсчитываем DELETE операции для предупреждения
      const deleteEndpoints = endpoints.filter(e => e.method === 'delete');
      const deleteUserEndpoints = endpoints.filter(e => e.method === 'delete' && e.path.includes('/user/delete_user'));
      const otherDeleteEndpoints = endpoints.filter(e => e.method === 'delete' && !e.path.includes('/user/delete_user'));
      const nonDeleteCount = endpoints.length - deleteEndpoints.length;
      const otherDeleteStartIndex = nonDeleteCount;
      const deleteUserStartIndex = nonDeleteCount + otherDeleteEndpoints.length;

      console.log(`📋 Будет протестировано ${endpoints.length} endpoint'ов (${nonDeleteCount} обычных + ${otherDeleteEndpoints.length} DELETE + ${deleteUserEndpoints.length} DELETE user)\n`);

      for (let i = 0; i < endpoints.length; i++) {
        const { path, method, operation } = endpoints[i];
        
        // Предупреждение перед DELETE операциями
        if (method === 'delete' && i === otherDeleteStartIndex && otherDeleteEndpoints.length > 0) {
          console.log('\n⚠️  ВНИМАНИЕ: Начинаем тестирование DELETE операций');
          console.log('   Эти операции могут удалить тестовые данные\n');
        }
        
        // Предупреждение перед удалением пользователя
        if (method === 'delete' && i === deleteUserStartIndex && deleteUserEndpoints.length > 0) {
          console.log('\n🚨 КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ: Тестируем DELETE /user/delete_user');
          console.log('   Эта операция удалит тестового пользователя и сделает токен недействительным!\n');
        }
        
        const test = await this.testEndpoint(path, method, operation);
        this.testResults.endpoints.push(test);
        this.testResults.testedEndpoints++;

        // Обновляем статистику
        if (test.requiresAuth) {
          this.testResults.summary.authRequiredEndpoints++;
        } else {
          this.testResults.summary.publicEndpoints++;
        }

        if (test.status === 'success') {
          this.testResults.summary.workingEndpoints++;
        } else {
          this.testResults.summary.errorEndpoints++;
        }

        // Небольшая пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      await this.saveResults();
      this.printSummary();

    } catch (error) {
      console.error('💥 Ошибка тестирования:', error);
      throw error;
    }
  }

  getEndpointsFromSpec(): Array<{path: string, method: string, operation: any}> {
    const endpoints: Array<{path: string, method: string, operation: any}> = [];
    
    // Сначала собираем все endpoint'ы
    const allEndpoints: Array<{path: string, method: string, operation: any}> = [];
    
    for (const [path, pathItem] of Object.entries(this.spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem as any)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          allEndpoints.push({ path, method, operation });
        }
      }
    }

    // Разделяем на DELETE и остальные
    const deleteEndpoints = allEndpoints.filter(e => e.method === 'delete');
    const otherEndpoints = allEndpoints.filter(e => e.method !== 'delete');

    // Отделяем DELETE /user/delete_user от остальных DELETE операций
    const deleteUserEndpoint = deleteEndpoints.filter(e => e.path.includes('/user/delete_user'));
    const otherDeleteEndpoints = deleteEndpoints.filter(e => !e.path.includes('/user/delete_user'));

    // Сначала добавляем все не-DELETE операции
    endpoints.push(...otherEndpoints);
    
    // Затем добавляем остальные DELETE операции
    endpoints.push(...otherDeleteEndpoints);
    
    // В самом конце добавляем DELETE /user/delete_user (он сделает токен недействительным)
    endpoints.push(...deleteUserEndpoint);

    return endpoints;
  }

  async saveResults(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(process.cwd(), 'api-analysis');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // JSON отчет
    const jsonPath = path.join(outputDir, `simple-api-test-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(this.testResults, null, 2));

    // Markdown отчет
    const markdownPath = path.join(outputDir, `api-test-report-${timestamp}.md`);
    const report = this.generateMarkdownReport();
    fs.writeFileSync(markdownPath, report);

    console.log(`\n📄 Отчеты сохранены:`);
    console.log(`  - JSON: ${jsonPath}`);
    console.log(`  - Markdown: ${markdownPath}`);
  }

  generateMarkdownReport(): string {
    const results = this.testResults;
    
    let report = `# Отчет о тестировании API\n\n`;
    report += `**Дата тестирования:** ${results.timestamp}\n`;
    report += `**API URL:** ${results.baseUrl}\n`;
    report += `**Авторизация:** ${results.authToken ? 'Получена' : 'Не получена'}\n\n`;

    // Общая статистика
    report += `## 📊 Общая статистика\n\n`;
    report += `- **Всего endpoint'ов:** ${results.totalEndpoints}\n`;
    report += `- **Протестировано:** ${results.testedEndpoints}\n`;
    report += `- **Публичных (без авторизации):** ${results.summary.publicEndpoints}\n`;
    report += `- **Требуют авторизацию:** ${results.summary.authRequiredEndpoints}\n`;
    report += `- **Работающих:** ${results.summary.workingEndpoints}\n`;
    report += `- **С ошибками:** ${results.summary.errorEndpoints}\n\n`;

    // Проблемные endpoint'ы в начале отчета
    const errorEndpoints = results.endpoints.filter(e => e.status === 'error');
    if (errorEndpoints.length > 0) {
      report += `## 🚨 Проблемные endpoint'ы\n\n`;
      report += `Найдено ${errorEndpoints.length} endpoint'ов с ошибками:\n\n`;
      
      errorEndpoints.forEach(endpoint => {
        const authLabel = endpoint.requiresAuth ? '🔒' : '🌐';
        report += `- ${authLabel} **${endpoint.method} ${endpoint.endpoint}** - ${endpoint.description}\n`;
        
        if (endpoint.errorMessage) {
          report += `  - Ошибка: ${endpoint.errorMessage}\n`;
        }
        
        if (endpoint.responseWithoutAuth && !endpoint.responseWithoutAuth.success) {
          report += `  - Без авторизации: ${endpoint.responseWithoutAuth.data?.detail || endpoint.responseWithoutAuth.data?.message || 'Неизвестная ошибка'}\n`;
        }
        
        if (endpoint.responseWithAuth && !endpoint.responseWithAuth.success) {
          report += `  - С авторизацией: ${endpoint.responseWithAuth.data?.detail || endpoint.responseWithAuth.data?.message || 'Неизвестная ошибка'}\n`;
        }
        
        report += `\n`;
      });
      report += `\n`;
    }

    // Детальный анализ по endpoint'ам
    report += `## 📋 Детальный анализ endpoint'ов\n\n`;

    for (const endpoint of results.endpoints) {
      report += `### ${endpoint.method} ${endpoint.endpoint}\n\n`;
      report += `**Описание:** ${endpoint.description}\n\n`;
      
      // Входные параметры
      report += `**Входные параметры:**\n`;
      if (endpoint.actualInputs && endpoint.actualInputs.length > 0) {
        endpoint.actualInputs.forEach(input => {
          report += `- ${input}\n`;
        });
      } else {
        report += `- Нет параметров\n`;
      }
      report += `\n`;

      // Требует ли авторизацию
      report += `**Авторизация:** ${endpoint.requiresAuth ? '🔒 Обязательна' : '🌐 Не требуется'}\n\n`;

      // Ответы
      if (endpoint.responseWithoutAuth) {
        report += `**Ответ БЕЗ авторизации:**\n`;
        report += `- Статус: ${endpoint.responseWithoutAuth.status}\n`;
        if (endpoint.responseWithoutAuth.success) {
          report += `- Результат: ✅ Успех\n`;
          if (typeof endpoint.responseWithoutAuth.data === 'object') {
            const dataStr = JSON.stringify(endpoint.responseWithoutAuth.data, null, 2);
            if (dataStr.length > 200) {
              report += `- Данные: \`\`\`json\n${dataStr.slice(0, 500)}...\n\`\`\`\n`;
            } else {
              report += `- Данные: \`\`\`json\n${dataStr}\n\`\`\`\n`;
            }
          }
        } else {
          report += `- Результат: ❌ Ошибка\n`;
          report += `- Ошибка: ${endpoint.responseWithoutAuth.data?.detail || endpoint.responseWithoutAuth.data?.message || 'Нет деталей'}\n`;
        }
        report += `\n`;
      }

      if (endpoint.responseWithAuth) {
        report += `**Ответ С авторизацией:**\n`;
        report += `- Статус: ${endpoint.responseWithAuth.status}\n`;
        if (endpoint.responseWithAuth.success) {
          report += `- Результат: ✅ Успех\n`;
          if (typeof endpoint.responseWithAuth.data === 'object') {
            const dataStr = JSON.stringify(endpoint.responseWithAuth.data, null, 2);
            if (dataStr.length > 200) {
              report += `- Данные: \`\`\`json\n${dataStr.slice(0, 500)}...\n\`\`\`\n`;
            } else {
              report += `- Данные: \`\`\`json\n${dataStr}\n\`\`\`\n`;
            }
          }
        } else {
          report += `- Результат: ❌ Ошибка\n`;
          report += `- Ошибка: ${endpoint.responseWithAuth.data?.detail || endpoint.responseWithAuth.data?.message || 'Нет деталей'}\n`;
        }
        report += `\n`;
      }

      // Общий статус
      let statusIcon = '';
      switch (endpoint.status) {
        case 'success': statusIcon = '✅'; break;
        case 'auth_required': statusIcon = '🔒'; break;
        case 'error': statusIcon = '❌'; break;
      }
      
      report += `**Общий статус:** ${statusIcon} ${endpoint.status.toUpperCase()}\n`;
      if (endpoint.errorMessage) {
        report += `**Ошибка:** ${endpoint.errorMessage}\n`;
      }
      
      report += `\n---\n\n`;
    }

    // Выводы и рекомендации
    report += `## 🎯 Выводы и рекомендации\n\n`;
    
    // Успешные endpoint'ы
    const successfulEndpoints = results.endpoints.filter(e => e.status === 'success');
    if (successfulEndpoints.length > 0) {
      report += `✅ **Рабочие endpoint'ы (${successfulEndpoints.length}):**\n`;
      successfulEndpoints.forEach(endpoint => {
        const authLabel = endpoint.requiresAuth ? '🔒' : '🌐';
        report += `- ${authLabel} ${endpoint.method} ${endpoint.endpoint} - ${endpoint.description}\n`;
      });
      report += `\n`;
    }
    
    if (results.summary.errorEndpoints > 0) {
      report += `⚠️ **Найдено ${results.summary.errorEndpoints} endpoint'ов с ошибками** - требуется проверка api-client.ts\n\n`;
    }
    
    if (results.summary.authRequiredEndpoints > 0) {
      report += `🔒 **${results.summary.authRequiredEndpoints} endpoint'ов требуют авторизацию** - убедитесь что api-client.ts правильно обрабатывает токены\n\n`;
    }
    
    if (!results.authToken) {
      report += `⚠️ **Не удалось получить токен авторизации** - проверьте настройки аутентификации в api-config.ts\n\n`;
    } else {
      report += `✅ **Авторизация работает корректно** - токен получен и передается в заголовках\n\n`;
    }

    // Анализ проблем
    const userNotFoundErrors = results.endpoints.filter(e => 
      e.responseWithAuth?.data?.detail?.includes('User not found') || 
      e.responseWithoutAuth?.data?.detail?.includes('User not found')
    ).length;
    
    if (userNotFoundErrors > 0) {
      report += `🚨 **Обнаружена системная проблема:** ${userNotFoundErrors} endpoint'ов возвращают "User not found"\n`;
      report += `Это указывает на проблемы с базой данных или логикой сервера, не связанные с клиентом.\n\n`;
    }

    report += `### Рекомендации по улучшению api-client.ts:\n\n`;
    report += `1. Добавить обработку всех найденных статус-кодов\n`;
    report += `2. Улучшить типизацию для каждого endpoint'а\n`;
    report += `3. Добавить валидацию входных параметров\n`;
    report += `4. Реализовать автоматическое обновление токенов\n\n`;

    return report;
  }

  printSummary(): void {
    const results = this.testResults;
    console.log(`\n🎉 Тестирование завершено!`);
    console.log(`\n📊 Результаты:`);
    console.log(`  📋 Протестировано: ${results.testedEndpoints}/${results.totalEndpoints} endpoint'ов`);
    console.log(`  🌐 Публичных: ${results.summary.publicEndpoints}`);
    console.log(`  🔒 Требуют авторизацию: ${results.summary.authRequiredEndpoints}`);
    console.log(`  ✅ Работают: ${results.summary.workingEndpoints}`);
    console.log(`  ❌ Ошибки: ${results.summary.errorEndpoints}`);
    console.log(`  🔐 Авторизация: ${results.authToken ? 'Успешно получена' : 'Не получена'}`);
  }
}

// Запуск
async function main() {
  const baseUrl = 'https://youtube-jfmi.onrender.com/';
  const tester = new SimpleAPITester(baseUrl);
  await tester.runCompleteTest();
}

if (require.main === module) {
  main().catch(console.error);
}

export { SimpleAPITester };
