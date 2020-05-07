import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
});

export default client;

const query = gql`
  query getNotes {
    notes {
      id
    }
  }
`;

client
  .query({
    query,
  })
  .then(res => {
    console.log(res);
  });
