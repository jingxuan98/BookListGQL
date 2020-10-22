import { ApolloProvider } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
} from "@apollo/client";
import { Dashboard } from "../components/BookInfo";
import "antd/dist/antd.css";

const Home = ({ data: any }) => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:3000/api/graphql-data"
  });

  return (
    <ApolloProvider client={client}>
      <div className="container" style={{ padding: "50px 100px" }}>
        <h1>My 'To Read' Book List</h1>
        <Dashboard />
      </div>
    </ApolloProvider>
  );
};

export default Home;
