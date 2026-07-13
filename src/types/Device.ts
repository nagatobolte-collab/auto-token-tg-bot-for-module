export interface Device {

    backendId: number;

    deviceId: string;

    deviceName: string;

    note?: string;

    manufacturer?: string;

    brand?: string;

    model?: string;

    androidVersion?: string;

    phoneNumber?: string;

    sim1Number?: string;

    sim1Carrier?: string;

    sim2Number?: string;

    sim2Carrier?: string;

    activeSim?: number;

    battery: number;

    simCount: number;

    networkType?: string;

    status: string;

    lastSeen?: string;

}