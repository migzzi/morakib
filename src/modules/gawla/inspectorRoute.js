const express = require('express');
const gawlaController = require('../gawla/controllers'),
        checkRole = require('../auth/middleware').checkRole;

const router = express.Router()



router.use(checkRole('inspector'));

router.get('/gawla/:id',gawlaController.getGawla);
router.get('/gawlat',gawlaController.getGawlat);





module.exports = router;
