import {
  createAttendanceDetails,
  updateAttendanceDetails,
  getAttendanceDetails,
  deleteAttendanceDetails,
  getUserAllAttendanceService,
} from '../../services/attendance/user-attendance-services.js';

/**
 * Controller to create attendance for a user.
 */
export const createUserAttendance = async (req, res, next) => {
  const { userId } = req.params;

  const attendancePayload = Object.assign({}, req.body);

  const recorderId = req.user?.id;

  try {
    const response = await createAttendanceDetails(
      userId,
      attendancePayload,
      recorderId
    );

    return res.status(201).json({
      message: 'Attendance created successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update attendance for a user.
 */
export const updateUserAttendance = async (req, res, next) => {
  const attendanceUpdatePayload = Object.assign({}, req.body);
  const { attendanceId } = req.params;
  const recorderId = req.user?.id; // Assuming `req.user` contains the authenticated user's details

  try {
    const response = await updateAttendanceDetails(
      attendanceId,
      attendanceUpdatePayload,
      recorderId
    );

    return res.status(200).json({
      message: 'Attendance updated successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get attendance details for a user.
 */
export const getUserAttendance = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;

    const response = await getAttendanceDetails(attendanceId);

    return res.status(200).json({
      message: 'Attendance details fetched successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete attendance for a user.
 */
export const deleteUserAttendance = async (req, res, next) => {
  try {
    const { attendanceId } = req.params;

    const response = await deleteAttendanceDetails(attendanceId);

    return res.status(200).json({
      message: 'Attendance deleted successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get all attendance records for a user.
 */
export const getUserAllAttendance = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll === 'true',
      searchQuery: searchQuery || null,
    };

    const response = await getUserAllAttendanceService(userId, options);

    return res.status(200).json({
      message: 'Attendance records fetched successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
