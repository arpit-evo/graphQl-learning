# GraphQL Learning

- Query language for api , you can use both database relational and non-relational.
- We can define schema of api using `query` and `resolver` function.
- Each `Query` has `one resolver` function.

## Learn how to build your own graphQl interface

- First install following package using this command

```
npm install express graphql express-graphql (it may change)
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

4. **Interface:**

- we can define interface using `interface` keyword.
- If any type object implements interface using `implements` keyword then that type of object has to all field which interface has.

code example:

```
interface Book{
  id: Int,
  name: String,
  pnrNo: Int
}

type Person implements Book {
  id: Int
  name: String
  age: Int
  pnrNo: Int
  posts: [Post]
  comments: [Comment]
}
```

5. **Union Types:**

- Union types is made for multiple returning object like `Person and Post`.
- Keyword is `union`

code example:

```
union SearchResult = Person | Post
```

use case in code:

```
union SearchResult = Person | Post

type Query{
  search(text: String!): [SearchResult]
}
const resolvers = {
  Query: {
     search: (_, { text }) => {
      const searchResults = [];
      const lowercaseText = text.toLowerCase();

      searchResults.push(
        ...peopleData.filter((person) =>
          person.name.toLowerCase().includes(lowercaseText)
        )
      );
      searchResults.push(
        ...postsData.filter((post) =>
          post.title.toLowerCase().includes(lowercaseText)
        )
      );

      return searchResults;
    },
  },
  SearchResult: {
    __resolveType: (obj) => {
      if (obj.title) return "Post";
      if (obj.name) return "Person";
      return null;
    },
  },
}
```

6. **Input Types:**

- input types is for mutation like we make input type and give to mutation function as argument
- Declaring keyword is `input`.

code example:

```
input NewPersonInput {
  name: String
  age: Int
}

type Mutation {
    addPerson(input: NewPersonInput): Person
}

// inside resolver
 Mutation: {
    addPerson: (_, { input }) => {
      const newPerson = {
        id: peopleData.length + 1,
        name: input.name,
        age: input.age,
      };
      peopleData.push(newPerson);
      return newPerson;
    },
 }
```
