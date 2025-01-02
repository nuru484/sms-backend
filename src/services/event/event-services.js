import {
  createEvent,
  updateEventById,
  fetchEventById,
  fetchEvents,
  deleteEventById,
  deleteAllEvents,
} from '../../repositories/event/event-repository.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to create a single event entry.
 *
 * @param {Object} eventData - Object containing event details.
 * @returns {Promise<Object>} - Returns the created event object.
 * @throws {CustomError} - Throws an error if the creation fails.
 */
export const processCreateEvent = async (eventData) => {
  try {
    const event = await createEvent(eventData);

    // Invalidate the cache for all events and related academic calendar
    const patterns = [
      `events:{*}`,
      `academicCalendar:${event.academicCalendarId}`,
    ];
    await invalidateCache(client, patterns);

    return event;
  } catch (error) {
    handlePrismaError(error, 'Event');
  }
};

/**
 * Service function to update an event entry by its ID.
 *
 * @param {number} eventId - The ID of the event to update.
 * @param {Object} updateData - Object containing the fields to update.
 * @returns {Promise<Object>} - Returns the updated event object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const processUpdateEvent = async (eventId, updateData) => {
  try {
    const updatedEvent = await updateEventById(eventId, updateData);

    // Invalidate the cache for this specific event and related academic calendar
    const patterns = [
      `event:${eventId}`,
      `academicCalendar:${updatedEvent.academicCalendarId}`,
      'events:{*}',
    ];
    await invalidateCache(client, patterns);

    return updatedEvent;
  } catch (error) {
    handlePrismaError(error, 'Event');
  }
};

/**
 * Service function to fetch a single event entry by its ID.
 *
 * @param {number} eventId - The ID of the event to fetch.
 * @returns {Promise<Object>} - Returns the event object.
 * @throws {CustomError} - Throws an error if the event is not found.
 */
export const processGetEventById = async (eventId) => {
  try {
    const event = await fetchEventById(eventId);

    if (!event) {
      throw new CustomError(404, `Event with ID ${eventId} not found.`);
    }

    // Cache the event data
    const eventCacheKey = `event:${eventId}`;
    saveToCache(eventCacheKey, { data: event });

    return event;
  } catch (error) {
    handlePrismaError(error, 'Event');
  }
};

/**
 * Service function to fetch events with pagination and optional search.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery, academicCalendarId).
 * @returns {Promise<Object>} - Returns an object containing events and pagination info.
 * @throws {CustomError} - Throws an error if no events are found.
 */
export const processGetEvents = async (options) => {
  try {
    const response = await fetchEvents(options);

    if (!response || response.data.length === 0) {
      throw new CustomError(404, `There are currently no events available.`);
    }

    // Cache the events data
    const eventsCacheKey = `events:${JSON.stringify(options)}`;
    saveToCache(eventsCacheKey, response);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Event');
  }
};

/**
 * Service function to delete a single event entry by its ID.
 *
 * @param {number} eventId - The ID of the event to delete.
 * @returns {Promise<Object>} - Returns the deleted event object.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const processRemoveEventById = async (eventId) => {
  try {
    const deletedEvent = await deleteEventById(eventId);

    // Invalidate the cache for this event and related academic calendar
    const patterns = [
      `event:${eventId}`,
      `academicCalendar:${deletedEvent.academicCalendarId}`,
      'events:{*}',
    ];
    await invalidateCache(client, patterns);

    return deletedEvent;
  } catch (error) {
    handlePrismaError(error, 'Event');
  }
};

/**
 * Service function to delete all event entries.
 *
 * @returns {Promise<number>} - Returns the count of deleted event entries.
 * @throws {CustomError} - Throws an error if there are no entries to delete.
 */
export const processRemoveAllEvents = async () => {
  try {
    const response = await deleteAllEvents();

    if (!response || response === 0) {
      throw new CustomError(
        404,
        `There are currently no events available to delete.`
      );
    }

    // Invalidate the cache for all events
    const patterns = [`event:*`, 'events:{*}'];
    await invalidateCache(client, patterns);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Event');
  }
};
