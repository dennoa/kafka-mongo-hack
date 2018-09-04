# kafka-mongo-hack

Trying out some integration between kafka and mongo for education purposes.

Started with the node-api-boilerplate and introduced kafka into the user create function. Instead of just writing the new user details directly to mongo, it pushes them to Kafka where a separate consumer picks up the message and write to the database. Now that Kafka is in the mix, messages can be replayed as well as consumed by other things.

## Getting started

1. Run Kafka locally: <https://kafka.apache.org/quickstart>
2. This code references a topic called "hackday" so set that up in Kafka
3. Run mongodb locally: <https://www.mongodb.com/>
4. `npm install`
5. `npm start`
6. Swagger JSON is available at: <http://localhost:3001/swagger>
7. POST /user creates a new user via Kafka

