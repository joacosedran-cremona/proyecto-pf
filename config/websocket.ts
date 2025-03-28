export const WS_CONFIG = {
    MAX_RETRIES: 5,
    RETRY_DELAY: 3000,
    HOST: process.env.NEXT_PUBLIC_WS_HOST || 'localhost',
    PORT: process.env.NEXT_PUBLIC_WS_PORT || '8000'
};