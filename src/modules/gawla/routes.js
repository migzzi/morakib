const express = require('express');
const gawlaController = require('../gawla/controllers');

const router = express.Router();

router.get('/',gawlaController.getTest);



module.exports = router;
