const {
  handleServerError,
  handleResponse,
} = require('../utils/responseHandler');

exports.authorizeAdmin = (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== 1) {
      return handleResponse(res, 403, {
        error: 'Access forbidden. Admin authorization required.',
      });
    }

    next();
  } catch (error) {
    handleServerError(res);
  }
};
