const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// const auth = require('auth');

const sauceController = require('../controllers/sauces');

// TODO: build sauces routes, import sauces controller, export router
router.get('/', auth, sauceController.displayAllSauces);

router.post('/', auth, multer, sauceController.createSauce);

router.put('/:id', auth, sauceController.modifySauce);

router.delete('/:id', auth, sauceController.deleteSauce);

router.get('/:id', auth, sauceController.displaySingleSauce);


module.exports = router;



