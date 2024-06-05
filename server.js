const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

// Define the schema with various types, queries, and mutations
const schema = buildSchema(`
  type Query {
    person(id: Int!): Person
    people: [Person]
    post(id: Int!): Post
    posts: [Post]
    comment(id: Int!): Comment
    comments: [Comment]
  }

  type Mutation {
    addPerson(name: String!, age: Int!): Person
    updatePerson(id: Int!, name: String, age: Int): Person
    deletePerson(id: Int!): Person
    addPost(authorId: Int!, title: String!, content: String!): Post
    updatePost(id: Int!, title: String, content: String): Post
    deletePost(id: Int!): Post
    addComment(postId: Int!, authorId: Int!, content: String!): Comment
    updateComment(id: Int!, content: String): Comment
    deleteComment(id: Int!): Comment
  }

  type Person {
    id: Int
    name: String
    age: Int
    posts: [Post]
    comments: [Comment]
  }

  type Post {
    id: Int
    title: String
    content: String
    author: Person
    comments: [Comment]
  }

  type Comment {
    id: Int
    content: String
    author: Person
    post: Post
  }
`);

// Sample data
let peopleData = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
  { id: 3, name: "Mike Johnson", age: 35 },
];

let postsData = [
  {
    id: 1,
    title: "GraphQL Introduction",
    content: "GraphQL is a query language...",
    authorId: 1,
  },
  {
    id: 2,
    title: "Advanced GraphQL",
    content: "Advanced concepts in GraphQL...",
    authorId: 2,
  },
];

let commentsData = [
  { id: 1, content: "Great post!", authorId: 2, postId: 1 },
  { id: 2, content: "Very informative.", authorId: 3, postId: 1 },
];

// Define the root resolver
const root = {
  person: ({ id }) => peopleData.find((person) => person.id === id),
  people: () => peopleData,
  post: ({ id }) => postsData.find((post) => post.id === id),
  posts: () => postsData,
  comment: ({ id }) => commentsData.find((comment) => comment.id === id),
  comments: () => commentsData,
  addPerson: ({ name, age }) => {
    const newPerson = { id: peopleData.length + 1, name, age };
    peopleData.push(newPerson);
    return newPerson;
  },
  updatePerson: ({ id, name, age }) => {
    const person = peopleData.find((p) => p.id === id);
    if (!person) return null;
    if (name !== undefined) person.name = name;
    if (age !== undefined) person.age = age;
    return person;
  },
  deletePerson: ({ id }) => {
    const personIndex = peopleData.findIndex((p) => p.id === id);
    if (personIndex === -1) return null;
    const [deletedPerson] = peopleData.splice(personIndex, 1);
    postsData = postsData.filter((post) => post.authorId !== id);
    commentsData = commentsData.filter((comment) => comment.authorId !== id);
    return deletedPerson;
  },
  addPost: ({ authorId, title, content }) => {
    const newPost = { id: postsData.length + 1, title, content, authorId };
    postsData.push(newPost);
    return newPost;
  },
  updatePost: ({ id, title, content }) => {
    const post = postsData.find((p) => p.id === id);
    if (!post) return null;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    return post;
  },
  deletePost: ({ id }) => {
    const postIndex = postsData.findIndex((p) => p.id === id);
    if (postIndex === -1) return null;
    const [deletedPost] = postsData.splice(postIndex, 1);
    commentsData = commentsData.filter((comment) => comment.postId !== id);
    return deletedPost;
  },
  addComment: ({ postId, authorId, content }) => {
    const newComment = {
      id: commentsData.length + 1,
      content,
      authorId,
      postId,
    };
    commentsData.push(newComment);
    return newComment;
  },
  updateComment: ({ id, content }) => {
    const comment = commentsData.find((c) => c.id === id);
    if (!comment) return null;
    if (content !== undefined) comment.content = content;
    return comment;
  },
  deleteComment: ({ id }) => {
    const commentIndex = commentsData.findIndex((c) => c.id === id);
    if (commentIndex === -1) return null;
    const [deletedComment] = commentsData.splice(commentIndex, 1);
    return deletedComment;
  },
  Person: {
    posts: (person) => postsData.filter((post) => post.authorId === person.id),
    comments: (person) =>
      commentsData.filter((comment) => comment.authorId === person.id),
  },
  Post: {
    author: (post) => peopleData.find((person) => person.id === post.authorId),
    comments: (post) =>
      commentsData.filter((comment) => comment.postId === post.id),
  },
  Comment: {
    author: (comment) =>
      peopleData.find((person) => person.id === comment.authorId),
    post: (comment) => postsData.find((post) => post.id === comment.postId),
  },
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
