const {
  createFeedbackValidator,
  feedbackStatusValidator,
} = require('../validators/feedback.validator');
const { Feedback } = require('../models');
const {
  handleResponse,
  handleServerError,
} = require('../utils/responseHandler');

exports.getFeedbacks = async (req, res) => {
  try {
    const response = await Feedback.findAll();
    return handleResponse(res, 200, response);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return handleResponse(res, 404, { error: 'Feedback not found.' });
    }
    return handleResponse(res, 200, feedback);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getFeedbacksByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedbacks = await Feedback.findAll({
      where: { userId },
    });

    if (!feedbacks || feedbacks.length === 0) {
      return handleResponse(res, 404, {
        error: 'No feedbacks found for the specified user',
      });
    }

    return handleResponse(res, 200, feedbacks);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const feedbackData = req.body;
    const userId = req.user.id;
    const { error, value } = createFeedbackValidator.validate(feedbackData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { feedbackText, details } = value;

    const newFeedback = await Feedback.create({
      feedbackText,
      details,
      userId,
    });

    return handleResponse(res, 201, {
      createdFeedback: newFeedback,
      message: 'Feedback sent successfully!',
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const feedbackStatus = req.body;
    const { feedbackId } = req.params;

    const { error, value } = feedbackStatusValidator.validate(feedbackStatus);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { status } = value;

    const feedback = await Feedback.findByPk(feedbackId);

    if (!feedback) {
      return handleResponse(res, 404, { error: 'Feedback not found.' });
    }

    await feedback.update({ status: status });

    return handleResponse(res, 200, feedback);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return handleResponse(res, 404, { error: 'Feedback not found.' });
    }
    await feedback.destroy();
    return handleResponse(res, 200, {
      deletedFeedback: feedback,
      message: 'Feedback deleted successfully!',
    });
  } catch (error) {
    return handleServerError(res);
  }
};
