// Necessary imports
const express = require('express')

// Instantiate a router
const router = express.Router()

// Test route
router.post('/test', (req, res) => {
    res.json({requestBody: req.body})
})

module.exports = router