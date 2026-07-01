export const API_CONFIG = {
  BASE_URL: 'https://hospitalback-clean.onrender.com/api',
  TIMEOUT: 30000,
  
  // Cache TTL (Time To Live) in milliseconds
  TTL: {
    BLOG: 5 * 60 * 1000,      // 5 minutes
    PERSONAL: 2 * 60 * 1000,  // 2 minutes
    LIST: 3 * 60 * 1000,      // 3 minutes
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
};

export const APP_CONFIG = {
  APP_NAME: 'Lumen Health',
  APP_TAGLINE: 'Adeola Odeku Street, Victoria Island, Lagos',
  CONTACT_PHONE: '08083734008',
  CONTACT_EMAIL: 'hello@lumen.com',
  ADDRESS: 'No 15 Adeola Odeku Street, Victoria Island, Lagos State, Nigeria',
  
  SOCIAL_MEDIA: {
    FACEBOOK: 'https://facebook.com/ethaatlantic',
    TWITTER: 'https://twitter.com/ethaatlantic',
    INSTAGRAM: 'https://instagram.com/ethaatlantic',
  },
};

export default { API_CONFIG, STORAGE_KEYS, APP_CONFIG };