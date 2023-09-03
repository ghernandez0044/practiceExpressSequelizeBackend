# practiceFlowFreeBackend
Practicing creating a backend for project

## Tech Stack
- JavaScript
- Node.JS
- Express
- Sequelize

## Getting Started
1. Clone repository into local machine
2. Install all necessary dependancies listed on package.json file
3. Create .env file with variables from env.example
4. Migrate the database if needed using command ``` npx dotenv sequelize db:migrate ```

## Running Server
1. Start server by running command ``` npm start ```

## Important Endpoints
1. ``` GET /api/csrf/restore ``` will allow any developer to re-set the CSRF token cookie XSRF-TOKEN
2. ``` GET /hello/world ``` is a test route which will return the text 'Hello World', in Application tab of ChromeDevTools two cookies should appear and persist through refreshes, _csrf and XSRF-TOKEN
3. ``` GET /api/set-token-cookie ``` will be used for testing setting a token cookie, can be verified through browser DevTools
4. ``` GET /api/restore-user ``` will be used to test the restoreUser middleware and check wether or not the req.user key has been populated by the middleware properly
5. ``` GET /api/require-auth ``` will be used to test user authentication, if there is no session user the route will return an error, otherwise it will return the session user's information

## Authentication Flow
1. The API login route will be pinged with a request body containing a valid credential and password combination
2. The API login handler looks for a User with the input credential in either the username or email columns
3. The hashedPassword for that found User will be compared with the input password for a match
4. If there is a match, the API login route should send back a JWT in an HTTP-only cookie and a response body holding the user's id, username, and email

## Sign Up Flow
1. The API signup route will be pinged with a request body containing a username, email, and password
2. The API signup handler will create a User with the username, an email, and a hashedPassword created from the input password
3. If the creation is successful, the API signup route should send back a JWT in an HTTP-only cookie and a response body holding the user's id, username, and email

## Log Out Flow
1. The API logout route will be pinged with a request
2. The API logout handler will remove the JWT cookie set by the login or signup API routes and return a JSON success message
