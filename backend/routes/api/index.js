// Necessary imports
const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth')
const { User } = require('../../db/models')

// Instantiate a router
const router = express.Router()

// Test route
router.post('/test', (req, res) => {
    res.json({requestBody: req.body})
})

// Test route for setTokenCookie, see if there is a token cookie set in your browser's DevTools
router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'demouser'
        }
    })
    setTokenCookie(res, user)
    return res.json({ user: user })
})

// Test route for restoreUser, see if response has the demo user information returned as JSON, you can remove token cookie manually and refresh, the JSON response should be empty
router.use(restoreUser)

router.get('/restore-user', (req, res) => {
    return res.json(req.user)
})

// Test route for requireAuth, if there is no session user, the route will return an error, otherwise it will return the session user's information
router.get('/require-auth', requireAuth, (req, res) => {
    return res.json(req.user)
})


module.exports = router