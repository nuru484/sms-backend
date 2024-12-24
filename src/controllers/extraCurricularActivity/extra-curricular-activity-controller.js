// src/controllers/extracurricularActivity/extracurricular-activity-controllers.js

import {
  createExtracurricularActivityDetails,
  updateExtracurricularActivityDetails,
  getExtracurricularActivityDetails,
  deleteExtracurricularActivityDetails,
  getAllStudentExtracurricularActivitiesService,
} from '../../services/extraCurricularActivity/extra-curricular-activity-services.js';

/**
 * Controller to create an extracurricular activity for a student.
 */
export const createExtracurricularActivity = async (req, res, next) => {
  const extracurricularActivityPayload = Object.assign({}, req.body);
  const { studentId } = req.params;

  try {
    const response = await createExtracurricularActivityDetails(
      studentId,
      extracurricularActivityPayload
    );

    return res.status(201).json({
      message: 'Extracurricular activity created successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update an extracurricular activity by ID.
 */
export const updateExtracurricularActivity = async (req, res, next) => {
  const extracurricularActivityUpdatePayload = Object.assign({}, req.body);
  const { extracurricularActivityId } = req.params;

  try {
    const response = await updateExtracurricularActivityDetails(
      extracurricularActivityId,
      extracurricularActivityUpdatePayload
    );

    return res.status(200).json({
      message: 'Extracurricular activity updated successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get an extracurricular activity by ID.
 */
export const getExtracurricularActivity = async (req, res, next) => {
  try {
    const { extracurricularActivityId } = req.params;

    const response = await getExtracurricularActivityDetails(
      extracurricularActivityId
    );

    return res.status(200).json({
      message: 'Extracurricular activity successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete an extracurricular activity by ID.
 */
export const deleteExtracurricularActivity = async (req, res, next) => {
  try {
    const { extracurricularActivityId } = req.params;

    const response = await deleteExtracurricularActivityDetails(
      extracurricularActivityId
    );

    return res.status(200).json({
      message: 'Extracurricular activity successfully deleted.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get extracurricular activities for a student.
 */
export const getStudentExtracurricularActivities = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll === 'true',
      searchQuery: searchQuery ? searchQuery : null,
    };

    const response = await getAllStudentExtracurricularActivitiesService(
      studentId,
      options
    );

    return res.status(200).json({
      message: 'Student extracurricular activities successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
