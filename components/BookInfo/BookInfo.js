import { useQuery, useMutation } from "@apollo/react-hooks";
import { useState, useEffect } from "react";
import {
  GET_BOOK_DETAILS,
  SET_BOOK_DETAILS,
  DELETE_BOOK_DETAILS,
  ADD_BOOK_DETAILS
} from "./GqlMutations";
import { List, Modal, Button, Input } from "antd";

const { Search } = Input;

const BookInfo = () => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [author, setAuthor] = useState("");
  const [useData, setUseData] = useState(true);

  const { loading, error, data, refetch } = useQuery(GET_BOOK_DETAILS);
  const [updateBook] = useMutation(SET_BOOK_DETAILS);
  const [deleteBook] = useMutation(DELETE_BOOK_DETAILS);
  const [addBook] = useMutation(ADD_BOOK_DETAILS);
  var nameAdd, authorAdd;

  useEffect(() => {
    if (data) {
      console.log(data.books);
      const results = data.books.filter(book =>
        book.name.toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

  const deleteBookDetails = ID => {
    deleteBook({
      variables: { id: ID }
    });
    refetch();
    handleDataSet(true);
  };

  const clearForm = value => {
    if (value == "add") document.getElementById("add-form").reset();
    else document.getElementById("update-form").reset();
  };

  const handleDataSet = boolean => {
    if (!boolean) setSearchResults(data.books);

    setUseData(boolean);
  };

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleModal = item => {
    setVisible(true);
    setId(item.id);
    setName(item.name);
    setAuthor(item.author);
    handleDataSet(true);
  };

  const handleCancel = e => {
    setVisible(false);
  };

  const renderModal = () => {
    let nameUpdate, authorUpdate;
    return (
      <Modal
        title={name}
        visible={visible}
        onOk={e => {
          e.preventDefault();
          updateBook({
            variables: {
              id: id,
              name: nameUpdate.value,
              author: authorUpdate.value
            }
          });
          setSearchResults(data.books);
          setVisible(false);
          clearForm("update");
        }}
        onCancel={handleCancel}
      >
        <form id="update-form">
          <input ref={value => (nameUpdate = value)} id="nameUpdate" />
          <input ref={value => (authorUpdate = value)} id="authorUpdate" />
        </form>
      </Modal>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <Search
        placeholder="input search text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => handleDataSet(false)}
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          addBook({
            variables: { name: nameAdd.value, author: authorAdd.value }
          });
          refetch();
          handleDataSet(true);
          clearForm("add");
        }}
        id="add-form"
      >
        <input ref={value => (nameAdd = value)} id="nameAdd" />
        <input ref={value => (authorAdd = value)} id="authorAdd" />
        <button type="submit"> Add Book </button>
      </form>
      {renderModal()}

      {searchResults && (
        <List
          size="large"
          header={<div>Header</div>}
          bordered
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 3
          }}
          dataSource={useData ? data.books : searchResults}
          renderItem={item => (
            <List.Item
              actions={[
                <a onClick={() => handleModal(item)} key={item.id + "edit"}>
                  Edit
                </a>,
                <a onClick={() => deleteBookDetails(item.id)} key={item.id}>
                  Delete
                </a>
              ]}
            >
              <List.Item.Meta title={item.name} description={item.author} />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default BookInfo;

// {data.books.map(book => (
//   <>
//     <p>
//       {book.name} - {book.author}
//     </p>

//     <form
//       key={book.id}
//       onSubmit={e => {
//         e.preventDefault();
//         updateBook({
//           variables: {
//             id: book.id,
//             name: name.value,
//             author: author.value
//           }
//         });
//       }}
//     >
//       <input ref={value => (name = value)} id="name" />
//       <input ref={value => (author = value)} id="author" />
//       <button type="submit">Update Book</button>
//     </form>
//     <button onClick={() => deleteBookDetails(book.id)}>Delete</button>
//   </>
// ))}

// console.log(data.books);

// const lowercasedFilter = filter.toLowerCase();
// const filteredData = data.books.filter(item => {
//   return Object.keys(item).some(key =>
//     item[key].toLowerCase().includes(lowercasedFilter)
//   );
// });
