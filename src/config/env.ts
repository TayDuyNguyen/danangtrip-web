export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "DaNangTrip",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    baseUrl: process.env.API_BASE_URL || "http://localhost:3000",
  },
  env: process.env.NODE_ENV || "development",
  
  // Firebase config
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
};

export const isDevelopment = config.env === "development";
export const isProduction = config.env === "production";
export const isTest = config.env === "test";
