# node-api-boilerplate

* ESM to allow ES modules in Node <https://www.npmjs.com/package/esm>
* Mongoose for db stuff <https://www.npmjs.com/package/mongoose>
* Ajv for validation <https://www.npmjs.com/package/ajv>
* Swagger for API docs <https://swagger.io/>

## Getting started

Make sure you have MongoDB running locally.

```
git clone git@github.com:dennoa/node-api-boilerplate.git
cd node-api-boilerplate
npm i
npm run dev
```

Without nodemon
`npm start`

Swagger JSON at <http://localhost:3001/swagger>

## Api components

API components are in folders under /components. Each folder would normally be responsible for a different entity (e.g. user)

1. A component folder has both api and swagger subfolders to support the api routes and documentation respectively
2. Include the api routes in /routes.js
3. Include the swagger doc fragments in /swagger.js
4. The schema subfolder holds request schema definitions that are reused by both Ajv validation and swagger
5. The sample `user` component has examples of creating, querying, retrieiving and deleting. It also provides some authentication support

## Authentication

Standard username / password authentication is included with the `user` component. It uses bcrypt: <https://www.npmjs.com/package/bcryptjs> for password stuff and jsonwebtoken: <https://www.npmjs.com/package/jsonwebtoken> for JWTs.

A password can be specified on user creation and can also be reset to something random (to support a forgotten password process).

Some of the `user` functions are secured (require a JWT) and others not (see the swagger docs). JWTs are returned from the authentication operation and expire after 12 hours.

## Swagger

Uses swagger 2.0 <https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md> as tool support for openapi 3.0 is currently limited.

The structure of a swagger JSON document is such that each component (user, etc.) typically contributes to multiple top-level sections. All contributions need to be combined to produce a final document. The strategy of this boilerplate is to have each component define its own swagger fragments with a base swagger function responsible for combining them all together.

Another aspect of swagger is that it can be very repetitive across an API. Since we want consistency across our various API operations, the swagger definitions for each operation tend to follow the same patterns. This boilerplate uses swagger-doc-helper: <https://www.npmjs.com/package/swagger-doc-helper> to simplify construction of swagger definitions and ensure consistency.

## Tests

Tests are located under the `/test` folder with subfolders for each component or area being tested.

Uses Ava: <https://www.npmjs.com/package/ava> although the ability to run tests concurrently is highly under-utilised. Imported dependencies result in the same dependency module instance being used across all tests - which means tests end up using the stubbed behaviour of other tests. Because of this, many of the tests are run in serial.

The tests usually cover end-to-end request handling using supertest: <https://www.npmjs.com/package/supertest> with the mongoose model being stubbed using sinon: <https://www.npmjs.com/package/sinon> to avoid database access.

It would be possible to inject dependencies rather than import them, but I feel that the added code complexity outweighs the benefit of test concurrency.

## Landing Page

`/landing-page`

Includes a basic index pug/jade file used to display a landing page with instructions. NOT intended to support a complex front-end app.
See <https://devhints.io/pug>
