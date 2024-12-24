import {
  createStudentBehaviorDetails,
  updateStudentBehaviorDetails,
  getStudentBehaviorDetails,
  deleteStudentBehaviorDetails,
  getAllStudentBehaviorsDetails,
} from '../../services/student-behavior/student-behavior-services.js';

/**
 * Controller to create a student behavior record.
 */
export const createStudentBehavior = async (req, res, next) => {
  const behaviorPayload = Object.assign({}, req.body);
  const { studentId } = req.params;
  const reporterId = req.user.id;

  try {
    const response = await createStudentBehaviorDetails(
      studentId,
      reporterId,
      behaviorPayload
    );

    return res.status(201).json({
      message: 'Student behavior record created successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update a student behavior record by ID.
 */
export const updateStudentBehavior = async (req, res, next) => {
  const behaviorUpdatePayload = Object.assign({}, req.body);
  const { behaviorId } = req.params;

  try {
    const response = await updateStudentBehaviorDetails(
      behaviorId,
      behaviorUpdatePayload
    );

    return res.status(200).json({
      message: 'Student behavior record updated successfully.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get a student behavior record by ID.
 */
export const getStudentBehavior = async (req, res, next) => {
  try {
    const { behaviorId } = req.params;

    const response = await getStudentBehaviorDetails(behaviorId);

    return res.status(200).json({
      message: 'Student behavior record successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a student behavior record by ID.
 */
export const deleteStudentBehavior = async (req, res, next) => {
  try {
    const { behaviorId } = req.params;

    const response = await deleteStudentBehaviorDetails(behaviorId);

    return res.status(200).json({
      message: 'Student behavior record successfully deleted.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get all behavior records for a student.
 */
export const getStudentBehaviors = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll === 'true',
      searchQuery: searchQuery ? searchQuery : null,
    };

    const response = await getAllStudentBehaviorsDetails(studentId, options);

    return res.status(200).json({
      message: 'Student behavior records successfully fetched.',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
