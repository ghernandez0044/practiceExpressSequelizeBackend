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
