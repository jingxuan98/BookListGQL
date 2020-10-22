import { gql } from "apollo-boost";

export const GET_BOOK_DETAILS = gql`
  query {
    books {
      name
      author
      id
    }
  }
`;

export const ADD_BOOK_DETAILS = gql`
  mutation addBook($name: String!, $author: String!) {
    addBook(name: $name, author: $author) {
      name
      author
    }
  }
`;

export const SET_BOOK_DETAILS = gql`
  mutation updateBook($id: ID!, $name: String!, $author: String!) {
    updateBook(id: $id, name: $name, author: $author) {
      id
      name
      author
    }
  }
`;

export const DELETE_BOOK_DETAILS = gql`
  mutation deleteBook($id: ID!) {
    deleteBook(id: $id) {
      ok
    }
  }
`;
