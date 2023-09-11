import axios from 'axios';

const baseURL = "localhost:4000";
const apiConnect = axios.create({
    baseURL,
});

export default apiConnect;