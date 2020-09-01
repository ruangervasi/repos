import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com',headers:{
        Authorization: `Bearer e5d5e93b25bfea91ae63bffaffe56fbcdb41ffa2`
    }
})

export default api;