export interface Device {

    backendId: number;

    deviceId: string;

    deviceName: string;

    phoneNumber?: string;

    model?: string;

    androidVersion?: string;

    battery: number;

    simCount: number;

    status: string;

    lastSeen?: string;

}