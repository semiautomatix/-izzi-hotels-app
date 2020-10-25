import ApolloClient from 'apollo-boost';
import useMutation from './useMutation'
import useQuery from './useQuery'
import { AsyncStorage } from 'react-native';
// @ts-ignore
import { GRAPHQL_URL } from 'react-native-dotenv';

// this will need to be variable, possibly local storage
const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
  request: async (operation) => {    
    const token = ['verifyToken', 'forgotPassword', 'register'].includes(operation.operationName) ? null : await AsyncStorage.getItem('userToken');
    operation.setContext({
      headers: {
        authorization: token ? `JWT ${token}` : '',
      }
    });
  },  
  // uri: process.env.NODE_ENV !== 'development' ? process.env.GRAPHQL_URL : 'http://localhost:8080/graphql',
  // uri: process.env.NODE_ENV !== 'development' ? process.env.REACT_APP_GRAPHQL_URL : 'http://127.0.0.1:8000/graphql',
  // uri: 'http://ec2-54-229-233-151.eu-west-1.compute.amazonaws.com/graphql',
  uri: 'http://192.168.1.91:8000/graphql'
  // uri: 'https://dev.smartkit.co.za/graphql',
});

export { 
  client,
  useMutation,
  useQuery
};