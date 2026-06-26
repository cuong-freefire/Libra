import axios from 'axios'

export const axiosApi = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    timeout: 5000, // Thời gian chờ phản hồi
}) 
