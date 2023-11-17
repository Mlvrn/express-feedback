const { verifyToken } = require('../utils/jwt');
const {
  handleResponse,
  handleServerError,
} = require('../utils/responseHandler');
const { User } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return handleResponse(res, 400, { error: 'User is not authenticated' });

    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return handleResponse(res, 400, { error: 'Token is invalid!' });
    }

    const { id, role } = decoded;
    const user = await User.findByPk(id);
    if (!user) {
      return handleResponse(res, 400, { error: 'Token is invalid!' });
    }
    req.user = { id, role };
    next();
  } catch (error) {
    handleServerError(res);
  }
};
