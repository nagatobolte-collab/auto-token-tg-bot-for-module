export const REGEX = {

    LICENSE:
        /^AUTO-TOKEN-BOT[A-Z]-[A-Z0-9]{8}$/,

    FIREBASE_DATABASE:
        /^https:\/\/.*\.firebasedatabase\.app\/?$/,

    FIREBASE_IO:
        /^https:\/\/.*\.firebaseio\.com\/?$/,

    FIREBASE_JSON:
        /"project_id"\s*:/,

    VPS_URL:
        /^https?:\/\/.+$/i,

    DEVICE_ID:
        /^[a-zA-Z0-9]{16,32}$/,

    ZYGISK_KEY:
        /^KEY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i

};