// Necessary imports
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { environment } = require('./config')
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

module.exports = app