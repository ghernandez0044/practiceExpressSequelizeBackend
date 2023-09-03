// Necessary imports
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { environment } = require('./config')
const { validationError, ValidationError } = require('sequelize')
const routes = require('./routes')

// Checking if the environment is in production or not by checking the environment key in the configuration file
const isProduction = environment === 'production'

// Initialize the Express application
const app = express()

// Connect the morgan middleware for logging information about requests and responses
app.use(morgan('dev'))

// Add the cookie-parser middleware for parsing cookies
app.use(cookieParser())

// Add the express.json middleware for parsing JSON bodies of requests with Content-Type of "application/json"
app.use(express.json())

// Using the cors middleware, only allow CORS (Cross-Origin Resource Sharing) in development because React frontend will be served from a different server than the Express server, in production, all of our React and Express resources will come from the same origin
if(!isProduction){
    app.use(cors())
}

// Enable better overall security with the helmet middleware, a policy of cross-origin will allow images with URLs to render in deployment
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))

// Set the _csrf token that is http-only to any server response and create req.csrfToken method that will be set to XSRF-TOKEN, these two cookies work together to provide CSRF
app.use(csurf({cookie: {secure: isProduction, sameSite: isProduction && "Lax", httpOnly: true}}))

// Connect all the routes
app.use(routes)

// Express error handling

// Resource not found error handler, catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {
    const err = new Error('The requested resource could not be found.')
    err.title = 'Resource Not Found'
    err.errors = ['The Requested resource could not be found.']
    err.status = 404
    next(err)
})

// Sequelize error handler, catching sequelize errors and formatting them before sending the error response
app.use((err, _req, _res, next) => {
    // Check if error is a Sequelize error
    if(err instanceof ValidationError){
        err.errors = err.errors.map((e) => e.message)
        err.title = 'Validation error'
    }
    next(err)
})

// Error formatter error handler, formatting all the errors before returning a JSON response
app.use((err, _req, res, _next) => {
    res.status(err.status || 500)
    console.error(err)
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    })
})


module.exports = app