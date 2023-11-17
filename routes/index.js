const express = require('express');
const userRoute = require('./user.route');
const feedbackRoute = require('./feedback.route');
const adminRoute = require('./admin.route');
const router = express.Router();

router.use('/user', userRoute);
router.use('/feedback', feedbackRoute);
router.use('/admin', adminRoute);

module.exports = router;
