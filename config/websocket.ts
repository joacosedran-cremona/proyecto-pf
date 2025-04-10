export const WS_CONFIG = {
    MAX_RETRIES: 20,
    RETRY_DELAY: 5000,
    HOST: process.env.NEXT_PUBLIC_WS_HOST || 'localhost',
    PORT: process.env.NEXT_PUBLIC_WS_PORT || '8000'
};