import {
  createBehaviorAndExtracurricularForStudent,
  updateBehaviorAndExtracurricularForStudent,
} from '../../services/studentFormerSchool/behavior-extracurricular-services.js';

// ################################################################################################

// Controller to handle the creation of behavior and extracurricular details for a student
export const createBehaviorAndExtracurricular = async (req, res, next) => {
  try {
    // Extract userId and formerSchoolId from the request parameters
    const { studentId, formerSchoolId } = req.params;

    // Extract required data from the request body
    const behaviorAndExtracurricularData = req.body;

    behaviorAndExtracurricularData.formerSchoolId = formerSchoolId;

    // Call the service layer to handle the logic for creating behavior and extracurricular details
    const behaviorAndExtracurricular =
      await createBehaviorAndExtracurricularForStudent(
        studentId,
        formerSchoolId,
        behaviorAndExtracurricularData
      );

    // Respond to the client with the created behavior and extracurricular details
    return res.status(201).json({
      message: 'Behavior and extracurricular details created successfully',
      behaviorAndExtracurricular,
    });
  } catch (error) {
    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};

// ################################################################################################

// Controller to handle the update of behavior and extracurricular details for a student
export const updateBehaviorAndExtracurricular = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const updateData = req.body;

    // Extract userId and behaviorAndExtracurricularId from the request parameters
    const { studentId, behaviorAndExtracurricularId } = req.params;

    // Call the service layer to handle the logic for updating behavior and extracurricular details
    const updatedBehaviorAndExtracurricular =
      await updateBehaviorAndExtracurricularForStudent(
        studentId,
        behaviorAndExtracurricularId,
        updateData
      );

    // Respond to the client with the updated behavior and extracurricular details
    return res.status(200).json({
      message: 'Behavior and extracurricular details updated successfully',
      updatedBehaviorAndExtracurricular,
    });
  } catch (error) {
    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
