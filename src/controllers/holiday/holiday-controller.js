import {
  processCreateHoliday,
  processUpdateHoliday,
  processGetHolidayById,
  processGetHolidays,
  processRemoveHolidayById,
  processRemoveAllHolidays,
} from '../../services/holiday/holiday-services.js';

/**
 * Controller function to handle holiday creation.
 *
 * @param {Object} req - Express request object containing the holiday data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the holiday creation,
 * or forwards the error to centralized error handling middleware.
 */
export const handleCreateHoliday = async (req, res, next) => {
  const holidayData = req.body;

  try {
    const result = await processCreateHoliday(holidayData);

    res.status(201).json({
      message: 'Holiday created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to handle holiday updates.
 *
 * @param {Object} req - Express request object containing holiday data in `req.body` and `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the result of the holiday update,
 * or forwards the error to centralized error handling middleware.
 */
export const handleUpdateHoliday = async (req, res, next) => {
  const { holidayId } = req.params; // Extract holiday ID from request parameters
  const updateData = req.body; // Extract update data from request body

  try {
    const updatedHoliday = await processUpdateHoliday(holidayId, updateData);

    res.status(200).json({
      message: 'Holiday updated successfully',
      data: updatedHoliday,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single holiday by ID.
 */
export const handleGetHolidayById = async (req, res, next) => {
  const { holidayId } = req.params;

  try {
    const holiday = await processGetHolidayById(holidayId);

    res.status(200).json({
      message: 'Holiday fetched successfully',
      data: holiday,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all holidays with pagination and search.
 */
export const handleGetHolidays = async (req, res, next) => {
  try {
    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll ? fetchAll === 'true' : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const result = await processGetHolidays(options);

    res.status(200).json({
      message: 'Holidays fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single holiday by ID.
 */
export const handleDeleteHolidayById = async (req, res, next) => {
  const { holidayId } = req.params;

  try {
    const deletedHoliday = await processRemoveHolidayById(holidayId);

    res.status(200).json({
      message: 'Holiday deleted successfully',
      data: deletedHoliday,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all holidays.
 */
export const handleDeleteAllHolidays = async (req, res, next) => {
  try {
    const deletedCount = await processRemoveAllHolidays();

    res.status(200).json({
      message: `${deletedCount} holidays deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
