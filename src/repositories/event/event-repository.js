// src/repositories/event/event-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
/**
 * Repository function to create a single event entry.
 *
 * @param {Object} eventData - Object containing event details, including academicCalendarId.
 * @returns {Promise<Object>} - Returns the created event object if successful.
 * @throws {Error} - Throws an error if there's an issue during the creation process.
 */
export const createEvent = async (eventData) => {
  try {
    const { academicCalendarId, ...rest } = eventData;

    const event = await prisma.event.create({
      data: {
        ...rest,
        academicCalendar: {
          connect: { id: parseInt(academicCalendarId, 10) },
        },
      },
    });

    return event;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to update an event entry by its ID.
 *
 * @param {number} eventId - The ID of the event to be updated.
 * @param {Object} updateData - The data to update (e.g., { name: 'Parent-Teacher Conference', description: 'Details about the event' }).
 * @returns {Promise<Object>} - Returns the updated event object if successful.
 * @throws {Error} - Throws an error if the event is not found or there's a database issue.
 */
export const updateEventById = async (eventId, updateData) => {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(eventId, 10) },
      data: updateData,
    });

    return updatedEvent;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single event entry by its ID.
 *
 * @param {number} eventId - The ID of the event to fetch.
 * @returns {Promise<Object>} - Returns the event object if found.
 * @throws {Error} - Throws an error if the event is not found or there's a database issue.
 */
export const fetchEventById = async (eventId) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId, 10) },
      include: { academicCalendar: true, participants: true },
    });

    return event;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch events with pagination and optional search by name.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery, academicCalendarId).
 * @returns {Promise<Object>} - Returns an object containing the events and pagination info.
 */
export const fetchEvents = async (options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    // Define search filters for name, description, and date.
    const searchFilters = {
      ...(searchQuery && {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        description: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        // Check if searchQuery is a valid date string, and if so, filter by date
        date: searchQuery
          ? {
              equals: new Date(searchQuery), // You can use `gte`, `lte`, `equals` based on how you want to filter
            }
          : undefined,
      }),
    };

    // Count the total number of events matching the filters
    const total = await prisma.event.count({
      where: searchFilters,
    });

    let events;
    if (fetchAll) {
      events = await prisma.event.findMany({
        where: searchFilters,
        include: { academicCalendar: true, participants: true },
        orderBy: {
          date: 'asc',
        },
      });
    } else {
      events = await prisma.event.findMany({
        where: searchFilters,
        skip,
        take: limit,
        include: { academicCalendar: true, participants: true },
        orderBy: {
          date: 'asc',
        },
      });
    }

    return {
      data: events,
      pagination: fetchAll
        ? null
        : {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete a single event entry by ID.
 *
 * @param {number} eventId - The ID of the event to delete.
 * @returns {Promise<Object>} - Returns the deleted event object.
 */
export const deleteEventById = async (eventId) => {
  try {
    const event = await prisma.event.delete({
      where: { id: parseInt(eventId, 10) },
    });

    return event;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all events.
 *
 * @returns {Promise<number>} - Returns the count of deleted event entries.
 */
export const deleteAllEvents = async () => {
  try {
    const response = await prisma.event.deleteMany();

    return response.count;
  } catch (error) {
    throw error;
  }
};
