// src/controllers/disciplinaryAction/disciplinary-action-controller.js
import {
  createDisciplinaryActionDetails,
  updateDisciplinaryActionDetails,
  getDisciplinaryActionDetails,
  deleteDisciplinaryActionDetails,
  getStudentDisciplinaryActionsService,
} from '../../services/disciplinaryAction/disciplinary-action-services.js';

/**
 * Controller to create a disciplinary action for a student.
 */
export const createDisciplinaryAction = async (req, res, next) => {
  const disciplinaryActionPayload = Object.assign({}, req.body);
  const { studentId } = req.params;

  try {
    const response = await createDisciplinaryActionDetails(
      studentId,
      disciplinaryActionPayload
    );

    return res.status(201).json({
      message: 'Disciplinary action created successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update a disciplinary action by ID.
 */
export const updateDisciplinaryAction = async (req, res, next) => {
  const disciplinaryActionUpdatePayload = Object.assign({}, req.body);
  const { disciplinaryActionId } = req.params;

  try {
    const response = await updateDisciplinaryActionDetails(
      disciplinaryActionId,
      disciplinaryActionUpdatePayload
    );

    return res.status(200).json({
      message: 'Disciplinary action updated successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get a disciplinary action by ID.
 */

export const getDisciplinaryAction = async (req, res, next) => {
  try {
    const { disciplinaryActionId } = req.params;

    const response = await getDisciplinaryActionDetails(disciplinaryActionId);

    return res.status(200).json({
      message: 'Disciplinary action successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a disciplinary action by ID.
 */

export const deleteDisciplinaryAction = async (req, res, next) => {
  try {
    const { disciplinaryActionId } = req.params;

    const response = await deleteDisciplinaryActionDetails(
      disciplinaryActionId
    );

    return res.status(200).json({
      message: 'Disciplinary action successfully deleted.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

// Controller function
export const getStudentDisciplinaryActions = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll ? fetchAll === 'true' : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const response = await getStudentDisciplinaryActionsService(
      studentId,
      options
    );

    return res.status(200).json({
      message: 'Student disciplinary actions successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
