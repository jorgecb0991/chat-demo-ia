//src/types/api.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
        details?: unknown;
    };
    metadata?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}