export const WS_CONFIG = {
    MAX_RETRIES: 10,
    RETRY_DELAY: 1000,
    HOST: process.env.NEXT_PUBLIC_WS_HOST || 'localhost',
    PORT: process.env.NEXT_PUBLIC_WS_PORT || '8000'
};