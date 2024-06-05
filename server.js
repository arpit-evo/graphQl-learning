const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

// Define the schema
const schema = buildSchema(`
  type Query {
    hello: String
    Arpit: String
  }
`);

// Define the root resolver
const root = {
  hello: () => "Hello, world!",
};

// Setup the GraphQL endpoint with GraphiQL enabled
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL interface
  })
);

// Start the server
app.listen(4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
