const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const sauceController = require('../controllers/sauces');


router.get('/', auth, sauceController.displayAllSauces);

router.post('/', auth, multer, sauceController.createSauce);

router.put('/:id', auth, multer, sauceController.modifySauce);

router.delete('/:id', auth, sauceController.deleteSauce);

router.get('/:id', auth, sauceController.displaySingleSauce);


router.post('/:id/like', auth, sauceController.likeSauces);


module.exports = router;



