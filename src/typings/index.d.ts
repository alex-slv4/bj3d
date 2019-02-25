/// <reference path="../../node_modules/@types/facebook-instant-games/index.d.ts" />
/// <reference path="../../node_modules/@types/fpsmeter/index.d.ts" />
/// <reference path="../../node_modules/babylonjs/babylon.d.ts" />

declare const __DEV__: boolean;

declare const process: {
    env: {
        NODE_ENV: string,
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_UPLOAD_PRESET: string,
        SENTRY_DSN: string,
        VERSION: string,
    },
};
