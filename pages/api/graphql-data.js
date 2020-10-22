import { ApolloServer, gql } from "apollo-server-micro";
import { v4 as uuidv4 } from "uuid";

const books = {};
const addBook = book => {
  const id = uuidv4();
  return (books[id] = { ...book, id });
};

addBook({ name: "The Hungaruan Sausage", author: "ben Grunfeld" });

const typeDefs = gql`
  type Book {
    id: ID
    name: String
    author: String
  }
  type Query {
    books: [Book]
  }
  type Mutation {
    addBook(name: String!, author: String!): Book
    updateBook(id: ID!, name: String!, author: String!): Book
    deleteBook(id: ID!): DeleteResponse
  }

  type DeleteResponse {
    ok: Boolean!
  }
`;

const resolvers = {
  Query: {
    books: () => Object.values(books)
  },

  Mutation: {
    addBook: async (parent, book) => {
      return addBook(book);
    },

    updateBook: async (parent, { id, ...book }) => {
      if (!books[id]) {
        throw new Error("Book doesn't exist");
      }

      books[id] = {
        ...books[id],
        ...book
      };

      return books[id];
    },

    deleteBook: async (parent, { id }) => {
      const ok = Boolean(books[id]);
      delete books[id];

      return { ok };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = server.createHandler({ path: "/api/graphql-data" });

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
