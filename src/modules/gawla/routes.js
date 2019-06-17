const express = require('express');
const gawlaController = require('../gawla/controllers');

const router = express.Router();

router.get('/',gawlaController.getHome);

router.get('/gawla/add',gawlaController.getAddGawla);
router.post('/gawla/add',gawlaController.postAddGawla);

router.get('/gawla/edit/:id',gawlaController.getEditGawla);
// router.post('/gawla/edit',gawlaController.postAddGawla);

router.get('/gawlat',gawlaController.getGawlat);
router.get('/supers',gawlaController.getSupers);




module.exports = router;
