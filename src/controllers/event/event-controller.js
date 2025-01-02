import {
  processCreateEvent,
  processUpdateEvent,
  processGetEventById,
  processGetEvents,
  processRemoveEventById,
  processRemoveAllEvents,
} from '../../services/event/event-services.js';

/**
 * Controller function to handle event creation.
 *
 * @param {Object} req - Express request object containing the event data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the event creation,
 * or forwards the error to centralized error handling middleware.
 */
export const handleCreateEvent = async (req, res, next) => {
  const eventData = req.body;

  try {
    const result = await processCreateEvent(eventData);

    res.status(201).json({
      message: 'Event created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to handle event updates.
 *
 * @param {Object} req - Express request object containing event data in `req.body` and `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the result of the event update,
 * or forwards the error to centralized error handling middleware.
 */
export const handleUpdateEvent = async (req, res, next) => {
  const { eventId } = req.params; // Extract event ID from request parameters
  const updateData = req.body; // Extract update data from request body

  try {
    const updatedEvent = await processUpdateEvent(eventId, updateData);

    res.status(200).json({
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single event by ID.
 */
export const handleGetEventById = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const event = await processGetEventById(eventId);

    res.status(200).json({
      message: 'Event fetched successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all events with pagination and search.
 */
export const handleGetEvents = async (req, res, next) => {
  try {
    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll ? fetchAll === 'true' : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const result = await processGetEvents(options);

    res.status(200).json({
      message: 'Events fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single event by ID.
 */
export const handleDeleteEventById = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const deletedEvent = await processRemoveEventById(eventId);

    res.status(200).json({
      message: 'Event deleted successfully',
      data: deletedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all events.
 */
export const handleDeleteAllEvents = async (req, res, next) => {
  try {
    const deletedCount = await processRemoveAllEvents();

    res.status(200).json({
      message: `${deletedCount} events deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
