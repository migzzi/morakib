const express = require('express');
const gawlaController = require('./controllers'),
        checkRole = require('../auth/middleware').checkRole;

const router = express.Router();

// router.get('/',gawlaController.getHome);



// router.use(checkRole('manager'));


router.get('/gawla/edit/:id',checkRole('manager'),gawlaController.getEditGawla);
router.post('/gawla/edit/:id',checkRole('manager'),gawlaController.postEditGawla);

router.delete('/gawla/delete/:id',checkRole('manager'),gawlaController.postDeleteGawla);

router.get('/gawla/add',checkRole('manager'),gawlaController.getAddGawla);
router.post('/gawla/add',checkRole('manager'),gawlaController.postAddGawla);
router.get('/manager/inspectors',checkRole('manager'),gawlaController.getInspectors);


router.get('/gawla/:id',checkRole(['manager','inspector']),gawlaController.getGawla);
router.get('/gawlat',checkRole(['manager','inspector']),gawlaController.getGawlat);





const NodeGeocoder = require('node-geocoder');





module.exports = router;

