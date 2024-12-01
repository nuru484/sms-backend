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
};

export default ENV;
