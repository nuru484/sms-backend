import {
  processForgetPassword,
  processResetPassword,
} from '../../services/users/general-user-services.js';

export const forgetPassword = async (req, res, next) => {
  try {
    const result = await processForgetPassword(req.body.email);

    res.status(200).json({ message: 'Password reset link sent', result });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const { resetToken } = req.query;

    const result = await processResetPassword(resetToken, newPassword);

    res.status(200).json({ message: 'Password has been reset', result });
  } catch (error) {
    next(error);
  }
};
