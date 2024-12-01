// src/repositories/momoApiUserRespository.js
import prisma from '../../prismaClient.js';
import { CustomError } from '../utils/middleware/errorHandler.js';

const momoApiUserDetails = async (referenceId, apiKey) => {
  try {
    let transaction = await prisma.momoUser.findFirst();

    if (!transaction) {
      transaction = await prisma.momoUser.create({
        data: { referenceId, apiKey },
      });
    }

    return transaction;
  } catch (error) {
    throw new CustomError(500, `Database error: ${error.message}`);
  }
};

export { momoApiUserDetails };
