const express = require('express');
const gawlaController = require('./controllers'),
        checkRole = require('../auth/middleware').checkRole;

const router = express.Router();

// router.get('/',gawlaController.getHome);



router.use(checkRole('manager'));

router.get('/gawla/edit/:id',gawlaController.getEditGawla);
router.post('/gawla/edit/:id',gawlaController.postEditGawla);

router.delete('/gawla/delete/:id',gawlaController.postDeleteGawla);

router.get('/gawla/add',gawlaController.getAddGawla);
router.post('/gawla/add',gawlaController.postAddGawla);

router.get('/gawla/:id',gawlaController.getGawla);
router.get('/gawlat',gawlaController.getGawlat);



const NodeGeocoder = require('node-geocoder');





module.exports = router;

