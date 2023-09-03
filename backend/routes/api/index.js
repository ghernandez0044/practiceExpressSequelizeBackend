// Necessary imports
const express = require('express')
const { setTokenCookie } = require('../../utils/auth')
const { restoreUser } = require('../../utils/auth.js')
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

// Test route for restoreUser
router.use(restoreUser)

router.get('/restore-user', (req, res) => {
    return res.json(req.user)
})

module.exports = router