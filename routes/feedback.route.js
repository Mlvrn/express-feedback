const express = require('express');
const {
  createFeedback,
  getFeedbacksByUserId,
  getFeedbackById,
  updateFeedbackStatus,
  getFeedbacks,
  deleteFeedback,
} = require('../controllers/feedback.controller');

const { authorizeAdmin } = require('../middlewares/authorization');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

router.use(authenticate);

router.get('/myFeedbacks', getFeedbacksByUserId);
router.get('/:feedbackId', authorizeAdmin, getFeedbackById);
router.get('/all', authorizeAdmin, getFeedbacks);
router.post('/create', createFeedback);

router.put('/update/:feedbackId', authorizeAdmin, updateFeedbackStatus);
router.delete('/delete/:feedbackId', authorizeAdmin, deleteFeedback);

module.exports = router;
