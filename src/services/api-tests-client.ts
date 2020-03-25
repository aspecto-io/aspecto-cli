import axios from 'axios';

const baseUrl = process.env.API_TESTS_BASE_URL ?? 'https://api-tests.aspecto.io';

export const client = axios.create({ baseURL: `${baseUrl}/api/v2/test` });
client.interceptors.request.use((config) => {
    config.headers = { authorization: `Basic ${global.aspectoOptions.token}` };
    return config;
});
