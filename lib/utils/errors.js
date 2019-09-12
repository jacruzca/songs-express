/* eslint-disable max-classes-per-file */
class DatabaseError extends Error {}
class CustomValidationError extends Error {}

const buildErrorResponse = (e) => ({ message: e.message });

module.exports = {
  DatabaseError,
  CustomValidationError,
  buildErrorResponse,
};
