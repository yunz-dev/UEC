/**
 * Converts a start time (in decimal hours) to a grid row position
 * Example: 9.5 (9:30 AM) -> 6
 * @param {number} startTime - Start time in decimal hours (e.g., 9.5 for 9:30 AM)
 * @returns {number} Grid row position
 */
export const startTimeToGridRow = (startTime) => {
  // Each hour takes up 2 grid rows, starting from 7 AM at row 2
  return Math.round((startTime - 7) * 2) + 2;
};

/**
 * Converts a duration (in hours) to a grid span value
 * Example: 1.5 hours -> 3 rows
 * @param {number} duration - Duration in hours
 * @returns {number} Number of grid rows to span
 */
export const durationToSpan = (duration) => {
  // Each hour spans 2 grid rows
  return Math.round(duration * 2);
};