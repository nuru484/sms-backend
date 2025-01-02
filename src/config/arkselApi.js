// src/config/arkselApi.js
import axios from 'axios';
import logger from '../utils/logger.js';
import ENV from './env.js';

const config = {
  method: 'post',
  url: ENV.ARKESEL_SMS_URL,
  headers: {
    'api-key': ENV.ARKESEL_API_KEY,
  },
};

const sendSMS = async ({
  sender = ENV.ARKESEL_SENDER_ID,
  message = 'Welcome, afatech international school.',
  recipients = ['233546488115'],
} = {}) => {
  try {
    const response = await axios({
      ...config,
      data: { sender, message, recipients },
    });
    if (!response.data) {
      throw new Error('No response data received');
    }
    logger.info(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    logger.error('SMS sending failed:', error);
    throw error;
  }
};

export default sendSMS;
