// Necessary imports
const express = require('express')

// Instantiate a router
const router = express.Router()

// Test route
router.get('/hello/world', function(req, res){
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.send('Hello World!')
})

module.exports = router