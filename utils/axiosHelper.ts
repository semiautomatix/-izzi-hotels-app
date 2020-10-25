import axios from 'axios';
import { AsyncStorage } from 'react-native';

const config = {
  baseURL: 'http://192.168.1.91:8000',
  timeout: 1000,
  headers: {}
}

// helper function to assign the user token to the axios header
export const getInstance = async () => {  
  const userToken = await AsyncStorage.getItem('userToken');
  // Alter defaults after instance has been created
  // instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
  config.headers = {
    Authorization: "Bearer " + userToken
  };
  return axios.create(config);
}