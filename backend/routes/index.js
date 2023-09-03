// Necessary imports
const express = require('express')

// Instantiate a router
const router = express.Router()

// Test route
router.get('/hello/world', function(req, res){
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.send('Hello World!')
})

// Add a XSRF-TOKEN cookie (allow any developer to re-set the CSRF token cookie)
// This route should not be available in production
router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken()
    res.cookie('XSRF-TOKEN', csrfToken)
    res.status(200).json({
        'XSRF-TOKEN': csrfToken
    })
})

module.exports = router