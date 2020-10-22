import { useQuery, useMutation } from "@apollo/react-hooks";
import { useState, useEffect } from "react";
import {
  GET_BOOK_DETAILS,
  SET_BOOK_DETAILS,
  DELETE_BOOK_DETAILS,
  ADD_BOOK_DETAILS
} from "./GqlMutations";
import { List, Modal, Form, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const Dashboard = () => {
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

  const handleDeleteBookDetails = ID => {
    deleteBook({
      variables: { id: ID }
    });
    refetch();
    handleDataSet(true);
  };

  const handleClearForm = value => {
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
        onCancel={handleCancel}
        footer={[
          <button
            onClick={e => {
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
              handleClearForm("update");
            }}
            className="green-button"
          >
            Update
          </button>
        ]}
      >
        <form id="update-form">
          <h3 style={{ marginLeft: "15px", fontSize: "16px" }}>
            Update Book Name:{" "}
          </h3>
          <input
            placeholder="Book Name"
            type="text"
            ref={value => (nameUpdate = value)}
            id="nameUpdate"
          />
          <h3
            style={{ marginLeft: "15px", fontSize: "16px", marginTop: "15px" }}
          >
            Update Author Name:{" "}
          </h3>
          <input
            placeholder="Author"
            type="text"
            ref={value => (authorUpdate = value)}
            id="authorUpdate"
          />
        </form>
      </Modal>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="column" style={{ width: "100%" }}>
      <Input
        className="search-input"
        placeholder="Search Book Title"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => handleDataSet(false)}
        //prefix={<SearchOutlined />}
      />
      <form id="add-form" className="row">
        <input
          type="text"
          placeholder="Book Name"
          ref={value => (nameAdd = value)}
          id="nameAdd"
        />
        <input
          type="text"
          placeholder="Author"
          ref={value => (authorAdd = value)}
          id="authorAdd"
        />
        <button
          className="green-button"
          style={{ width: "250px" }}
          onClick={e => {
            e.preventDefault();
            addBook({
              variables: { name: nameAdd.value, author: authorAdd.value }
            });
            refetch();
            handleDataSet(true);
            handleClearForm("add");
          }}
        >
          {" "}
          Add Book{" "}
        </button>
      </form>
      {renderModal()}

      {searchResults && (
        <List
          className="list-table"
          size="large"
          header={<div className="list-header">Books Details</div>}
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
                <button
                  className="green-button"
                  onClick={() => handleModal(item)}
                  key={item.id + "edit"}
                >
                  Edit
                </button>,
                <button
                  className="red-button"
                  onClick={() => handleDeleteBookDetails(item.id)}
                  key={item.id}
                >
                  Delete
                </button>
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

export default Dashboard;

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
