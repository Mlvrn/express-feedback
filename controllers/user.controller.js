const { hashPassword, comparePassword } = require('../utils/bcrypt');
const {
  handleResponse,
  handleServerError,
} = require('../utils/responseHandler');
const { User } = require('../models');
const {
  registerValidator,
  loginValidator,
  editProfileValidator,
  changePasswordValidator,
} = require('../validators/user.validator');
const { Op } = require('sequelize');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/nodemailer');

exports.userRegister = async (req, res) => {
  try {
    const userData = req.body;

    const { error, value } = registerValidator.validate(userData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }
    const { username, email, password } = value;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
    if (existingUser) {
      return handleResponse(res, 400, {
        error: 'Username or email already exists',
      });
    }

    const hashedPassword = hashPassword(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    return handleResponse(res, 201, newUser);
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const userData = req.body;

    const { error, value } = loginValidator.validate(userData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { email, password } = value;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return handleResponse(res, 400, { error: 'Invalid email or password.' });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return handleResponse(res, 400, { error: 'Invalid email or password.' });
    }

    return handleResponse(res, 200, {
      token: generateToken(user),
      message: 'Login Successful!',
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    return handleResponse(res, 200, response);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return handleResponse(res, 404, {
        error: 'User not found.',
      });
    }
    const { email, username } = user;

    return handleResponse(res, 200, { email, username });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userData = req.body;
    const userId = req.user.id;

    const { error, value } = editProfileValidator.validate(userData);

    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { email, username } = value;

    const existingUser = await User.findOne({
      where: {
        id: { [Op.not]: userId },
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return handleResponse(res, 400, {
        error: 'Username or email already exists',
      });
    }

    const updatedUser = await User.update(
      { username, email },
      { where: { id: userId }, returning: true, plain: true }
    );

    return handleResponse(res, 200, {
      message: 'Profile updated successfully',
      user: updatedUser[1],
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return handleResponse(res, 404, { error: 'User not found.' });
    }

    await user.destroy();

    return handleResponse(res, 200, {
      deletedUser: user,
      message: 'User Deleted Successfully.',
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const { error, value } = changePasswordValidator.validate({
      oldPassword,
      newPassword,
    });

    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const user = await User.findByPk(userId);

    const isPasswordMatch = await comparePassword(
      value.oldPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return handleResponse(res, 401, { error: 'Old password is incorrect' });
    }

    const hashedNewPassword = hashPassword(value.newPassword);
    await user.update({ password: hashedNewPassword });

    return handleResponse(res, 200, {
      message: 'Password changed successfully',
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return handleResponse(res, 404, { error: 'User not found.' });
    }

    const temporaryPassword = 'password123';

    const hashedPassword = hashPassword(temporaryPassword);
    await user.update({ password: hashedPassword });

    const emailSubject = 'Forgot Password';
    const emailText = `Your temporary password is: ${temporaryPassword}\nPlease change your password after logging in.`;
    await sendEmail(email, emailSubject, emailText);

    return handleResponse(res, 200, {
      message: 'Temporary password sent via email',
    });
  } catch (error) {
    return handleServerError(res);
  }
};
