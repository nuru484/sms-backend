import {
  processCreateTerm,
  processUpdateTerm,
  processGetTermById,
  processGetTerms,
  processRemoveTermById,
  processRemoveAllTerms,
} from '../../services/term/term-services.js';

/**
 * Controller function to handle term creation.
 *
 * @param {Object} req - Express request object containing the term data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the term creation,
 * or forwards the error to centralized error handling middleware.
 */
export const handleCreateTerm = async (req, res, next) => {
  const termData = req.body;

  try {
    const result = await processCreateTerm(termData);

    res.status(201).json({
      message: 'Term created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to handle term updates.
 *
 * @param {Object} req - Express request object containing term data in `req.body` and `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the result of the term update,
 * or forwards the error to centralized error handling middleware.
 */
export const handleUpdateTerm = async (req, res, next) => {
  const { termId } = req.params; // Extract term ID from request parameters
  const updateData = req.body; // Extract update data from request body

  try {
    const updatedTerm = await processUpdateTerm(termId, updateData);

    res.status(200).json({
      message: 'Term updated successfully',
      data: updatedTerm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single term by ID.
 */
export const handleGetTermById = async (req, res, next) => {
  const { termId } = req.params;

  try {
    const term = await processGetTermById(termId);

    res.status(200).json({
      message: 'Term fetched successfully',
      data: term,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all terms with pagination and search.
 */
export const handleGetTerms = async (req, res, next) => {
  try {
    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll ? fetchAll === 'true' : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const result = await processGetTerms(options);

    res.status(200).json({
      message: 'Terms fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single term by ID.
 */
export const handleDeleteTermById = async (req, res, next) => {
  const { termId } = req.params;

  try {
    const deletedTerm = await processRemoveTermById(termId);

    res.status(200).json({
      message: 'Term deleted successfully',
      data: deletedTerm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all terms.
 */
export const handleDeleteAllTerms = async (req, res, next) => {
  try {
    const deletedCount = await processRemoveAllTerms();

    res.status(200).json({
      message: `${deletedCount} terms deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
