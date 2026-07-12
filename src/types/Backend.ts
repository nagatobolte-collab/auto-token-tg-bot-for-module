export interface Backend {

    id?: number;

    telegramId: number;

    backendType: string;

    backendIdentifier: string;

    config: string;

    status?: string;

    lastSync?: string;

    createdAt?: string;

}