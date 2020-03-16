import axios from 'axios';

// const baseUrl = 'https://api-tests.aspecto.io';
const baseUrl = 'http://localhost:8089';

export const client = axios.create({ baseURL: `${baseUrl}/api/v2/test` });
client.interceptors.request.use((config) => {
    config.headers = { authorization: `Basic ${global.aspectoOptions.token}` };
    return config;
});
