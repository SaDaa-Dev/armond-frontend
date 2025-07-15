import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface LogLevel {
    DEBUG: 'debug';
    INFO: 'info';
    WARN: 'warn';
    ERROR: 'error';
}

export const LOG_LEVELS: LogLevel = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};

export interface RequestLog {
    timestamp: string;
    method: string;
    url: string;
    headers: Record<string, any>;
    data?: any;
    requestId: string;
}

export interface ResponseLog {
    timestamp: string;
    status: number;
    statusText: string;
    headers: Record<string, any>;
    data?: any;
    duration: number;
    requestId: string;
}

export interface ErrorLog {
    timestamp: string;
    message: string;
    code?: string;
    status?: number;
    data?: any;
    requestId: string;
    duration?: number;
}

class LoggingService {
    private isEnabled: boolean;
    private isDevelopment: boolean;
    private enabledLevels: Set<string>;
    private sensitiveFields: Set<string>;
    private maxDataLength: number;

    constructor() {
        this.isDevelopment = __DEV__;
        this.isEnabled = this.isDevelopment; // 개발 환경에서만 활성화
        this.enabledLevels = new Set([
            LOG_LEVELS.DEBUG,
            LOG_LEVELS.INFO,
            LOG_LEVELS.WARN,
            LOG_LEVELS.ERROR
        ]);
        this.sensitiveFields = new Set([
            'password',
            'token',
            'accessToken',
            'refreshToken',
            'authorization',
            'cookie',
            'secret',
            'key'
        ]);
        this.maxDataLength = 1000; // 로그 데이터 최대 길이
    }

    /**
     * 로깅 설정
     */
    configure(options: {
        enabled?: boolean;
        levels?: string[];
        sensitiveFields?: string[];
        maxDataLength?: number;
    }) {
        if (options.enabled !== undefined) {
            this.isEnabled = options.enabled;
        }
        if (options.levels) {
            this.enabledLevels = new Set(options.levels);
        }
        if (options.sensitiveFields) {
            this.sensitiveFields = new Set(options.sensitiveFields);
        }
        if (options.maxDataLength) {
            this.maxDataLength = options.maxDataLength;
        }
    }

    /**
     * 민감한 데이터 마스킹
     */
    private maskSensitiveData(obj: any): any {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.maskSensitiveData(item));
        }

        const masked = { ...obj };
        Object.keys(masked).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (this.sensitiveFields.has(lowerKey)) {
                const value = masked[key];
                if (typeof value === 'string' && value.length > 8) {
                    masked[key] = `${value.substring(0, 4)}****${value.substring(value.length - 4)}`;
                } else {
                    masked[key] = '****';
                }
            } else if (typeof masked[key] === 'object') {
                masked[key] = this.maskSensitiveData(masked[key]);
            }
        });

        return masked;
    }

    /**
     * 데이터 크기 제한
     */
    private limitDataSize(data: any): any {
        const jsonString = JSON.stringify(data);
        if (jsonString.length <= this.maxDataLength) {
            return data;
        }

        const truncated = jsonString.substring(0, this.maxDataLength);
        return `${truncated}... [truncated]`;
    }

    /**
     * 고유 요청 ID 생성
     */
    generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * 요청 로깅
     */
    logRequest(config: AxiosRequestConfig & { requestId?: string }): void {
        if (!this.isEnabled || !this.enabledLevels.has(LOG_LEVELS.INFO)) {
            return;
        }

        const requestLog: RequestLog = {
            timestamp: new Date().toISOString(),
            method: (config.method || 'GET').toUpperCase(),
            url: config.url || '',
            headers: this.maskSensitiveData(config.headers || {}),
            data: config.data ? this.limitDataSize(this.maskSensitiveData(config.data)) : undefined,
            requestId: config.requestId || 'unknown'
        };

        console.group(`🚀 API Request [${requestLog.requestId}]`);
        console.log(`${requestLog.method} ${requestLog.url}`);
        console.log('Timestamp:', requestLog.timestamp);
        
        if (Object.keys(requestLog.headers).length > 0) {
            console.log('Headers:', requestLog.headers);
        }
        
        if (requestLog.data) {
            console.log('Data:', requestLog.data);
        }
        
        console.groupEnd();
    }

    /**
     * 응답 로깅
     */
    logResponse(response: AxiosResponse, startTime: number): void {
        if (!this.isEnabled || !this.enabledLevels.has(LOG_LEVELS.INFO)) {
            return;
        }

        const duration = Date.now() - startTime;
        const requestId = (response.config as any).requestId || 'unknown';

        const responseLog: ResponseLog = {
            timestamp: new Date().toISOString(),
            status: response.status,
            statusText: response.statusText,
            headers: this.maskSensitiveData(response.headers || {}),
            data: response.data ? this.limitDataSize(this.maskSensitiveData(response.data)) : undefined,
            duration,
            requestId
        };

        const statusColor = response.status >= 400 ? '🔴' : response.status >= 300 ? '🟡' : '🟢';
        
        console.group(`${statusColor} API Response [${requestId}] - ${duration}ms`);
        console.log(`${response.status} ${response.statusText}`);
        console.log('Duration:', `${duration}ms`);
        console.log('Timestamp:', responseLog.timestamp);
        
        if (responseLog.data) {
            console.log('Data:', responseLog.data);
        }
        
        console.groupEnd();
    }

    /**
     * 에러 로깅
     */
    logError(error: AxiosError, startTime?: number): void {
        if (!this.isEnabled || !this.enabledLevels.has(LOG_LEVELS.ERROR)) {
            return;
        }

        const duration = startTime ? Date.now() - startTime : undefined;
        const requestId = (error.config as any)?.requestId || 'unknown';

        const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data ? this.limitDataSize(this.maskSensitiveData(error.response.data)) : undefined,
            requestId,
            duration
        };

        console.group(`❌ API Error [${requestId}]${duration ? ` - ${duration}ms` : ''}`);
        console.error('Message:', errorLog.message);
        console.error('Code:', errorLog.code);
        console.error('Status:', errorLog.status);
        console.error('Timestamp:', errorLog.timestamp);
        
        if (errorLog.data) {
            console.error('Error Data:', errorLog.data);
        }
        
        if (error.config) {
            console.error('Request Config:', {
                method: error.config.method,
                url: error.config.url,
                data: error.config.data ? this.maskSensitiveData(error.config.data) : undefined
            });
        }
        
        console.groupEnd();
    }

    /**
     * 일반 로그
     */
    log(level: string, message: string, data?: any): void {
        if (!this.isEnabled || !this.enabledLevels.has(level)) {
            return;
        }

        const timestamp = new Date().toISOString();
        const emoji = this.getEmojiForLevel(level);
        
        console.group(`${emoji} ${level.toUpperCase()} - ${timestamp}`);
        console.log(message);
        
        if (data) {
            console.log('Data:', this.maskSensitiveData(data));
        }
        
        console.groupEnd();
    }

    /**
     * 로그 레벨별 이모지
     */
    private getEmojiForLevel(level: string): string {
        switch (level) {
            case LOG_LEVELS.DEBUG: return '🐛';
            case LOG_LEVELS.INFO: return 'ℹ️';
            case LOG_LEVELS.WARN: return '⚠️';
            case LOG_LEVELS.ERROR: return '❌';
            default: return '📝';
        }
    }

    /**
     * API 통계 요약 로깅 (옵션)
     */
    logApiSummary(summary: {
        totalRequests: number;
        successRequests: number;
        failedRequests: number;
        averageResponseTime: number;
    }): void {
        if (!this.isEnabled || !this.enabledLevels.has(LOG_LEVELS.INFO)) {
            return;
        }

        console.group('📊 API Usage Summary');
        console.log('Total Requests:', summary.totalRequests);
        console.log('Success Rate:', `${((summary.successRequests / summary.totalRequests) * 100).toFixed(1)}%`);
        console.log('Failed Requests:', summary.failedRequests);
        console.log('Average Response Time:', `${summary.averageResponseTime}ms`);
        console.groupEnd();
    }
}

export const loggingService = new LoggingService(); 