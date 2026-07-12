export interface FirebaseDevice {

    device_id: string;

    model?: string;

    manufacturer?: string;

    android_version?: string;

    battery?: string;

    online?: boolean;

    last_seen?: number;

    note?: string;

    sim1_number?: string;

    sim1_carrier?: string;

    sim2_number?: string;

    sim2_carrier?: string;

}