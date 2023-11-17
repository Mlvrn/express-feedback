const { Op } = require('sequelize');
const { Admin } = require('../models');
const { comparePassword, hashPassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');
const {
  registerValidator,
  loginValidator,
} = require('../validators/user.validator');
const {
  handleResponse,
  handleServerError,
} = require('../utils/responseHandler');

exports.adminRegister = async (req, res) => {
  try {
    const adminData = req.body;

    const { error, value } = registerValidator.validate(adminData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }
    const { username, email, password } = value;

    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
    if (existingAdmin) {
      return handleResponse(res, 400, {
        error: 'Username or email already exists',
      });
    }

    const hashedPassword = hashPassword(password);

    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      email,
    });

    return handleResponse(res, 201, newAdmin);
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const adminData = req.body;

    const { error, value } = loginValidator.validate(adminData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { email, password } = value;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return handleResponse(res, 400, { error: 'Invalid email or password.' });
    }

    const isPasswordMatch = await comparePassword(password, admin.password);
    if (!isPasswordMatch) {
      return handleResponse(res, 400, { error: 'Invalid email or password.' });
    }

    return handleResponse(res, 200, {
      token: generateToken(admin),
      message: 'Login Successful!',
    });
  } catch (error) {
    return handleServerError(res);
  }
};
