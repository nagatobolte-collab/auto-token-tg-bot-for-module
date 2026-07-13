export interface FirebaseDevice {

    device_id: string;

    note?: string;

    manufacturer?: string;

    brand?: string;

    model?: string;

    android_version?: string;

    battery?: string;

    online?: boolean;

    last_seen?: number;

    network_type?: string;

    sim1_number?: string;

    sim1_carrier?: string;

    sim2_number?: string;

    sim2_carrier?: string;

    active_sim?: number;

}