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
};

export const isDevelopment = config.env === "development";
export const isProduction = config.env === "production";
export const isTest = config.env === "test";
