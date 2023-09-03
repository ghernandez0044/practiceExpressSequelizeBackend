// Necessary imports
const express = require('express')
const { setTokenCookie } = require('../../utils/auth')
const { User } = require('../../db/models')

// Instantiate a router
const router = express.Router()

// Test route
router.post('/test', (req, res) => {
    res.json({requestBody: req.body})
})

// Test route for setTokenCookie, see if there is a token cookie set in your nrowser's DevTools
router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'demouser'
        }
    })
    setTokenCookie(res, user)
    return res.json({ user: user })
})

module.exports = router