import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const ADD_BOOK_DETAILS = gql`
  mutation addBook($name: String!, $author: String!) {
    addBook(name: $name, author: $author) {
      name
      author
    }
  }
`;

const AddBook = () => {
  let name, author;
  const [addBook] = useMutation(ADD_BOOK_DETAILS);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addBook({ variables: { name: name.value, author: author.value } });
      }}
    >
      <input ref={value => (name = value)} id="name" />
      <input ref={value => (author = value)} id="author" />
      <button type="submit"> Add Book </button>
    </form>
  );
};

export default AddBook;
