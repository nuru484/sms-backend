import dotenv from 'dotenv';
dotenv.config();

const ENV = {
  MTN_MOMO_TARGET_ENVIRONMENT: process.env.MTN_MOMO_TARGET_ENVIRONMENT,
  Ocp_Apim_Subscription_Key: process.env.Ocp_Apim_Subscription_Key,
  MTN_MOMO_API_USER_URL: process.env.MTN_MOMO_API_USER_URL,
  MTN_MOMO_API_KEY_URL: process.env.MTN_MOMO_API_KEY_URL,
  MTN_MOMO_ACCESS_TOKEN_URL: process.env.MTN_MOMO_ACCESS_TOKEN_URL,
  MTN_MOMO_REQUEST_TO_PAY_URL: process.env.MTN_MOMO_REQUEST_TO_PAY_URL,
  REQUEST_TO_PAY_STATUS_URL: process.env.REQUEST_TO_PAY_STATUS_URL,

  CORS_ACCESS: process.env.CORS_ACCESS,
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECURE: process.env.EMAIL_SECURE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

export default ENV;
