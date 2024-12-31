// src/services/users/general-user-services.js
import crypto from 'crypto';
import bcrypt from 'bcrypt'; // Bcrypt for password hashing

import prisma from '../../config/prismaClient.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import transporter from '../../config/nodemailer.js';

// Function to handle forget password
export const processForgetPassword = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new CustomError(404, `User with email ${email}, not found.`);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Use toISOString to convert the date to ISO-8601 format
    await prisma.user.update({
      where: {
        id: parseInt(user.id, 10),
      },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiry: new Date(resetPasswordExpire).toISOString(), // Correct date format
      },
    });

    const resetUrl = `http://localhost:5173/resetpassword/?resetToken=${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please follow this link: ${resetUrl} to reset your password`;

    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: 'wilmer.fahey@ethereal.email', // list of receivers
      subject: 'Reset Password Link', // Subject line
      text: message, // plain text body
    });

    return info;
  } catch (error) {
    handlePrismaError(error, 'health and safety details');
  }
};

// Function to handle reset password
export const processResetPassword = async (resetToken, newPassword) => {
  const user = await prisma.user.findUnique({
    where: {
      resetPasswordToken: resetToken,
    },
  });

  if (!user) {
    throw new CustomError(400, 'Invalid token');
  }

  if (user.resetPasswordTokenExpiry > resetToken > Date.now()) {
    throw new CustomError(400, `Reset token ${resetToken} has expired.`);
  }

  const hashedPassword = newPassword
    ? await bcrypt.hash(newPassword, 10)
    : user.password;

  await prisma.user.update({
    where: {
      resetPasswordToken: resetToken,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordTokenExpiry: undefined,
    },
  });

  return { message: 'Password has been reset successfully.' };
};
