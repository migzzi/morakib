const express = require('express');
const gawlaController = require('../gawla/controllers');

const router = express.Router();

router.get('/',gawlaController.getHome);
router.get('/add',gawlaController.getAddGawla);
router.get('/gawlat',gawlaController.getGawlat);
router.get('/supers',gawlaController.getSupers);




module.exports = router;
