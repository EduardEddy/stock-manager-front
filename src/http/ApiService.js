import axios from 'axios';
import { envs } from '../config/envs';

// Crear una instancia de Axios
const httpClient = axios.create({
  baseURL: envs.apiServer,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Métodos (como los tienes, están bien)

export const get = async (url, headers = {}) => {
  try {
    const response = await httpClient.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('GET error:', error);
    throw error;
  }
};

export const post = async (url, data, headers = {}) =>
  await httpClient.post(url, data, { headers });

export const put = async (url, data, headers = {}) => {
  try {
    const response = await httpClient.put(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('PUT error:', error);
    throw error;
  }
};

export const remove = async (url, headers = {}) => {
  try {
    const response = await httpClient.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error('DELETE error:', error);
    throw error;
  }
};
