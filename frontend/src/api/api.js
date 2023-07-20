import axios from 'axios';

const api = ()=>
{
    return axios.create({
        baseURL: 'http://localhost:5000/api'
    });
}

export default api;