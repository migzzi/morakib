const express = require('express');
const gawlaController = require('../gawla/controllers'),
        checkRole = require('../auth/middleware').checkRole;

const router = express.Router()




router.get('/gawla/:id',checkRole('inspector'), gawlaController.getGawla);
router.get('/gawlat',checkRole('inspector'), gawlaController.getGawlat);





module.exports = router;
