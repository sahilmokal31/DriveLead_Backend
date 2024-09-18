const express = require('express')
const router = express.Router()
const auth = require('./auth.routes')
const search = require('./search.routes');

router.use('/api',auth);
router.use('/api', search);

module.exports = router