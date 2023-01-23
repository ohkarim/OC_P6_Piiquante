const express = require('express');
const router = express.Router();

const signUpValidator = require('../middleware/signUpValidator')
const userController = require('../controllers/user');

router.post('/signup', signUpValidator, userController.signup);
router.post('/login', userController.login);

module.exports = router;