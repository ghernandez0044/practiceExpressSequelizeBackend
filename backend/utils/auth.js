// Necessary imports
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')
const { User } = require('../db/models')
const { secret, expiresIn } = jwtConfig

// Setting the JWT cookie after a user is logged in or signed up, this function will be used in the login and signup routes
const setTokenCookie = (res, user) => {
    const token = jwt.sign({data: user.toSafeObject()}, secret, {expiresIn: parseInt(expiresIn)})
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('token', token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    })
    return token
}

// Will restore the session user based on the contents of the JWT cookie, this middleware will be connected to the API router so that all API route handlers will check if there is a current user logged in or not
const restoreUser = (req, res, next) => {
    const { token } = req.cookies
    req.user = null
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if(err){
            return next()
        }
        try {
            const { id } = jwtPayload.data
            req.user = await User.scope('currentUser').findByPk(id)
        } catch (error) {
            res.clearCookie('token')
            return next()
        }
        if(!req.user) res.clearCookie('token')
        return next()
    })
}

// Will require a session user to be authenticated before accessing a route, will be connected directly to route handlers where there needs to be a current user logged in for the actions in those route handlers
const requireAuth = function(req, _res, next){
    if(req.user) return next()

    const err = new Error('Authentication required')
    err.title = 'Authentication required'
    err.errors = ['Authentication required']
    err.status = 401
    return next(err)
}

module.exports = { setTokenCookie, restoreUser, requireAuth }