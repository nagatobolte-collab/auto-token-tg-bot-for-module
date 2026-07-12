export interface MessageLog {

    telegramId: number;

    backendId: number;

    deviceId: string;

    deviceModel?: string;

    phoneNumber?: string;

    message: string;

    receivedAt?: string;

}