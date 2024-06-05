# GraphQL Learning

- Query language for api , you can use both database relational and non-relational.
- We can define schema of api using `type` and `resolver` function.
- Each `type` has `one resolver` function.

## Learn how to build your own graphQl interface

- First install following package using this command

```
npm install express graphql express-graphql
```

- After this here's starting code

```
const schema = buildSchema(`
  type Query {
    hello: String
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
```

## Queries terms:

1. **Fields:**

- it is object field like `Person` is object then `name` is field of object.

Query example:

```
{
  Person {
    name
  }
}
```

2. **Arguments:**

- passing value to method is called arguments.

Query example:

```
{
  Person(id: 1) {
    name
  }
}
```

3. **Aliases:**

- we can rename the query output name.

Query example:

```
{
  jane:person(id:2){
     ...subP
  }
   jade:person(id:1){
     ...subP
  }
}
```

4. **Fragments:**

- Fragments is sub part of any object which we can use multiple times in any query.
- Declare using `fragment` keyword.

Query example:

```
{
  jane:person(id:2){
     ...subP
  }
   jade:person(id:1){
     ...subP
  }
}
#fragment
fragment subP on  Person{
 	name
    age
}
```

5. **Operation Name:**

- give specific name to query

Query example;:

```
query GetPersonName {
  person{
    name
  }
}
```

6. **Variables:**

- We can declare variable using `$` sign.

Query example:

```
query GetPerson($someId: Int = 1) {
  person(id: $someId) {
    name
  }
}
```

7. **Directives:**

- it is used for conditional rendering

Query example:

```
query GetPerson($someId: Int = 1,$isPost: Boolean = false) {
  person(id: $someId) {
    name
    posts @include(if: $isPost) {
      id
    }
  }
}
```

8. **Mutation:**

- Mutation is used for dynamic changes like `addPerson` like that.
- First we can add mutation in code using thisn code:

```
type Mutation {
    addPerson(name: String!, age: Int!): Person
}
```

Query example:

```
mutation{
  addPerson(id:456,name: "jshfkef"){
    id
    name
  }
}
```

### Query types:

1. **Scaler types**

- `Int`: A signed 32‐bit integer.
- `Float`: A signed double-precision floating-point value.
- `String`: A UTF‐8 character sequence.
- `Boolean`: true or false.
- `ID`: The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. The ID type is serialized in the same way as a String; defining it as an ID signifies that it is not intended to be human‐readable.

example:

```
type Person {
  id: Int
  name: String
  age: Int
  posts: [Post]
  comments: [Comment]
}
```

2. **Enumeration types**

example:

```
enum Episode {
  NEWHOPE,
  EMPIRE,
  JEDI,
}
```

3. **Lists and Non-Null types**

- we can assign `!` behind any scaler type

example:

```
type Character {
  name: String!
  appearsIn: [Episode]!
}
```
